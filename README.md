# 🎓 AL Suhaim University - School Management System

A modern, full-featured **School Information Management System** built with HTML, CSS, and JavaScript. This system provides complete academic administration tools for students, lecturers, and administrators.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.1.0-green.svg)](https://github.com/Hiram-charagu/School-Management-System)

---

## ✨ Features

### 🎯 **Three Portal System**

#### 👨‍🎓 **Student Portal**
- View academic results and transcripts
- Check attendance records
- Access timetable and class schedules
- Manage profile information
- View fee statements and payment history
- Register for units/courses
- Read university announcements

#### 👨‍🏫 **Lecturer Portal**
- Manage class allocations
- Mark student attendance
- Submit grades and assessments
- View teaching timetable
- Access student lists per unit
- View faculty-specific courses

#### ⚙️ **Admin Portal**
- Manage student records
- Manage lecturer directory
- Configure courses and units
- View and manage attendance records
- Generate comprehensive reports
- Manage fee structures
- Post university-wide announcements
- Configure system settings
- Control registration windows

---

## 🚀 Live Demo

**Landing Page:** Modern, animated, and responsive  
**Features:** Real-time updates, secure authentication, mobile-friendly

---

## 📸 Screenshots

### Landing Page
- Beautiful gradient hero section
- Animated statistics
- Interactive portal cards
- Smooth scroll navigation

### Portals
- Clean, professional dashboards
- Intuitive navigation
- Real-time data updates
- Role-based access control

---

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Storage:** LocalStorage API
- **Design:** Custom CSS with animations
- **Icons:** Emoji Unicode
- **Fonts:** Poppins, System Fonts

---

## 📦 Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Text editor (VS Code recommended)
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Hiram-charagu/School-Management-System.git
cd School-Management-System
```

2. **Open the project**
```bash
# Simply open index.html in your browser
# Or use a local server like Live Server in VS Code
```

3. **Start using**
- Open `index.html` in your browser
- Choose a portal (Student/Lecturer/Admin)
- Register a new account or use default credentials

---

## 🔐 Default Credentials

### Admin Portal
- **Email:** admin@umma.edu
- **Password:** admin123

### Lecturer Portal
- **Staff Number:** EDE001-2026-01 (or BBT001-2026-01, SHL003-2026-01)
- **Password:** Any password (auto-creates account)

### Student Portal
- **Email:** student@umma.edu
- **Password:** student123

---

## 📂 Project Structure

```
infosystem/
├── admin/                  # Admin portal pages and scripts
│   ├── dashboard.html
│   ├── students.html
│   ├── lecturers.html
│   ├── classes.html
│   ├── attendance.html
│   ├── grades.html
│   ├── fees.html
│   ├── reports.html
│   ├── announcements.html
│   ├── settings.html
│   └── *.js, *.css
├── lecturer/               # Lecturer portal pages and scripts
│   ├── dashboard.html
│   ├── my-classes.html
│   ├── attendance.html
│   ├── gradebook.html
│   ├── timetable.html
│   ├── announcements.html
│   └── *.js, *.css
├── student/                # Student portal pages and scripts
│   ├── dashboard.html
│   ├── profile.html
│   ├── results.html
│   ├── attendance.html
│   ├── fees.html
│   ├── timetable.html
│   ├── units.html
│   ├── announcements.html
│   └── *.js, *.css
├── auth/                   # Authentication pages
│   ├── login.html
│   ├── register.html
│   ├── forgot-password.html
│   └── *.js, *.css
├── assets/                 # Shared resources
│   ├── portal-data.js     # Data management
│   ├── portal-ui.js       # UI utilities
│   └── images/
├── index.html             # Landing page
├── index.css              # Landing page styles
├── index.js               # Landing page scripts
└── README.md              # This file
```

---

## 🎨 Key Features Explained

### 🔥 Advanced Animations
- **Counter animations** for statistics
- **Parallax scrolling** effects
- **Floating cards** with 3D tilt
- **Typing effect** on hero text
- **Particle effects** on hero section
- **Ripple effects** on clicks
- **Glow effects** on buttons
- **Smooth transitions** throughout

### 🎯 User Experience
- **Fixed navigation** with smooth scroll
- **Responsive design** for all devices
- **Role-based access** control
- **Real-time data** synchronization
- **Form validations** throughout
- **Error handling** and feedback
- **Intuitive interfaces**

### 🔒 Security Features
- Password-protected portals
- Role-based authentication
- Separate data per user role
- Faculty-based access control
- Registration window controls

---

## 📊 Data Management

### LocalStorage Keys
- `umma_students` - Student records
- `umma_accounts` - User accounts
- `umma_admin_units_offered` - Course catalog
- `umma_lecturer_unit_allocations` - Lecturer assignments
- `umma_student_registered_units` - Student registrations
- `umma_lecturer_attendance_records` - Attendance data
- `umma_grades` - Grade records
- `umma_fees` - Fee information
- `umma_announcements` - System announcements
- `umma_system_settings` - Configuration

---

## 🚧 Recent Updates (v1.1.0)

### ✅ Fixed
- Data synchronization across all portals
- Student identifier consistency
- Registration format standardization
- Fee data connection
- Attendance record display
- Grade submission workflow

### ✨ Added
- Forgot password functionality
- Admin announcement management
- Student/Lecturer announcement filtering
- Edit functionality for records
- Enhanced landing page design
- Advanced animations and effects
- Statistics section
- Contact section
- Multi-column footer

### 🗑️ Removed
- Unused test files
- Build scripts
- Hardcoded data

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Hiram Charagu**
- GitHub: [@Hiram-charagu](https://github.com/Hiram-charagu)
- Email: hiram@umma.edu

---

## 🙏 Acknowledgments

- AL Suhaim University for the project requirements
- All contributors and testers
- Open source community

---

## 📞 Support

For support, email hiram@umma.edu or open an issue in the repository.

---

## 🗺️ Roadmap

### Future Enhancements
- [ ] Backend integration (Node.js/Express)
- [ ] Database implementation (MongoDB/MySQL)
- [ ] Email notifications
- [ ] PDF report generation
- [ ] Bulk data import/export
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Chat/messaging system

---

## ⚡ Performance

- Lightweight (~2MB total)
- No external dependencies
- Fast load times
- Optimized animations
- Efficient data storage

---

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

---

## 📱 Mobile Support

Fully responsive design works perfectly on:
- iOS devices
- Android devices
- Tablets
- All screen sizes

---

**Made with ❤️ by Hiram Charagu**

*Star ⭐ this repository if you find it helpful!*
