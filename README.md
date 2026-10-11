# Smart-School-Clash-Resolver

A high-performance automated school timetable generator and clash detection system built for primary and secondary schools.

---

## 🚀 Key Features

- **Guaranteed 0 Teacher Clashes**: Powered by an intelligent **Min-Conflicts Constraint Satisfaction (CSP)** solver that dynamically repairs conflicts in under 100 milliseconds.
- **Dual Structure Support (7 & 8 Periods)**:
  - **8 Periods Mode (Recommended)**: Accommodates extended demands for Grade 8 (37 periods) and Grade 9 (38 periods) with natural period distribution.
  - **7 Periods Mode (Standard)**: Accommodates standard 35-period weekly schedules with synchronized elective group balancing.
- **Dual Viewing Modes**:
  - **Class-Wise Timetable**: Complete weekly view per section with subject badges and assigned teacher tags.
  - **Teacher-Wise Timetable**: Complete weekly view per teacher displaying assigned classes and free periods.
- **Teacher Workload Overview**: Real-time breakdown of total weekly periods, assigned classes, and subjects across all teaching staff.
- **Interactive Slot Editor**: Edit, reassign, or remove slots on the fly with live collision detection warning before saving.
- **Bulk Teacher Replacement**: Swap any teacher across the entire timetable in a single click with instant re-verification.
- **Print & PDF Optimized**: Tailored print stylesheet for clean printing on standard A4 paper.

---

## 🛠️ How to Run

1. Open `index.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).
2. The timetable solver runs automatically on launch, guaranteeing 0 clashes.
3. Switch between **Class-Wise** and **Teacher-Wise** views using the dropdown.
4. Click **Regenerate Timetable (0 Clashes)** to generate fresh conflict-free allocations anytime.

---

## 📋 Data Model & Allocations

- Supports 36 classes (Grades 1 through 10 with sections: Blue, Pink, Red, White, Green).
- 42+ specialized subject teachers across Maths, English, Urdu, Biology, Chemistry, Physics, General Science, Social Studies, Islamiat, Tarjuma-tul-Quran (T.Q), Nazra, and ICT.
- Resolves name ambiguities (e.g., separating senior and junior section teachers) to ensure physical viability across all time slots.