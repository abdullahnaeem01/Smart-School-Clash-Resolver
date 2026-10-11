# Smart-School-Clash-Resolver

A modern automated school timetable generation, clash detection, and database management system powered by **Supabase PostgreSQL**.

---

## 🚀 Key Features

- **Guaranteed 0 Teacher Clashes**: Powered by an intelligent **Min-Conflicts Constraint Satisfaction (CSP)** solver that dynamically repairs conflicts in under 100 milliseconds.
- **Supabase PostgreSQL Cloud Database**:
  - Full relational schema with normalized tables: `teachers`, `subjects`, `classes`, `allocations`, and `timetable_slots`.
  - Connects directly to Supabase via `@supabase/supabase-js`.
  - Dual-mode operation: Runs seamlessly in **Supabase Cloud Mode** or **Offline Local Mode**.
- **Interactive Data Management Portal (CRUD)**:
  - 👨‍🏫 **Manage Teachers**: Add new teachers, assign departments, set weekly period limits, edit, and delete.
  - 📚 **Manage Subjects**: Add subjects, define codes, and customize color accents.
  - 🏫 **Manage Classes**: Add grade levels and sections.
  - 📋 **Teaching Allocations**: Assign any teacher to any subject & class with custom periods per week.
  - ⚙️ **Database Backup & Sync**: 1-click JSON backup download and live Supabase credentials setup.
- **Dual Structure Support (7 & 8 Periods)**:
  - **8 Periods Mode (Recommended)**: Accommodates extended demands for Grade 8 (37 periods) and Grade 9 (38 periods) with natural period distribution.
  - **7 Periods Mode (Standard)**: Accommodates standard 35-period weekly schedules with synchronized elective group balancing.
- **Dual Viewing Modes**:
  - **Class-Wise Timetable**: Complete weekly view per section with subject badges and assigned teacher tags.
  - **Teacher-Wise Timetable**: Complete weekly view per teacher displaying assigned classes and free periods.
- **Print & PDF Optimized**: Tailored print stylesheet for clean printing on standard A4 paper.

---

## 🗄️ Setting Up Supabase Database

To link your own Supabase project:

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and create a free project.
2. **Run the Database Schema**:
   - In your Supabase Dashboard, open **SQL Editor** from the left navigation.
   - Click **New Query**, copy and paste the contents of [`supabase_schema.sql`](supabase_schema.sql), and click **Run**.
   - This creates all 5 tables and pre-seeds all 42 teachers, 13 subjects, 36 classes, and allocations automatically!
3. **Connect the App**:
   - Open `index.html` in your browser.
   - Click the **⚙️ Supabase Database** tab.
   - Paste your **Project URL** and **anon public API Key** (found in Supabase *Project Settings -> API*).
   - Click **Save & Connect to Supabase**.
   - The indicator will turn **🟢 Connected to Supabase PostgreSQL**!

*Note: The app also works in **🟡 Local Storage Mode** out of the box with zero setup needed.*

---

## 🛠️ How to Run Locally

Double-click `index.html` to open it in any modern browser (Google Chrome, Microsoft Edge, Firefox, Safari).