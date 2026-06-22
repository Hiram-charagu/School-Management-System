$ErrorActionPreference = "Stop"

$root = "c:\Users\hp\Desktop\infosystem"
$output = Join-Path $root "all.html"

function Read-FileText {
  param([string]$Path)
  return [System.IO.File]::ReadAllText($Path)
}

function Resolve-RelativePath {
  param(
    [string]$BaseFile,
    [string]$Relative
  )
  $baseDir = Split-Path -Parent $BaseFile
  $full = [System.IO.Path]::GetFullPath((Join-Path $baseDir $Relative))
  return $full
}

function To-DataUri {
  param([string]$Path)
  $ext = [System.IO.Path]::GetExtension($Path).ToLowerInvariant()
  $mime = switch ($ext) {
    ".jpg" { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".png" { "image/png" }
    ".svg" { "image/svg+xml" }
    default { "application/octet-stream" }
  }
  $bytes = [System.IO.File]::ReadAllBytes($Path)
  $b64 = [System.Convert]::ToBase64String($bytes)
  return "data:$mime;base64,$b64"
}

$assetMap = @{
  "../assets/umma-logo.jpg" = To-DataUri (Join-Path $root "assets\umma-logo.jpg")
  "./assets/umma-logo.jpg" = To-DataUri (Join-Path $root "assets\umma-logo.jpg")
  "assets/umma-logo.jpg" = To-DataUri (Join-Path $root "assets\umma-logo.jpg")
  "../assets/umma-campus-official.jpg" = To-DataUri (Join-Path $root "assets\umma-campus-official.jpg")
  "./assets/umma-campus-official.jpg" = To-DataUri (Join-Path $root "assets\umma-campus-official.jpg")
  "assets/umma-campus-official.jpg" = To-DataUri (Join-Path $root "assets\umma-campus-official.jpg")
  "./assets/umma-campus-1.jpg" = To-DataUri (Join-Path $root "assets\umma-campus-1.jpg")
  "./assets/umma-campus-2.jpg" = To-DataUri (Join-Path $root "assets\umma-campus-2.jpg")
}

function Transform-Js {
  param([string]$Js)
  $out = $Js
  $out = [regex]::Replace($out, 'window\.location\.href\s*=\s*([^;]+);', 'window.__navigate($1);')
  $out = [regex]::Replace($out, '(?<!window\.)location\.href\s*=\s*([^;]+);', 'window.__navigate($1);')
  $out = [regex]::Replace($out, 'window\.location\.assign\(([^)]+)\)', 'window.__navigate($1)')
  $out = [regex]::Replace($out, 'window\.location\.replace\(([^)]+)\)', 'window.__navigate($1)')
  return $out
}

function Build-PageDoc {
  param([string]$HtmlPath)

  $html = Read-FileText $HtmlPath

  $html = [regex]::Replace($html, '<link[^>]*href=["'']([^"'']+\.css)["''][^>]*>', {
      param($m)
      $href = $m.Groups[1].Value
      $cssPath = Resolve-RelativePath -BaseFile $HtmlPath -Relative $href
      if (!(Test-Path $cssPath)) { return $m.Value }
      $css = Read-FileText $cssPath
      "<style>`n$css`n</style>"
    })

  $html = [regex]::Replace($html, '<script[^>]*src=["'']([^"'']+\.js)["''][^>]*>\s*</script>', {
      param($m)
      $src = $m.Groups[1].Value
      $jsPath = Resolve-RelativePath -BaseFile $HtmlPath -Relative $src
      if (!(Test-Path $jsPath)) { return $m.Value }
      $js = Transform-Js (Read-FileText $jsPath)
      "<script>`n$js`n</script>"
    })

  foreach ($key in $assetMap.Keys) {
    $html = $html.Replace($key, $assetMap[$key])
  }

  $pagePath = $HtmlPath.Substring($root.Length + 1).Replace("\", "/")
  $bridge = @"
<script>
window.__PAGE_PATH = "$pagePath";
(function () {
  function resolvePath(url) {
    try {
      var u = new URL(url, "https://local/" + window.__PAGE_PATH);
      return u.pathname.replace(/^\/+/, "") + (u.search || "");
    } catch (e) {
      return url;
    }
  }
  window.__navigate = function (url) {
    var path = resolvePath(String(url || ""));
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "navigate", path: path }, "*");
      return;
    }
    window.location.href = url;
  };
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;
    var path = resolvePath(href);
    if (window.parent && window.parent !== window) {
      e.preventDefault();
      window.parent.postMessage({ type: "navigate", path: path }, "*");
    }
  });
})();
</script>
"@

  if ($html -match "</body>") {
    $html = $html -replace "</body>", "$bridge`n</body>"
  } else {
    $html += $bridge
  }

  return $html
}

$htmlFiles = Get-ChildItem -Path $root -Recurse -Filter *.html |
  Where-Object {
    $_.FullName -notlike "*\all.html" -and
    $_.FullName -notlike "*\assets\ibb-page.html"
  } |
  Sort-Object FullName

$mapLines = @()
foreach ($file in $htmlFiles) {
  $rel = $file.FullName.Substring($root.Length + 1).Replace("\", "/")
  $doc = Build-PageDoc -HtmlPath $file.FullName
  $docJson = ConvertTo-Json $doc -Compress
  $mapLines += "    `"$rel`": $docJson"
}

$mapBody = [string]::Join(",`n", $mapLines)

$shell = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Umma University Portal</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; height: 100%; font-family: Segoe UI, Arial, sans-serif; background: #f2f6fb; }
    .app { display: grid; grid-template-rows: auto 1fr; height: 100%; }
    .top {
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      padding: 10px 12px; border-bottom: 1px solid #d8e6ef; background: #fff;
    }
    .left { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .left strong { white-space: nowrap; }
    .left small { color: #567086; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block; }
    .btn {
      border: 1px solid #bdd4e5; background: #fff; color: #0b3555;
      padding: 7px 12px; border-radius: 9px; cursor: pointer;
    }
    .btn:hover { background: #eaf4fb; }
    iframe { width: 100%; height: 100%; border: 0; background: #fff; }
  </style>
</head>
<body>
  <div class="app">
    <div class="top">
      <div class="left">
        <strong>Umma University Portal</strong>
        <small id="pathLabel">index.html</small>
      </div>
      <button class="btn" id="homeBtn" type="button">Home</button>
    </div>
    <iframe id="frame" title="Portal"></iframe>
  </div>

  <script>
  const PAGE_MAP = {
$mapBody
  };

  const frame = document.getElementById("frame");
  const pathLabel = document.getElementById("pathLabel");
  const normalize = (p) => String(p || "").replace(/^\.?\//, "");
  const parsePath = (raw) => {
    const normalized = normalize(raw || "index.html");
    const idx = normalized.indexOf("?");
    if (idx === -1) return { path: normalized, query: "" };
    return { path: normalized.slice(0, idx), query: normalized.slice(idx + 1) };
  };

  function loadPage(path) {
    const parsed = parsePath(path || "index.html");
    const doc = PAGE_MAP[parsed.path];
    if (!doc) return;
    if (parsed.query) {
      const q = new URLSearchParams(parsed.query);
      const portal = q.get("portal");
      if (portal) localStorage.setItem("umma_selected_portal", portal);
    }
    frame.srcdoc = doc;
    pathLabel.textContent = parsed.query ? (parsed.path + "?" + parsed.query) : parsed.path;
  }

  document.getElementById("homeBtn").addEventListener("click", () => loadPage("index.html"));

  window.addEventListener("message", (ev) => {
    const d = ev.data || {};
    if (d.type !== "navigate") return;
    const parsed = parsePath(d.path || "");
    if (!PAGE_MAP[parsed.path]) return;
    loadPage(d.path || parsed.path);
  });

  loadPage("index.html");
  </script>
</body>
</html>
"@

[System.IO.File]::WriteAllText($output, $shell, [System.Text.Encoding]::UTF8)
Write-Output "Built: $output"
