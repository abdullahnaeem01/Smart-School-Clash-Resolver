// =============================================================================
// DATABASE SERVICE LAYER (SUPABASE POSTGRESQL + LOCAL PERSISTENCE)
// =============================================================================

(function() {
    var supabaseClient = null;
    var isConnected = false;

    // Default Seed Data
    var DEFAULT_DATA = {
        teachers: [
            { id: "t-rubab", name: "Rubab", department: "Maths", subjects: ["Maths"], max_periods_weekly: 35 },
            { id: "t-rubina", name: "Rubina Malik", department: "Maths", subjects: ["Maths"], max_periods_weekly: 35 },
            { id: "t-zeenat", name: "Zeenat", department: "Maths", subjects: ["Maths"], max_periods_weekly: 35 },
            { id: "t-beenish", name: "Beenish", department: "Maths", subjects: ["Maths"], max_periods_weekly: 35 },
            { id: "t-samina", name: "Samina Gul", department: "Maths", subjects: ["Maths"], max_periods_weekly: 35 },
            { id: "t-misbah", name: "Misbah Sohail", department: "Maths", subjects: ["Maths"], max_periods_weekly: 35 },
            { id: "t-faiza", name: "Faiza", department: "Maths", subjects: ["Maths"], max_periods_weekly: 35 },
            { id: "t-eman", name: "Eman", department: "Maths", subjects: ["Maths"], max_periods_weekly: 35 },
            { id: "t-sumaira-r", name: "Sumaira Rashid", department: "Maths", subjects: ["Maths"], max_periods_weekly: 35 },

            { id: "t-mehmoona-eng", name: "Mehmoona (English)", department: "Senior English", subjects: ["English"], max_periods_weekly: 35 },
            { id: "t-ishrat", name: "Ishrat", department: "English", subjects: ["English"], max_periods_weekly: 35 },
            { id: "t-kiran", name: "Kiran", department: "English", subjects: ["English"], max_periods_weekly: 35 },
            { id: "t-salma", name: "Salma", department: "English & Pak. Study", subjects: ["English", "Pak. Study"], max_periods_weekly: 35 },
            { id: "t-zarmeen", name: "Zarmeen", department: "English", subjects: ["English"], max_periods_weekly: 35 },
            { id: "t-farah", name: "Farah", department: "English", subjects: ["English"], max_periods_weekly: 35 },
            { id: "t-tasneem", name: "Tasneem", department: "English", subjects: ["English"], max_periods_weekly: 35 },
            { id: "t-sarwat", name: "Sarwat", department: "English", subjects: ["English"], max_periods_weekly: 35 },
            { id: "t-anum", name: "Anum", department: "English", subjects: ["English"], max_periods_weekly: 35 },
            { id: "t-urooj", name: "Urooj", department: "English", subjects: ["English"], max_periods_weekly: 35 },

            { id: "t-sadia-w", name: "Sadia Waseem", department: "Urdu", subjects: ["Urdu"], max_periods_weekly: 35 },
            { id: "t-sonia", name: "Sonia", department: "Urdu", subjects: ["Urdu"], max_periods_weekly: 35 },
            { id: "t-naseem", name: "Naseem", department: "Urdu", subjects: ["Urdu"], max_periods_weekly: 35 },
            { id: "t-nazia", name: "Nazia", department: "Urdu", subjects: ["Urdu"], max_periods_weekly: 35 },
            { id: "t-summaiya", name: "Summaiya", department: "Urdu", subjects: ["Urdu"], max_periods_weekly: 35 },
            { id: "t-new1", name: "New 1", department: "Urdu & Islamiat", subjects: ["Urdu", "Islamiat"], max_periods_weekly: 35 },
            { id: "t-shazia", name: "Shazia Sohail", department: "Urdu", subjects: ["Urdu"], max_periods_weekly: 35 },
            { id: "t-saiqa", name: "Saiqa", department: "Urdu", subjects: ["Urdu"], max_periods_weekly: 35 },
            { id: "t-atiya", name: "Atiya", department: "Urdu", subjects: ["Urdu"], max_periods_weekly: 35 },
            { id: "t-nabeela", name: "Nabeela", department: "Urdu", subjects: ["Urdu"], max_periods_weekly: 35 },

            { id: "t-meharyan", name: "Meharyan", department: "Biology", subjects: ["Biology"], max_periods_weekly: 35 },
            { id: "t-saira", name: "Saira", department: "Science", subjects: ["Science"], max_periods_weekly: 35 },
            { id: "t-kinza", name: "Kinza", department: "Science", subjects: ["Science"], max_periods_weekly: 35 },
            { id: "t-ifza", name: "Ifza", department: "Science", subjects: ["Science"], max_periods_weekly: 35 },
            { id: "t-sadia-s", name: "Sadia Sarwar", department: "Science & Chemistry", subjects: ["Science", "Chemistry"], max_periods_weekly: 35 },
            { id: "t-yusra", name: "Yusra", department: "Science", subjects: ["Science"], max_periods_weekly: 35 },
            { id: "t-saleha", name: "Saleha", department: "Science & Islamiat", subjects: ["Science", "Islamiat"], max_periods_weekly: 35 },
            { id: "t-sajida", name: "Sajida", department: "Chemistry", subjects: ["Chemistry"], max_periods_weekly: 35 },
            { id: "t-sidra", name: "Sidra", department: "Physics", subjects: ["Physics"], max_periods_weekly: 35 },

            { id: "t-sumaira-g", name: "Sumaira Gul", department: "T.Q & Islamiat", subjects: ["T.Q", "Islamiat"], max_periods_weekly: 35 },
            { id: "t-farhat", name: "Farhat", department: "T.Q & Islamiat", subjects: ["T.Q", "Islamiat"], max_periods_weekly: 35 },
            { id: "t-huma", name: "Huma", department: "T.Q & Islamiat", subjects: ["T.Q", "Islamiat"], max_periods_weekly: 35 },
            { id: "t-aima", name: "Aima", department: "Islamiat", subjects: ["Islamiat"], max_periods_weekly: 35 },
            { id: "t-arshia", name: "Arshia", department: "Islamiat", subjects: ["Islamiat"], max_periods_weekly: 35 },

            { id: "t-mehwish", name: "Mehwish", department: "S.St", subjects: ["S.St"], max_periods_weekly: 35 },
            { id: "t-sehrish", name: "Sehrish", department: "S.St", subjects: ["S.St"], max_periods_weekly: 35 },
            { id: "t-bushra", name: "Bushra", department: "S.St", subjects: ["S.St"], max_periods_weekly: 35 },
            { id: "t-habiba", name: "Habiba", department: "S.St", subjects: ["S.St"], max_periods_weekly: 35 },
            { id: "t-mehmoona-sst", name: "Mehmoona (S.St)", department: "Junior S.St", subjects: ["S.St"], max_periods_weekly: 35 },

            { id: "t-musarat", name: "Musarat", department: "ICT", subjects: ["ICT"], max_periods_weekly: 35 },
            { id: "t-humaira", name: "Humaira", department: "ICT", subjects: ["ICT"], max_periods_weekly: 35 },
            { id: "t-rabiya", name: "Rabiya", department: "ICT", subjects: ["ICT"], max_periods_weekly: 35 },
            { id: "t-haleema-ict", name: "Haleema ICT", department: "ICT", subjects: ["ICT"], max_periods_weekly: 35 },
            { id: "t-sania", name: "Sania", department: "Nazra", subjects: ["Nazra"], max_periods_weekly: 35 },
            { id: "t-mudassira", name: "Mudassira", department: "Nazra", subjects: ["Nazra"], max_periods_weekly: 35 },
            { id: "t-haleema-nazra", name: "Haleema (Nazra)", department: "Nazra", subjects: ["Nazra"], max_periods_weekly: 35 }
        ].map(function(t) {
            t.max_periods_daily = 6;
            return t;
        }),

        subjects: [
            { id: "s-maths", name: "Maths", code: "MATH", color_accent: "#3b82f6" },
            { id: "s-english", name: "English", code: "ENG", color_accent: "#8b5cf6" },
            { id: "s-urdu", name: "Urdu", code: "URDU", color_accent: "#ec4899" },
            { id: "s-science", name: "Science", code: "SCI", color_accent: "#10b981" },
            { id: "s-biology", name: "Biology", code: "BIO", color_accent: "#059669" },
            { id: "s-chemistry", name: "Chemistry", code: "CHEM", color_accent: "#047857" },
            { id: "s-physics", name: "Physics", code: "PHY", color_accent: "#0284c7" },
            { id: "s-tq", name: "T.Q", code: "TQ", color_accent: "#f59e0b" },
            { id: "s-islamiat", name: "Islamiat", code: "ISL", color_accent: "#d97706" },
            { id: "s-sst", name: "S.St", code: "SST", color_accent: "#06b6d4" },
            { id: "s-pakstudy", name: "Pak. Study", code: "PST", color_accent: "#0891b2" },
            { id: "s-ict", name: "ICT", code: "ICT", color_accent: "#6366f1" },
            { id: "s-nazra", name: "Nazra", code: "NZR", color_accent: "#eab308" },
            { id: "s-pe", name: "P.E", code: "PE", color_accent: "#16a34a" }
        ],

        classes: [
            "1 Blue", "1 Pink", "1 Red", "1 White",
            "2 Blue", "2 Pink", "2 Red", "2 White",
            "3 Blue", "3 Green", "3 Pink", "3 Red", "3 White",
            "4 Blue", "4 Green", "4 Pink", "4 Red", "4 White",
            "5 Blue", "5 Pink", "5 Red", "5 White",
            "6 Blue", "6 Pink", "6 Red", "6 White",
            "7 Blue", "7 Pink", "7 Red", "7 White",
            "8 Blue", "8 Pink",
            "9 Blue", "9 Pink",
            "10 Blue", "10 Pink"
        ].map(function(c) {
            var grade = parseInt(c) || 1;
            var sec = c.split(" ").slice(1).join(" ") || "A";
            return { id: "c-" + c.toLowerCase().replace(/[^a-z0-9]/g, "-"), name: c, grade: grade, section: sec };
        }),

        defaultCurriculum: [
            // Grade 1 (35)
            { grade: 1, subject_name: "English", periods_per_week: 6, max_per_day: 2 },
            { grade: 1, subject_name: "Urdu", periods_per_week: 6, max_per_day: 2 },
            { grade: 1, subject_name: "Maths", periods_per_week: 5, max_per_day: 1 },
            { grade: 1, subject_name: "Science", periods_per_week: 4, max_per_day: 1 },
            { grade: 1, subject_name: "S.St", periods_per_week: 4, max_per_day: 1 },
            { grade: 1, subject_name: "ICT", periods_per_week: 2, max_per_day: 1 },
            { grade: 1, subject_name: "Islamiat", periods_per_week: 3, max_per_day: 1 },
            { grade: 1, subject_name: "Nazra", periods_per_week: 3, max_per_day: 1 },
            { grade: 1, subject_name: "P.E", periods_per_week: 2, max_per_day: 1 },

            // Grades 2-5 (35 each)
            ...[2, 3, 4, 5].flatMap(g => [
                { grade: g, subject_name: "English", periods_per_week: 6, max_per_day: 2 },
                { grade: g, subject_name: "Urdu", periods_per_week: 6, max_per_day: 2 },
                { grade: g, subject_name: "Maths", periods_per_week: 5, max_per_day: 1 },
                { grade: g, subject_name: "Science", periods_per_week: 4, max_per_day: 1 },
                { grade: g, subject_name: "S.St", periods_per_week: 4, max_per_day: 1 },
                { grade: g, subject_name: "ICT", periods_per_week: 3, max_per_day: 1 },
                { grade: g, subject_name: "Islamiat", periods_per_week: 3, max_per_day: 1 },
                { grade: g, subject_name: "Nazra", periods_per_week: 3, max_per_day: 1 },
                { grade: g, subject_name: "P.E", periods_per_week: 1, max_per_day: 1 }
            ]),

            // Grades 6-7 (35 each)
            ...[6, 7].flatMap(g => [
                { grade: g, subject_name: "English", periods_per_week: 6, max_per_day: 2 },
                { grade: g, subject_name: "Urdu", periods_per_week: 6, max_per_day: 2 },
                { grade: g, subject_name: "Maths", periods_per_week: 5, max_per_day: 1 },
                { grade: g, subject_name: "Science", periods_per_week: 4, max_per_day: 1 },
                { grade: g, subject_name: "S.St", periods_per_week: 4, max_per_day: 1 },
                { grade: g, subject_name: "ICT", periods_per_week: 3, max_per_day: 1 },
                { grade: g, subject_name: "Islamiat", periods_per_week: 3, max_per_day: 1 },
                { grade: g, subject_name: "T.Q", periods_per_week: 3, max_per_day: 1 },
                { grade: g, subject_name: "P.E", periods_per_week: 1, max_per_day: 1 }
            ]),

            // Grades 8-9 (35 each)
            ...[8, 9].flatMap(g => [
                { grade: g, subject_name: "English", periods_per_week: 5, max_per_day: 1 },
                { grade: g, subject_name: "Urdu", periods_per_week: 5, max_per_day: 1 },
                { grade: g, subject_name: "Maths", periods_per_week: 5, max_per_day: 1 },
                { grade: g, subject_name: "Physics", periods_per_week: 4, max_per_day: 1 },
                { grade: g, subject_name: "Chemistry", periods_per_week: 5, max_per_day: 1 },
                { grade: g, subject_name: "Biology", periods_per_week: 4, max_per_day: 1 },
                { grade: g, subject_name: "Islamiat", periods_per_week: 3, max_per_day: 1 },
                { grade: g, subject_name: "T.Q", periods_per_week: 3, max_per_day: 1 },
                { grade: g, subject_name: "P.E", periods_per_week: 1, max_per_day: 1 }
            ]),

            // Grade 10 (35)
            { grade: 10, subject_name: "English", periods_per_week: 5, max_per_day: 1 },
            { grade: 10, subject_name: "Urdu", periods_per_week: 5, max_per_day: 1 },
            { grade: 10, subject_name: "Maths", periods_per_week: 5, max_per_day: 1 },
            { grade: 10, subject_name: "Physics", periods_per_week: 4, max_per_day: 1 },
            { grade: 10, subject_name: "Chemistry", periods_per_week: 5, max_per_day: 1 },
            { grade: 10, subject_name: "Biology", periods_per_week: 4, max_per_day: 1 },
            { grade: 10, subject_name: "T.Q", periods_per_week: 3, max_per_day: 1 },
            { grade: 10, subject_name: "Pak. Study", periods_per_week: 3, max_per_day: 1 },
            { grade: 10, subject_name: "P.E", periods_per_week: 1, max_per_day: 1 }
        ]
    };

    // Default teaching allocations [teacher, subject, class, periods/week] (matches supabase_schema.sql, with data fixes)
    var DEFAULT_ALLOCATIONS = [
        ["Rubab", "Maths", "10 Blue", 5],
        ["Rubab", "Maths", "10 Pink", 5],
        ["Rubab", "Maths", "9 Blue", 5],
        ["Rubab", "Maths", "8 Pink", 5],
        ["Rubina Malik", "Maths", "9 Pink", 5],
        ["Rubina Malik", "Maths", "8 Blue", 5],
        ["Rubina Malik", "Maths", "7 Pink", 5],
        ["Rubina Malik", "Maths", "7 Blue", 5],
        ["Zeenat", "Maths", "7 Red", 5],
        ["Zeenat", "Maths", "7 White", 5],
        ["Zeenat", "Maths", "6 White", 5],
        ["Zeenat", "Maths", "4 Red", 5],
        ["Beenish", "Maths", "6 Blue", 5],
        ["Beenish", "Maths", "6 Pink", 5],
        ["Beenish", "Maths", "6 Red", 5],
        ["Beenish", "Maths", "5 Blue", 5],
        ["Samina Gul", "Maths", "5 Red", 5],
        ["Samina Gul", "Maths", "5 White", 5],
        ["Samina Gul", "Maths", "5 Pink", 5],
        ["Samina Gul", "Maths", "4 White", 5],
        ["Misbah Sohail", "Maths", "4 Pink", 5],
        ["Misbah Sohail", "Maths", "4 Blue", 5],
        ["Misbah Sohail", "Maths", "4 Green", 5],
        ["Misbah Sohail", "Maths", "3 Green", 5],
        ["Faiza", "Maths", "3 Blue", 5],
        ["Faiza", "Maths", "3 White", 5],
        ["Faiza", "Maths", "3 Pink", 5],
        ["Faiza", "Maths", "3 Red", 5],
        ["Eman", "Maths", "2 Pink", 5],
        ["Eman", "Maths", "2 Red", 5],
        ["Eman", "Maths", "1 Blue", 5],
        ["Eman", "Maths", "1 White", 5],
        ["Sumaira Rashid", "Maths", "2 Blue", 5],
        ["Sumaira Rashid", "Maths", "2 White", 5],
        ["Sumaira Rashid", "Maths", "1 Pink", 5],
        ["Sumaira Rashid", "Maths", "1 Red", 5],
        ["Mehmoona (English)", "English", "10 Blue", 5],
        ["Mehmoona (English)", "English", "10 Pink", 5],
        ["Mehmoona (English)", "English", "9 Blue", 5],
        ["Mehmoona (English)", "English", "9 Pink", 5],
        ["Ishrat", "English", "8 Pink", 5],
        ["Ishrat", "English", "8 Blue", 5],
        ["Ishrat", "English", "6 Pink", 6],
        ["Ishrat", "English", "6 Red", 6],
        ["Kiran", "English", "6 Blue", 6],
        ["Kiran", "English", "6 White", 6],
        ["Kiran", "English", "7 Pink", 6],
        ["Kiran", "English", "7 Red", 6],
        ["Salma", "English", "7 Blue", 6],
        ["Salma", "English", "7 White", 6],
        ["Salma", "English", "5 Red", 6],
        ["Zarmeen", "English", "5 Pink", 6],
        ["Zarmeen", "English", "4 Red", 6],
        ["Zarmeen", "English", "4 Blue", 6],
        ["Zarmeen", "English", "4 White", 6],
        ["Farah", "English", "5 Blue", 6],
        ["Farah", "English", "5 White", 6],
        ["Farah", "English", "4 Pink", 6],
        ["Farah", "English", "4 Green", 6],
        ["Tasneem", "English", "3 Blue", 6],
        ["Tasneem", "English", "3 White", 6],
        ["Tasneem", "English", "3 Green", 6],
        ["Sarwat", "English", "3 Red", 6],
        ["Sarwat", "English", "2 Blue", 6],
        ["Sarwat", "English", "2 White", 6],
        ["Sarwat", "English", "1 Pink", 6],
        ["Anum", "English", "2 Pink", 6],
        ["Anum", "English", "3 Pink", 6],
        ["Anum", "English", "1 Blue", 6],
        ["Anum", "English", "1 White", 6],
        ["Urooj", "English", "2 Red", 6],
        ["Urooj", "English", "1 Red", 6],
        ["Sadia Waseem", "Urdu", "10 Pink", 5],
        ["Sadia Waseem", "Urdu", "10 Blue", 5],
        ["Sadia Waseem", "Urdu", "9 Pink", 5],
        ["Sadia Waseem", "Urdu", "8 Pink", 5],
        ["Sadia Waseem", "Urdu", "8 Blue", 5],
        ["Sonia", "Urdu", "9 Blue", 5],
        ["Sonia", "Urdu", "7 Pink", 6],
        ["Naseem", "Urdu", "7 Red", 6],
        ["Naseem", "Urdu", "7 Blue", 6],
        ["Naseem", "Urdu", "7 White", 6],
        ["Naseem", "Urdu", "5 Red", 6],
        ["Nazia", "Urdu", "6 Pink", 6],
        ["Nazia", "Urdu", "6 Blue", 6],
        ["Nazia", "Urdu", "5 Blue", 6],
        ["Nazia", "Urdu", "6 White", 6],
        ["Summaiya", "Urdu", "5 Pink", 6],
        ["Summaiya", "Urdu", "4 Pink", 6],
        ["Summaiya", "Urdu", "3 Pink", 6],
        ["Summaiya", "Urdu", "6 Red", 6],
        ["New 1", "Urdu", "5 White", 6],
        ["Shazia Sohail", "Urdu", "4 Blue", 6],
        ["Shazia Sohail", "Urdu", "4 White", 6],
        ["Shazia Sohail", "Urdu", "4 Red", 6],
        ["Shazia Sohail", "Urdu", "3 Red", 6],
        ["Saiqa", "Urdu", "3 Blue", 6],
        ["Saiqa", "Urdu", "4 Green", 6],
        ["Saiqa", "Urdu", "3 White", 6],
        ["Saiqa", "Urdu", "3 Green", 6],
        ["Atiya", "Urdu", "1 Red", 6],
        ["Atiya", "Urdu", "1 White", 6],
        ["Atiya", "Urdu", "2 Red", 6],
        ["Atiya", "Urdu", "2 White", 6],
        ["Nabeela", "Urdu", "1 Pink", 6],
        ["Nabeela", "Urdu", "1 Blue", 6],
        ["Nabeela", "Urdu", "2 Pink", 6],
        ["Nabeela", "Urdu", "2 Blue", 6],
        ["Meharyan", "Biology", "10 Pink", 4],
        ["Meharyan", "Biology", "10 Blue", 4],
        ["Meharyan", "Biology", "9 Pink", 4],
        ["Meharyan", "Biology", "9 Blue", 4],
        ["Meharyan", "Biology", "8 Pink", 4],
        ["Meharyan", "Biology", "8 Blue", 4],
        ["Saira", "Science", "7 Blue", 4],
        ["Saira", "Science", "7 White", 4],
        ["Saira", "Science", "6 Pink", 4],
        ["Saira", "Science", "5 Pink", 4],
        ["Saira", "Science", "5 Red", 4],
        ["Saira", "Science", "5 Blue", 4],
        ["Kinza", "Science", "7 Red", 4],
        ["Kinza", "Science", "6 Blue", 4],
        ["Kinza", "Science", "6 White", 4],
        ["Kinza", "Science", "5 White", 4],
        ["Kinza", "Science", "4 White", 4],
        ["Ifza", "Science", "6 Red", 4],
        ["Ifza", "Science", "3 Green", 4],
        ["Ifza", "Science", "4 Pink", 4],
        ["Ifza", "Science", "4 Red", 4],
        ["Ifza", "Science", "4 Green", 4],
        ["Sadia Sarwar", "Science", "3 White", 4],
        ["Sadia Sarwar", "Science", "4 Blue", 4],
        ["Sadia Sarwar", "Science", "3 Blue", 4],
        ["Yusra", "Science", "2 Blue", 4],
        ["Yusra", "Science", "2 White", 4],
        ["Yusra", "Science", "2 Pink", 4],
        ["Yusra", "Science", "2 Red", 4],
        ["Yusra", "Science", "3 Pink", 4],
        ["Yusra", "Science", "3 Red", 4],
        ["Saleha", "Science", "1 Pink", 4],
        ["Saleha", "Science", "1 Red", 4],
        ["Saleha", "Science", "1 Blue", 4],
        ["Saleha", "Science", "1 White", 4],
        ["Sajida", "Chemistry", "10 Blue", 5],
        ["Sajida", "Chemistry", "9 Blue", 5],
        ["Sajida", "Chemistry", "8 Blue", 5],
        ["Sajida", "Chemistry", "8 Pink", 5],
        ["Sidra", "Physics", "10 Blue", 4],
        ["Sidra", "Physics", "10 Pink", 4],
        ["Sidra", "Physics", "9 Blue", 4],
        ["Sidra", "Physics", "9 Pink", 4],
        ["Sidra", "Physics", "8 Blue", 4],
        ["Sadia Sarwar", "Chemistry", "10 Pink", 5],
        ["Sadia Sarwar", "Chemistry", "9 Pink", 5],
        ["Sumaira Gul", "T.Q", "10 Pink", 3],
        ["Sumaira Gul", "T.Q", "10 Blue", 3],
        ["Sumaira Gul", "T.Q", "9 Pink", 3],
        ["Sumaira Gul", "T.Q", "8 Pink", 3],
        ["Sumaira Gul", "T.Q", "8 Blue", 3],
        ["Sumaira Gul", "Islamiat", "9 Pink", 3],
        ["Sumaira Gul", "Islamiat", "8 Pink", 3],
        ["Sumaira Gul", "Islamiat", "8 Blue", 3],
        ["Farhat", "T.Q", "9 Blue", 3],
        ["Farhat", "T.Q", "7 Pink", 3],
        ["Farhat", "T.Q", "7 Red", 3],
        ["Farhat", "T.Q", "7 Blue", 3],
        ["Farhat", "T.Q", "7 White", 3],
        ["Farhat", "Islamiat", "9 Blue", 3],
        ["Farhat", "Islamiat", "7 Pink", 3],
        ["Farhat", "Islamiat", "7 Blue", 3],
        ["New 1", "Islamiat", "6 Pink", 3],
        ["New 1", "Islamiat", "6 Red", 3],
        ["New 1", "Islamiat", "6 Blue", 3],
        ["New 1", "Islamiat", "6 White", 3],
        ["New 1", "Islamiat", "5 Pink", 3],
        ["New 1", "Islamiat", "5 Red", 3],
        ["Huma", "T.Q", "6 Pink", 3],
        ["Huma", "T.Q", "6 Red", 3],
        ["Huma", "T.Q", "6 Blue", 3],
        ["Huma", "T.Q", "6 White", 3],
        ["Huma", "Islamiat", "7 White", 3],
        ["Huma", "Islamiat", "7 Red", 3],
        ["Huma", "Islamiat", "5 Blue", 3],
        ["Huma", "Islamiat", "5 White", 3],
        ["Aima", "Islamiat", "3 Pink", 3],
        ["Aima", "Islamiat", "3 Blue", 3],
        ["Aima", "Islamiat", "3 Green", 3],
        ["Aima", "Islamiat", "4 Pink", 3],
        ["Aima", "Islamiat", "4 Red", 3],
        ["Aima", "Islamiat", "4 White", 3],
        ["Aima", "Islamiat", "4 Green", 3],
        ["Aima", "Islamiat", "4 Blue", 3],
        ["Arshia", "Islamiat", "1 Blue", 3],
        ["Arshia", "Islamiat", "1 White", 3],
        ["Arshia", "Islamiat", "2 Pink", 3],
        ["Arshia", "Islamiat", "2 Red", 3],
        ["Arshia", "Islamiat", "2 White", 3],
        ["Arshia", "Islamiat", "2 Blue", 3],
        ["Arshia", "Islamiat", "3 Red", 3],
        ["Arshia", "Islamiat", "3 White", 3],
        ["Saleha", "Islamiat", "1 Pink", 3],
        ["Saleha", "Islamiat", "1 Red", 3],
        ["Mehwish", "S.St", "6 Pink", 4],
        ["Mehwish", "S.St", "6 Blue", 4],
        ["Mehwish", "S.St", "6 White", 4],
        ["Mehwish", "S.St", "7 Red", 4],
        ["Mehwish", "S.St", "7 Blue", 4],
        ["Mehwish", "S.St", "7 White", 4],
        ["Sehrish", "S.St", "7 Pink", 4],
        ["Sehrish", "S.St", "6 Red", 4],
        ["Sehrish", "S.St", "5 Pink", 4],
        ["Sehrish", "S.St", "5 Red", 4],
        ["Sehrish", "S.St", "4 Blue", 4],
        ["Sehrish", "S.St", "4 White", 4],
        ["Bushra", "S.St", "5 Blue", 4],
        ["Bushra", "S.St", "5 White", 4],
        ["Bushra", "S.St", "4 Pink", 4],
        ["Bushra", "S.St", "4 Red", 4],
        ["Bushra", "S.St", "3 Pink", 4],
        ["Bushra", "S.St", "4 Green", 4],
        ["Habiba", "S.St", "3 Red", 4],
        ["Habiba", "S.St", "3 Blue", 4],
        ["Habiba", "S.St", "3 White", 4],
        ["Habiba", "S.St", "2 Red", 4],
        ["Habiba", "S.St", "2 White", 4],
        ["Habiba", "S.St", "3 Green", 4],
        ["Mehmoona (S.St)", "S.St", "1 Pink", 4],
        ["Mehmoona (S.St)", "S.St", "1 Red", 4],
        ["Mehmoona (S.St)", "S.St", "1 Blue", 4],
        ["Mehmoona (S.St)", "S.St", "1 White", 4],
        ["Mehmoona (S.St)", "S.St", "2 Pink", 4],
        ["Mehmoona (S.St)", "S.St", "2 Blue", 4],
        ["Salma", "Pak. Study", "10 Pink", 3],
        ["Salma", "Pak. Study", "10 Blue", 3],
        ["Musarat", "ICT", "7 Pink", 3],
        ["Musarat", "ICT", "7 Red", 3],
        ["Musarat", "ICT", "7 Blue", 3],
        ["Musarat", "ICT", "7 White", 3],
        ["Humaira", "ICT", "6 Pink", 3],
        ["Humaira", "ICT", "6 Red", 3],
        ["Humaira", "ICT", "6 Blue", 3],
        ["Humaira", "ICT", "6 White", 3],
        ["Humaira", "ICT", "5 Pink", 3],
        ["Humaira", "ICT", "5 Red", 3],
        ["Humaira", "ICT", "5 Blue", 3],
        ["Humaira", "ICT", "5 White", 3],
        ["Rabiya", "ICT", "2 Pink", 3],
        ["Rabiya", "ICT", "2 Blue", 3],
        ["Rabiya", "ICT", "3 Red", 3],
        ["Rabiya", "ICT", "3 White", 3],
        ["Rabiya", "ICT", "4 Red", 3],
        ["Rabiya", "ICT", "4 White", 3],
        ["Rabiya", "ICT", "3 Green", 3],
        ["Rabiya", "ICT", "1 Pink", 2],
        ["Rabiya", "ICT", "1 Blue", 2],
        ["Haleema ICT", "ICT", "2 Red", 3],
        ["Haleema ICT", "ICT", "2 White", 3],
        ["Haleema ICT", "ICT", "3 Pink", 3],
        ["Haleema ICT", "ICT", "3 Blue", 3],
        ["Haleema ICT", "ICT", "4 Pink", 3],
        ["Haleema ICT", "ICT", "4 Blue", 3],
        ["Haleema ICT", "ICT", "4 Green", 3],
        ["Haleema ICT", "ICT", "1 Red", 2],
        ["Haleema ICT", "ICT", "1 White", 2],
        ["Sania", "Nazra", "1 Pink", 3],
        ["Sania", "Nazra", "2 White", 3],
        ["Sania", "Nazra", "3 Blue", 3],
        ["Sania", "Nazra", "3 White", 3],
        ["Sania", "Nazra", "4 Blue", 3],
        ["Sania", "Nazra", "4 White", 3],
        ["Sania", "Nazra", "5 Blue", 3],
        ["Sania", "Nazra", "5 White", 3],
        ["Mudassira", "Nazra", "1 Red", 3],
        ["Mudassira", "Nazra", "2 Pink", 3],
        ["Mudassira", "Nazra", "3 Pink", 3],
        ["Mudassira", "Nazra", "3 Red", 3],
        ["Mudassira", "Nazra", "4 Pink", 3],
        ["Mudassira", "Nazra", "4 Red", 3],
        ["Mudassira", "Nazra", "5 Pink", 3],
        ["Mudassira", "Nazra", "5 Red", 3],
        ["Haleema (Nazra)", "Nazra", "1 Blue", 3],
        ["Haleema (Nazra)", "Nazra", "1 White", 3],
        ["Haleema (Nazra)", "Nazra", "2 Red", 3],
        ["Haleema (Nazra)", "Nazra", "2 Blue", 3],
        ["Haleema (Nazra)", "Nazra", "3 Green", 3],
        ["Haleema (Nazra)", "Nazra", "4 Green", 3],
        ["Ifza", "Science", "7 Pink", 4],
        ["Sidra", "Physics", "8 Pink", 4]
    ];

    // Retry network-level failures ("Failed to fetch") a couple of times before giving up
    function retryFetch(input, init) {
        var attempt = 0;
        function go() {
            return fetch(input, init).catch(function(err) {
                attempt++;
                if (attempt > 2 || (init && init.signal && init.signal.aborted)) throw err;
                return new Promise(function(r) { setTimeout(r, 700 * attempt); }).then(go);
            });
        }
        return go();
    }
    function isNetworkError(e) {
        var m = String((e && e.message) || e || "");
        return /failed to fetch|networkerror|load failed|network request failed|fetch failed|timed out/i.test(m);
    }
    // Accept sloppy input: trailing slash, "/rest/v1", spaces, missing https:// ... -> https://<ref>.supabase.co
    function cleanUrl(u) {
        u = String(u || "").trim().replace(/^["']|["']$/g, "");
        if (!u) return "";
        if (/^[a-z0-9]{15,25}$/i.test(u)) u = u + ".supabase.co";      // only the project ref was pasted
        if (!/^https?:\/\//i.test(u)) u = "https://" + u;
        try { return new URL(u).origin; } catch (e) { return u.replace(/\/+$/, ""); }
    }
    function cleanKey(k) { return String(k || "").replace(/\s+/g, "").replace(/^["']|["']$/g, ""); }
    var reconnectTimer = null;
    var lastToastAt = 0;

    // Initialize LocalStorage Data if not present
    function initLocalStorage() {
        if (!localStorage.getItem("SCH_TEACHERS")) {
            localStorage.setItem("SCH_TEACHERS", JSON.stringify(DEFAULT_DATA.teachers));
        } else {
            var cachedTeachers = JSON.parse(localStorage.getItem("SCH_TEACHERS") || "[]");
            var updated = false;
            var defMap = {};
            DEFAULT_DATA.teachers.forEach(function(t) { defMap[t.name] = t.subjects; });
            cachedTeachers.forEach(function(t) {
                if (!t.subjects || t.subjects.length === 0) {
                    t.subjects = defMap[t.name] || (t.department && t.department !== "General" ? [t.department] : []);
                    updated = true;
                }
                if (!t.max_periods_daily) {
                    t.max_periods_daily = 6;
                    updated = true;
                }
                if (!t.max_periods_weekly) {
                    t.max_periods_weekly = 35;
                    updated = true;
                }
            });
            if (updated) localStorage.setItem("SCH_TEACHERS", JSON.stringify(cachedTeachers));
        }
        if (!localStorage.getItem("SCH_SUBSTITUTIONS")) {
            localStorage.setItem("SCH_SUBSTITUTIONS", JSON.stringify([]));
        }
        if (!localStorage.getItem("SCH_SUBJECTS")) {
            localStorage.setItem("SCH_SUBJECTS", JSON.stringify(DEFAULT_DATA.subjects));
        } else {
            // Ensure P.E exists in cached subjects
            var cachedSubs = JSON.parse(localStorage.getItem("SCH_SUBJECTS") || "[]");
            if (!cachedSubs.some(function(s) { return s.name === "P.E"; })) {
                cachedSubs.push({ id: "s-pe", name: "P.E", code: "PE", color_accent: "#16a34a" });
                localStorage.setItem("SCH_SUBJECTS", JSON.stringify(cachedSubs));
            }
        }
        if (!localStorage.getItem("SCH_CLASSES")) {
            localStorage.setItem("SCH_CLASSES", JSON.stringify(DEFAULT_DATA.classes));
        }
        if (!localStorage.getItem("SCH_SETTINGS")) {
            localStorage.setItem("SCH_SETTINGS", JSON.stringify({
                school_name: "Smart School",
                periods_per_day: "7",
                break_after_period: "3",
                working_days: '["Monday","Tuesday","Wednesday","Thursday","Friday"]'
            }));
        }
        var existingAllocs = [];
        try { existingAllocs = JSON.parse(localStorage.getItem("SCH_ALLOCATIONS") || "[]"); } catch (e) {}
        if (!existingAllocs || existingAllocs.length === 0) {
            var tByName = {}, sByName = {}, cByName = {};
            DEFAULT_DATA.teachers.forEach(function(t) { tByName[t.name] = t; });
            DEFAULT_DATA.subjects.forEach(function(s) { sByName[s.name] = s; });
            DEFAULT_DATA.classes.forEach(function(c) { cByName[c.name] = c; });
            var seeded = [];
            DEFAULT_ALLOCATIONS.forEach(function(a, i) {
                var t = tByName[a[0]], s = sByName[a[1]], c = cByName[a[2]];
                if (!t || !s || !c) return;
                seeded.push({ id: "alloc-seed-" + (i + 1), teacher_id: t.id, subject_id: s.id, class_id: c.id, periods_per_week: a[3] });
            });
            localStorage.setItem("SCH_ALLOCATIONS", JSON.stringify(seeded));
        }
        if (!localStorage.getItem("SCH_CURRICULUM")) {
            var sMap = {};
            DEFAULT_DATA.subjects.forEach(function(s) { sMap[s.name] = s; });
            var initCur = DEFAULT_DATA.defaultCurriculum.map(function(c, i) {
                var s = sMap[c.subject_name] || { id: "s-" + i, color_accent: "#3b82f6" };
                return {
                    id: "cur-" + (i + 1),
                    grade: c.grade,
                    subject_id: s.id,
                    subject_name: c.subject_name,
                    subject_color: s.color_accent,
                    periods_per_week: c.periods_per_week,
                    max_per_day: c.max_per_day
                };
            });
            localStorage.setItem("SCH_CURRICULUM", JSON.stringify(initCur));
        }
    }

    // Public Database Service Interface
    window.DB = {
        client: null,

        // Init connection to Supabase (with timeout + clear error reporting)
        lastError: null,
        onStatusChange: null,

        init: async function() {
            initLocalStorage();
            var self = this;
            var built = window.SUPABASE_CONFIG || {};
            var builtUrl = cleanUrl(built.url || "https://aoxloxnkctbccyqsdghk.supabase.co");
            var builtKey = cleanKey(built.anonKey || "sb_publishable_WfV3i9xNoFmsiLUiJtzoRA_tWUcBtIW");
            var savedUrl = cleanUrl(localStorage.getItem("SB_URL") || "");
            var savedKey = cleanKey(localStorage.getItem("SB_KEY") || "");
            this.lastError = null;

            if (!(window.supabase && window.supabase.createClient)) {
                this.lastError = "Supabase library failed to load (check internet connection).";
                isConnected = false; this.client = null; supabaseClient = null;
                return { connected: false, fallback: true, error: this.lastError };
            }

            // try the saved credentials first, then the built-in ones (self-heal a wrongly pasted URL/key)
            var candidates = [];
            if (savedUrl && savedKey) candidates.push({ url: savedUrl, key: savedKey, saved: true });
            candidates.push({ url: builtUrl, key: builtKey, saved: false });

            var lastErr = null;
            for (var i = 0; i < candidates.length; i++) {
                var c = candidates[i];
                try {
                    var client = window.supabase.createClient(c.url, c.key, {
                        auth: { persistSession: false, autoRefreshToken: false },
                        global: { fetch: retryFetch }
                    });
                    // real GET request (a HEAD request can report success even when the URL is wrong)
                    var ping = client.from("teachers").select("id").limit(1);
                    var timeout = new Promise(function(_, rej) { setTimeout(function() { rej(new Error("Connection timed out")); }, 9000); });
                    var test = await Promise.race([ping, timeout]);
                    if (!test.error) {
                        supabaseClient = client; this.client = client; isConnected = true;
                        this.activeUrl = c.url;
                        if (c.saved) { localStorage.setItem("SB_URL", c.url); localStorage.setItem("SB_KEY", c.key); }
                        else { localStorage.removeItem("SB_URL"); localStorage.removeItem("SB_KEY"); }  // drop the broken override
                        console.log("Connected to Supabase:", c.url);
                        try { await this._syncOnConnect(); } catch (e) { console.warn("sync on connect:", e); }
                        return { connected: true, client: client };
                    }
                    lastErr = test.error.message || String(test.error);
                } catch (e) {
                    lastErr = (e && e.message) || String(e);
                    if (isNetworkError(e)) break;     // no internet: trying another URL will not help
                }
            }

            this.lastError = isNetworkError(lastErr) ? "Cannot reach Supabase (internet/VPN/firewall, or the project is paused)." : lastErr;
            console.warn("Supabase unavailable, using Local Storage:", this.lastError);
            isConnected = false; this.client = null; supabaseClient = null;
            if (isNetworkError(lastErr)) this._startAutoReconnect();
            return { connected: false, fallback: true, error: this.lastError };
        },

        // After connecting: upload offline changes, or seed an EMPTY cloud database from the defaults
        _syncOnConnect: async function() {
            var cnt = await supabaseClient.from("teachers").select("id", { count: "exact", head: true });
            var empty = !cnt.error && (cnt.count === 0);
            if (empty || localStorage.getItem("SCH_PENDING_SYNC")) await this.pushLocalChanges();
        },

        // Returns one row per table: reachable? how many rows? the exact error
        diagnose: async function() {
            var out = [];
            if (!(window.supabase && window.supabase.createClient)) return [{ name: "Supabase library", ok: false, msg: "Not loaded (no internet or blocked CDN)" }];
            var url = this.activeUrl || cleanUrl((window.SUPABASE_CONFIG || {}).url);
            out.push({ name: "Project URL in use", ok: /^https:\/\/[a-z0-9]+\.supabase\.co$/i.test(url), msg: url });
            if (!(isConnected && supabaseClient)) {
                var r = await this.reconnect();
                out.push({ name: "Connection", ok: isConnected, msg: isConnected ? "Connected" : (this.lastError || "Failed") });
                if (!isConnected) return out;
            } else out.push({ name: "Connection", ok: true, msg: "Connected" });
            var tables = ["teachers", "subjects", "classes", "allocations", "teacher_subjects", "curriculum", "school_settings", "timetable_slots", "substitutions"];
            for (var i = 0; i < tables.length; i++) {
                var res = await supabaseClient.from(tables[i]).select("id", { count: "exact" }).limit(1);
                out.push({ name: "Table " + tables[i], ok: !res.error, msg: res.error ? res.error.message : ((res.count || 0) + " rows") });
            }
            // write test (insert + delete a temporary teacher)
            var w = await supabaseClient.from("teachers").insert([{ name: "__connection_test__", department: "test" }]).select().single();
            if (w.error) out.push({ name: "Write test", ok: false, msg: w.error.message });
            else { await supabaseClient.from("teachers").delete().eq("id", w.data.id); out.push({ name: "Write test", ok: true, msg: "Can save to the database" }); }
            return out;
        },

        // Forget a wrongly typed URL/key and go back to supabase-config.js
        resetConnectionSettings: async function() {
            localStorage.removeItem("SB_URL"); localStorage.removeItem("SB_KEY");
            return await this.reconnect();
        },

        // Live sync: call back whenever ANY device changes the database
        subscribeChanges: function(callback) {
            if (!(isConnected && supabaseClient && supabaseClient.channel)) return false;
            try {
                if (this._channel) { supabaseClient.removeChannel(this._channel); }
                this._channel = supabaseClient.channel("school-live")
                    .on("postgres_changes", { event: "*", schema: "public" }, function() { callback(); })
                    .subscribe();
                return true;
            } catch (e) { console.warn("realtime unavailable:", e); return false; }
        },

        // Try again (used by the "Reconnect" button and when the browser comes back online)
        reconnect: async function() {
            var r = await this.init();
            if (isConnected && localStorage.getItem("SCH_PENDING_SYNC")) {
                try { await this.pushLocalChanges(); } catch (e) { console.warn("push failed", e); }
            }
            if (typeof this.onStatusChange === "function") this.onStatusChange(isConnected, this.lastError);
            return r;
        },

        // Report cloud write failures instead of hiding them
        _retryFetch: retryFetch,
        _fail: function(where, error) {
            var raw = (error && error.message) || String(error);
            console.error("Supabase " + where + ": " + raw);
            if (isNetworkError(error)) {
                // The cloud cannot be reached: switch to offline mode ONCE, remember there is unsynced data
                var wasOnline = isConnected;
                isConnected = false;
                this.lastError = "Cannot reach Supabase (internet/VPN/firewall, or the project is paused).";
                try { localStorage.setItem("SCH_PENDING_SYNC", "1"); } catch (e) {}
                if (wasOnline) {
                    if (typeof this.onStatusChange === "function") this.onStatusChange(false, this.lastError);
                    this._startAutoReconnect();
                }
                if (Date.now() - lastToastAt > 15000 && typeof this.onSyncError === "function") {
                    lastToastAt = Date.now();
                    this.onSyncError("No connection to Supabase. Saved on this device — it will upload automatically when the connection is back.");
                }
                return;
            }
            this.lastError = where + ": " + raw;
            if (typeof this.onSyncError === "function") this.onSyncError(this.lastError);
        },

        // Keep trying in the background; when the cloud is back, upload offline changes
        _startAutoReconnect: function() {
            if (reconnectTimer) return;
            var self = this;
            reconnectTimer = setInterval(async function() {
                var r = await self.init();
                if (r && r.connected) {
                    clearInterval(reconnectTimer); reconnectTimer = null;
                    try { await self.pushLocalChanges(); } catch (e) { console.warn("push failed", e); }
                    if (typeof self.onStatusChange === "function") self.onStatusChange(true, null);
                }
            }, 30000);
        },

        // Upload anything that was created while offline (teachers, subjects, classes, assignments)
        pushLocalChanges: async function() {
            if (!(isConnected && supabaseClient)) return { pushed: 0 };
            var pushed = 0, self = this;
            var read = function(k) { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) { return []; } };
            var lT = read("SCH_TEACHERS"), lS = read("SCH_SUBJECTS"), lC = read("SCH_CLASSES"), lA = read("SCH_ALLOCATIONS");
            var m = await this._idMaps();
            var i, r;
            for (i = 0; i < lT.length; i++) {
                if (m.t[lT[i].name]) continue;
                r = await supabaseClient.from("teachers").insert([{ name: lT[i].name, department: lT[i].department || "General",
                    max_periods_weekly: lT[i].max_periods_weekly || 35, max_periods_daily: lT[i].max_periods_daily || 6 }]);
                if (r.error) { this._fail("sync teacher " + lT[i].name, r.error); return { pushed: pushed, error: r.error }; } pushed++;
            }
            for (i = 0; i < lS.length; i++) {
                if (m.s[lS[i].name]) continue;
                r = await supabaseClient.from("subjects").insert([{ name: lS[i].name, code: lS[i].code, color_accent: lS[i].color_accent }]);
                if (r.error) { this._fail("sync subject " + lS[i].name, r.error); return { pushed: pushed, error: r.error }; } pushed++;
            }
            for (i = 0; i < lC.length; i++) {
                if (m.c[lC[i].name]) continue;
                r = await supabaseClient.from("classes").insert([{ name: lC[i].name, grade: lC[i].grade, section: lC[i].section }]);
                if (r.error) { this._fail("sync class " + lC[i].name, r.error); return { pushed: pushed, error: r.error }; } pushed++;
            }
            m = await this._idMaps();
            // teacher <-> subject qualifications of teachers that were just created
            var ts = await supabaseClient.from("teacher_subjects").select("teacher_id, subject_id");
            var haveTS = {}; ((ts.data) || []).forEach(function(x) { haveTS[x.teacher_id + "|" + x.subject_id] = 1; });
            var tsRows = [];
            lT.forEach(function(t) { (t.subjects || []).forEach(function(sn) {
                if (m.t[t.name] && m.s[sn] && !haveTS[m.t[t.name] + "|" + m.s[sn]]) tsRows.push({ teacher_id: m.t[t.name], subject_id: m.s[sn] });
            }); });
            if (tsRows.length) { r = await supabaseClient.from("teacher_subjects").insert(tsRows); if (!r.error) pushed += tsRows.length; }
            // allocations
            var tN = {}, sN = {}, cN = {};
            lT.forEach(function(x) { tN[x.id] = x.name; }); lS.forEach(function(x) { sN[x.id] = x.name; }); lC.forEach(function(x) { cN[x.id] = x.name; });
            var ca = await supabaseClient.from("allocations").select("teacher_id, subject_id, class_id");
            var haveA = {}; ((ca.data) || []).forEach(function(x) { haveA[x.teacher_id + "|" + x.subject_id + "|" + x.class_id] = 1; });
            var aRows = [];
            lA.forEach(function(a) {
                var t = m.t[tN[a.teacher_id] || a.teacher_name], s = m.s[sN[a.subject_id] || a.subject_name], c = m.c[cN[a.class_id] || a.class_name];
                if (t && s && c && !haveA[t + "|" + s + "|" + c]) aRows.push({ teacher_id: t, subject_id: s, class_id: c, periods_per_week: a.periods_per_week });
            });
            for (i = 0; i < aRows.length; i += 200) {
                r = await supabaseClient.from("allocations").insert(aRows.slice(i, i + 200));
                if (r.error) { this._fail("sync allocations", r.error); return { pushed: pushed, error: r.error }; } pushed += Math.min(200, aRows.length - i);
            }
            try { localStorage.removeItem("SCH_PENDING_SYNC"); } catch (e) {}
            return { pushed: pushed };
        },

        onSyncError: null,

        // Name <-> UUID helpers (the app works with names, the cloud with UUIDs)
        _idMaps: async function() {
            var maps = { t: {}, s: {}, c: {}, tRev: {}, sRev: {}, cRev: {} };
            if (!(isConnected && supabaseClient)) return maps;
            var results = await Promise.all([
                supabaseClient.from("teachers").select("id,name"),
                supabaseClient.from("subjects").select("id,name"),
                supabaseClient.from("classes").select("id,name")
            ]);
            (results[0].data || []).forEach(function(r) { maps.t[r.name] = r.id; maps.tRev[r.id] = r.name; });
            (results[1].data || []).forEach(function(r) { maps.s[r.name] = r.id; maps.sRev[r.id] = r.name; });
            (results[2].data || []).forEach(function(r) { maps.c[r.name] = r.id; maps.cRev[r.id] = r.name; });
            return maps;
        },

        isConnected: function() {
            return isConnected;
        },

        setCredentials: async function(url, key) {
            localStorage.setItem("SB_URL", cleanUrl(url));
            localStorage.setItem("SB_KEY", cleanKey(key));
            return await this.reconnect();
        },

        clearCredentials: function() {
            localStorage.removeItem("SB_URL");
            localStorage.removeItem("SB_KEY");
            supabaseClient = null;
            this.client = null;
            isConnected = false;
        },

        // ==========================
        // TEACHERS CRUD
        // ==========================
        getTeachers: async function() {
            var list = [], cloudOk = false;
            if (isConnected && supabaseClient) {
                var res = await supabaseClient.from("teachers").select("*").order("name");
                if (res.error) this._fail("getTeachers", res.error);
                else { list = res.data || []; cloudOk = true; }
            }
            if (!cloudOk) {
                list = JSON.parse(localStorage.getItem("SCH_TEACHERS") || "[]");
            } else if (list.length > 0) {
                try {
                    var ts = await supabaseClient.from("teacher_subjects").select("teacher_id, subjects(name)");
                    if (!ts.error && ts.data && ts.data.length > 0) {
                        var byT = {};
                        ts.data.forEach(function(r) { if (r.subjects && r.subjects.name) (byT[r.teacher_id] = byT[r.teacher_id] || []).push(r.subjects.name); });
                        list.forEach(function(t) { if (byT[t.id]) t.subjects = byT[t.id]; });
                    }
                } catch (e) {}
            }

            var defMap = {};
            DEFAULT_DATA.teachers.forEach(function(t) { defMap[t.name] = t.subjects; });

            list.forEach(function(t) {
                t.max_periods_daily = parseInt(t.max_periods_daily) || 6;
                t.max_periods_weekly = parseInt(t.max_periods_weekly) || 35;
                if (!t.subjects || t.subjects.length === 0) {
                    if (defMap[t.name]) {
                        t.subjects = defMap[t.name].slice();
                    } else if (t.department && t.department !== "General") {
                        t.subjects = t.department.split(",").map(function(s) { return s.trim(); });
                    } else {
                        t.subjects = [];
                    }
                }
            });
            if (cloudOk) { try { localStorage.setItem("SCH_TEACHERS", JSON.stringify(list)); } catch (e) {} }
            return list;
        },

        addTeacher: async function(teacher) {
            var subjects = Array.isArray(teacher.subjects) ? teacher.subjects : (teacher.subjects ? [teacher.subjects] : (teacher.department ? [teacher.department] : []));
            var newT = {
                id: teacher.id || ("t-" + Date.now()),
                name: teacher.name,
                department: teacher.department || (subjects.length > 0 ? subjects.join(", ") : "General"),
                subjects: subjects,
                max_periods_weekly: parseInt(teacher.max_periods_weekly) || 35,
                max_periods_daily: parseInt(teacher.max_periods_daily) || 6
            };

            if (isConnected && supabaseClient) {
                var sbPayload = {
                    name: newT.name,
                    department: newT.department,
                    max_periods_weekly: newT.max_periods_weekly,
                    max_periods_daily: newT.max_periods_daily
                };
                var res = await supabaseClient.from("teachers").insert([sbPayload]).select().single();
                if (!res.error && res.data) {
                    newT.id = res.data.id;
                } else if (res.error) { this._fail("addTeacher", res.error); }
            }

            var list = JSON.parse(localStorage.getItem("SCH_TEACHERS") || "[]");
            list.push(newT);
            localStorage.setItem("SCH_TEACHERS", JSON.stringify(list));
            return newT;
        },

        updateTeacher: async function(id, updates) {
            if (isConnected && supabaseClient) {
                var sbUpdates = Object.assign({}, updates);
                delete sbUpdates.subjects;
                var res = await supabaseClient.from("teachers").update(sbUpdates).eq("id", id).select().single();
                if (res.error) console.error("Supabase updateTeacher error:", res.error);
            }

            var list = JSON.parse(localStorage.getItem("SCH_TEACHERS") || "[]");
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    Object.assign(list[i], updates);
                    break;
                }
            }
            localStorage.setItem("SCH_TEACHERS", JSON.stringify(list));
            return updates;
        },

        deleteTeacher: async function(id) {
            if (isConnected && supabaseClient) {
                await supabaseClient.from("teachers").delete().eq("id", id);
            }
            var list = JSON.parse(localStorage.getItem("SCH_TEACHERS") || "[]").filter(function(t) { return t.id !== id; });
            localStorage.setItem("SCH_TEACHERS", JSON.stringify(list));

            // Also delete associated allocations
            var allocs = JSON.parse(localStorage.getItem("SCH_ALLOCATIONS") || "[]").filter(function(a) { return a.teacher_id !== id; });
            localStorage.setItem("SCH_ALLOCATIONS", JSON.stringify(allocs));
            return true;
        },

        // ==========================
        // SUBJECTS CRUD
        // ==========================
        getSubjects: async function() {
            if (isConnected && supabaseClient) {
                var res = await supabaseClient.from("subjects").select("*").order("name");
                if (res.error) this._fail("getSubjects", res.error);
                else { try { localStorage.setItem("SCH_SUBJECTS", JSON.stringify(res.data || [])); } catch (e) {} return res.data || []; }
            }
            return JSON.parse(localStorage.getItem("SCH_SUBJECTS") || "[]");
        },

        addSubject: async function(subject) {
            var newS = {
                id: subject.id || ("s-" + Date.now()),
                name: subject.name,
                code: subject.code || subject.name.slice(0, 4).toUpperCase(),
                color_accent: subject.color_accent || "#3b82f6"
            };

            if (isConnected && supabaseClient) {
                var sbS = { name: newS.name, code: newS.code, color_accent: newS.color_accent };
                var res = await supabaseClient.from("subjects").insert([sbS]).select().single();
                if (!res.error && res.data) return res.data;
                if (res.error) this._fail("addSubject", res.error);
            }

            var list = JSON.parse(localStorage.getItem("SCH_SUBJECTS") || "[]");
            list.push(newS);
            localStorage.setItem("SCH_SUBJECTS", JSON.stringify(list));
            return newS;
        },

        updateSubject: async function(id, updates) {
            if (isConnected && supabaseClient) {
                var res = await supabaseClient.from("subjects").update(updates).eq("id", id).select().single();
                if (!res.error && res.data) return res.data;
            }

            var list = JSON.parse(localStorage.getItem("SCH_SUBJECTS") || "[]");
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    Object.assign(list[i], updates);
                    break;
                }
            }
            localStorage.setItem("SCH_SUBJECTS", JSON.stringify(list));
            return updates;
        },

        deleteSubject: async function(id) {
            if (isConnected && supabaseClient) {
                await supabaseClient.from("subjects").delete().eq("id", id);
            }
            var list = JSON.parse(localStorage.getItem("SCH_SUBJECTS") || "[]").filter(function(s) { return s.id !== id; });
            localStorage.setItem("SCH_SUBJECTS", JSON.stringify(list));
            return true;
        },

        // ==========================
        // CLASSES CRUD
        // ==========================
        getClasses: async function() {
            if (isConnected && supabaseClient) {
                var res = await supabaseClient.from("classes").select("*").order("grade");
                if (res.error) this._fail("getClasses", res.error);
                else { try { localStorage.setItem("SCH_CLASSES", JSON.stringify(res.data || [])); } catch (e) {} return res.data || []; }
            }
            return JSON.parse(localStorage.getItem("SCH_CLASSES") || "[]");
        },

        addClass: async function(cls) {
            var newC = {
                id: cls.id || ("c-" + Date.now()),
                name: cls.name,
                grade: parseInt(cls.grade) || 1,
                section: cls.section || "A"
            };

            if (isConnected && supabaseClient) {
                var sbC = { name: newC.name, grade: newC.grade, section: newC.section };
                var res = await supabaseClient.from("classes").insert([sbC]).select().single();
                if (!res.error && res.data) return res.data;
                if (res.error) this._fail("addClass", res.error);
            }

            var list = JSON.parse(localStorage.getItem("SCH_CLASSES") || "[]");
            list.push(newC);
            localStorage.setItem("SCH_CLASSES", JSON.stringify(list));
            return newC;
        },

        deleteClass: async function(id) {
            if (isConnected && supabaseClient) {
                await supabaseClient.from("classes").delete().eq("id", id);
            }
            var list = JSON.parse(localStorage.getItem("SCH_CLASSES") || "[]").filter(function(c) { return c.id !== id; });
            localStorage.setItem("SCH_CLASSES", JSON.stringify(list));
            return true;
        },

        // ==========================
        // ALLOCATIONS CRUD
        // ==========================
        getAllocations: async function() {
            var teachers = await this.getTeachers();
            var subjects = await this.getSubjects();
            var classes = await this.getClasses();

            var tMap = {}, sMap = {}, cMap = {};
            teachers.forEach(function(t) { tMap[t.id] = t; tMap[t.name] = t; });
            subjects.forEach(function(s) { sMap[s.id] = s; sMap[s.name] = s; });
            classes.forEach(function(c) { cMap[c.id] = c; cMap[c.name] = c; });

            if (isConnected && supabaseClient) {
                var res = await supabaseClient
                    .from("allocations")
                    .select("*, teachers(name), subjects(name), classes(name, grade, section)");
                if (res.error) this._fail("getAllocations", res.error);
                if (!res.error && res.data) {
                    var mappedA = res.data.map(function(r) {
                        return {
                            id: r.id,
                            teacher_id: r.teacher_id,
                            teacher_name: r.teachers?.name || (tMap[r.teacher_id] ? tMap[r.teacher_id].name : "Unknown"),
                            subject_id: r.subject_id,
                            subject_name: r.subjects?.name || (sMap[r.subject_id] ? sMap[r.subject_id].name : "Unknown"),
                            class_id: r.class_id,
                            class_name: r.classes?.name || (cMap[r.class_id] ? cMap[r.class_id].name : "Unknown"),
                            periods_per_week: parseInt(r.periods_per_week) || 1
                        };
                    });
                    try { localStorage.setItem("SCH_ALLOCATIONS", JSON.stringify(mappedA)); } catch (e) {}
                    return mappedA;
                }
            }

            var rawAllocs = JSON.parse(localStorage.getItem("SCH_ALLOCATIONS") || "[]");
            return rawAllocs.map(function(a) {
                var t = tMap[a.teacher_id] || tMap[a.teacher_name] || { name: a.teacher_name || "Unknown" };
                var s = sMap[a.subject_id] || sMap[a.subject_name] || { name: a.subject_name || "Unknown" };
                var c = cMap[a.class_id] || cMap[a.class_name] || { name: a.class_name || "Unknown" };
                return {
                    id: a.id,
                    teacher_id: a.teacher_id,
                    teacher_name: t.name,
                    subject_id: a.subject_id,
                    subject_name: s.name,
                    class_id: a.class_id,
                    class_name: c.name,
                    periods_per_week: parseInt(a.periods_per_week) || 1
                };
            });
        },

        addAllocation: async function(teacher_id, subject_id, class_id, periods) {
            var periodsInt = parseInt(periods) || 1;
            var newAlloc = {
                id: "alloc-" + Date.now(),
                teacher_id: teacher_id,
                subject_id: subject_id,
                class_id: class_id,
                periods_per_week: periodsInt
            };

            if (isConnected && supabaseClient) {
                var res = await supabaseClient.from("allocations").insert([{
                    teacher_id: teacher_id,
                    subject_id: subject_id,
                    class_id: class_id,
                    periods_per_week: periodsInt
                }]).select("*, teachers(name), subjects(name), classes(name)").single();
                if (res.error) this._fail("addAllocation", res.error);
                if (!res.error && res.data) {
                    newAlloc.id = res.data.id;
                    newAlloc.teacher_name = res.data.teachers?.name;
                    newAlloc.subject_name = res.data.subjects?.name;
                    newAlloc.class_name = res.data.classes?.name;
                }
            }

            var list = JSON.parse(localStorage.getItem("SCH_ALLOCATIONS") || "[]");
            list.push(newAlloc);
            localStorage.setItem("SCH_ALLOCATIONS", JSON.stringify(list));
            return newAlloc;
        },

        // Change periods and/or teacher of an existing assignment (inline editing)
        updateAllocation: async function(id, updates) {
            var clean = {};
            if (updates.periods_per_week !== undefined) clean.periods_per_week = Math.max(1, parseInt(updates.periods_per_week) || 1);
            if (updates.teacher_id) clean.teacher_id = updates.teacher_id;
            if (isConnected && supabaseClient) {
                var r = await supabaseClient.from("allocations").update(clean).eq("id", id);
                if (r.error) this._fail("updateAllocation", r.error);
            }
            var list = JSON.parse(localStorage.getItem("SCH_ALLOCATIONS") || "[]");
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === id) { Object.assign(list[i], clean); break; }
            }
            localStorage.setItem("SCH_ALLOCATIONS", JSON.stringify(list));
            return true;
        },

        deleteAllocation: async function(id) {
            if (isConnected && supabaseClient) {
                await supabaseClient.from("allocations").delete().eq("id", id);
            }
            var list = JSON.parse(localStorage.getItem("SCH_ALLOCATIONS") || "[]").filter(function(a) { return a.id !== id; });
            localStorage.setItem("SCH_ALLOCATIONS", JSON.stringify(list));
            return true;
        },

        // ==========================
        // CURRICULUM CRUD
        // ==========================
        getCurriculum: async function() {
            var client = this.client || supabaseClient;
            if (isConnected && client) {
                try {
                    const { data, error } = await client
                        .from('curriculum')
                        .select('*, subjects(name, color_accent)')
                        .order('grade');
                    if (error) this._fail("getCurriculum", error);
                    if (!error && data && data.length > 0) {
                        return data.map(r => ({
                            ...r,
                            subject_name: r.subjects?.name,
                            subject_color: r.subjects?.color_accent
                        }));
                    }
                } catch (e) {
                    console.warn("Supabase getCurriculum fallback:", e);
                }
            }

            // Fallback from localStorage
            var cached = JSON.parse(localStorage.getItem("SCH_CURRICULUM") || "[]");
            if (cached.length > 0) return cached;

            var subjects = await this.getSubjects();
            var sMap = {};
            subjects.forEach(s => { sMap[s.name] = s; });

            var built = DEFAULT_DATA.defaultCurriculum.map((c, i) => {
                var s = sMap[c.subject_name] || { id: "s-" + i, color_accent: "#3b82f6" };
                return {
                    id: "cur-" + (i + 1),
                    grade: c.grade,
                    subject_id: s.id,
                    subject_name: c.subject_name,
                    subject_color: s.color_accent,
                    periods_per_week: c.periods_per_week,
                    max_per_day: c.max_per_day
                };
            });
            localStorage.setItem("SCH_CURRICULUM", JSON.stringify(built));
            return built;
        },

        upsertCurriculum: async function(grade, subjectId, periodsPerWeek, maxPerDay) {
            var gradeInt = parseInt(grade);
            var ppwInt = parseInt(periodsPerWeek) || 1;
            var mpdInt = parseInt(maxPerDay) || 1;

            var client = this.client || supabaseClient;
            if (isConnected && client) {
                const { error } = await client.from('curriculum').upsert({
                    grade: gradeInt,
                    subject_id: subjectId,
                    periods_per_week: ppwInt,
                    max_per_day: mpdInt
                }, { onConflict: 'grade,subject_id' });
                if (error) console.error("Supabase upsertCurriculum error:", error);
            }

            // Sync with local cache
            var list = JSON.parse(localStorage.getItem("SCH_CURRICULUM") || "[]");
            var subjects = await this.getSubjects();
            var subj = subjects.find(s => s.id === subjectId) || { name: "Unknown", color_accent: "#3b82f6" };
            var idx = list.findIndex(c => c.grade === gradeInt && c.subject_id === subjectId);
            var entry = {
                id: (idx >= 0 && list[idx].id) ? list[idx].id : ("cur-" + Date.now()),
                grade: gradeInt,
                subject_id: subjectId,
                subject_name: subj.name,
                subject_color: subj.color_accent,
                periods_per_week: ppwInt,
                max_per_day: mpdInt
            };
            if (idx >= 0) list[idx] = entry; else list.push(entry);
            localStorage.setItem("SCH_CURRICULUM", JSON.stringify(list));
        },

        deleteCurriculum: async function(grade, subjectId) {
            var gradeInt = parseInt(grade);
            var client = this.client || supabaseClient;
            if (isConnected && client) {
                const { error } = await client.from('curriculum')
                    .delete().eq('grade', gradeInt).eq('subject_id', subjectId);
                if (error) console.error("Supabase deleteCurriculum error:", error);
            }
            var list = JSON.parse(localStorage.getItem("SCH_CURRICULUM") || "[]");
            list = list.filter(c => !(c.grade === gradeInt && c.subject_id === subjectId));
            localStorage.setItem("SCH_CURRICULUM", JSON.stringify(list));
        },

        // ==========================
        // TEACHER SUBJECTS MAPPING
        // ==========================
        getTeacherSubjects: async function() {
            var client = this.client || supabaseClient;
            if (isConnected && client) {
                try {
                    const { data, error } = await client
                        .from('teacher_subjects')
                        .select('*, teachers(name), subjects(name)');
                    if (error) this._fail("getTeacherSubjects", error);
                    if (!error && data && data.length > 0) {
                        return data.map(r => ({ ...r, teacher_name: r.teachers?.name, subject_name: r.subjects?.name }));
                    }
                } catch (e) {
                    console.warn("Supabase getTeacherSubjects fallback:", e);
                }
            }

            var teachers = await this.getTeachers();
            var subjects = await this.getSubjects();
            var sByName = {};
            subjects.forEach(s => { sByName[s.name] = s; });

            var res = [];
            teachers.forEach(t => {
                var subs = (t.subjects && t.subjects.length > 0) ? t.subjects : (t.department ? t.department.split(",").map(x => x.trim()) : []);
                subs.forEach(sName => {
                    var s = sByName[sName];
                    if (s) {
                        res.push({
                            teacher_id: t.id,
                            teacher_name: t.name,
                            subject_id: s.id,
                            subject_name: s.name
                        });
                    }
                });
            });
            return res;
        },

        setTeacherSubjects: async function(teacherId, subjectIds) {
            var client = this.client || supabaseClient;
            if (isConnected && client) {
                try {
                    await client.from('teacher_subjects').delete().eq('teacher_id', teacherId);
                    if (subjectIds.length > 0) {
                        const { error } = await client.from('teacher_subjects').insert(
                            subjectIds.map(sid => ({ teacher_id: teacherId, subject_id: sid }))
                        );
                        if (error) console.error("Supabase setTeacherSubjects error:", error);
                    }
                } catch (e) {
                    console.error("setTeacherSubjects exception:", e);
                }
            }

            // Sync with local teachers list
            var subjects = await this.getSubjects();
            var sById = {};
            subjects.forEach(s => { sById[s.id] = s.name; });
            var subjectNames = subjectIds.map(sid => sById[sid]).filter(Boolean);
            await this.updateTeacher(teacherId, {
                subjects: subjectNames,
                department: subjectNames.join(", ") || "General"
            });
        },

        // ==========================
        // SCHOOL SETTINGS CRUD
        // ==========================
        getSettings: async function() {
            var client = this.client || supabaseClient;
            if (isConnected && client) {
                try {
                    const { data, error } = await client.from('school_settings').select('*');
                    if (error) this._fail("getSettings", error);
                    if (!error && data && data.length > 0) {
                        const result = {};
                        data.forEach(row => { result[row.key] = row.value; });
                        return result;
                    }
                } catch (e) {
                    console.warn("Supabase getSettings fallback:", e);
                }
            }
            return JSON.parse(localStorage.getItem('SCH_SETTINGS') || '{}');
        },

        saveSetting: async function(key, value) {
            var client = this.client || supabaseClient;
            if (isConnected && client) {
                try {
                    const { error } = await client.from('school_settings')
                        .upsert({ key, value: String(value) }, { onConflict: 'key' });
                    if (error) console.warn('Supabase saveSetting error:', error);
                } catch (e) {
                    console.warn('saveSetting error:', e);
                }
            }
            const settings = JSON.parse(localStorage.getItem('SCH_SETTINGS') || '{}');
            settings[key] = String(value);
            localStorage.setItem('SCH_SETTINGS', JSON.stringify(settings));
        },

        // ==========================
        // CHANGE AUDIT LOG
        // ==========================
        addChangeLog: async function(entityType, entityId, description, oldValue, newValue) {
            var client = this.client || supabaseClient;
            if (isConnected && client) {
                try {
                    await client.from('change_log').insert({
                        entity_type: entityType,
                        entity_id: String(entityId),
                        description: description,
                        old_value: oldValue,
                        new_value: newValue
                    });
                } catch (e) {
                    console.warn("Supabase addChangeLog error:", e);
                }
            }
            var logs = JSON.parse(localStorage.getItem('SCH_CHANGE_LOG') || '[]');
            logs.unshift({
                entity_type: entityType,
                entity_id: String(entityId),
                description: description,
                old_value: oldValue,
                new_value: newValue,
                changed_at: new Date().toISOString()
            });
            if (logs.length > 200) logs.length = 200;
            localStorage.setItem('SCH_CHANGE_LOG', JSON.stringify(logs));
        },

        getChangeLog: async function(limit = 50) {
            var client = this.client || supabaseClient;
            if (isConnected && client) {
                try {
                    const { data } = await client.from('change_log')
                        .select('*').order('changed_at', { ascending: false }).limit(limit);
                    if (data && data.length > 0) return data;
                } catch (e) {}
            }
            const logs = JSON.parse(localStorage.getItem('SCH_CHANGE_LOG') || '[]');
            return logs.slice(0, limit);
        },

        // ==========================
        // TEACHER-SUBJECT MAPPING & REASSIGNMENT
        // ==========================
        getTeacherSubjectsMap: async function() {
            var teachers = await this.getTeachers();
            var allocs = await this.getAllocations();
            var map = {};
            teachers.forEach(function(t) {
                map[t.name] = (t.subjects && t.subjects.length > 0) ? t.subjects.slice() : [];
            });
            allocs.forEach(function(a) {
                if (a.teacher_name && a.subject_name) {
                    if (!map[a.teacher_name]) map[a.teacher_name] = [];
                    if (!map[a.teacher_name].includes(a.subject_name)) {
                        map[a.teacher_name].push(a.subject_name);
                    }
                }
            });
            return map;
        },

        getSubjectTeachersMap: async function() {
            var tMap = await this.getTeacherSubjectsMap();
            var sMap = {};
            for (var t in tMap) {
                tMap[t].forEach(function(s) {
                    if (!sMap[s]) sMap[s] = [];
                    if (!sMap[s].includes(t)) sMap[s].push(t);
                });
            }
            return sMap;
        },

        getTeachersForSubject: async function(subjectName) {
            var sMap = await this.getSubjectTeachersMap();
            var tNames = sMap[subjectName] || [];
            var teachers = await this.getTeachers();
            return teachers.filter(function(t) { return tNames.includes(t.name); });
        },

        getSubjectsForTeacher: async function(teacherName) {
            var tMap = await this.getTeacherSubjectsMap();
            return tMap[teacherName] || [];
        },

        getSubjectObjectsForTeacher: async function(teacherName) {
            var tMap = await this.getTeacherSubjectsMap();
            var sNames = tMap[teacherName] || [];
            var subjects = await this.getSubjects();
            return subjects.filter(function(s) { return sNames.includes(s.name); });
        },

        getAllocationsForTeacher: async function(teacherId) {
            var allocs = await this.getAllocations();
            return allocs.filter(function(a) { return a.teacher_id === teacherId; });
        },

        reassignTeacherClassesAndSubjects: async function(teacherId, payload) {
            var teachers = await this.getTeachers();
            var allSubjects = await this.getSubjects();
            var allClasses = await this.getClasses();

            var teacher = teachers.find(function(t) { return t.id === teacherId; });
            var teacherName = teacher ? teacher.name : "";

            if (payload.subjectName) {
                var foundSub = allSubjects.find(function(s) {
                    return s.name.toLowerCase() === payload.subjectName.toLowerCase();
                });
                var subId = foundSub ? foundSub.id : ("s-" + payload.subjectName.toLowerCase().replace(/\s+/g, '-'));

                payload.newSubjects = [payload.subjectName];
                payload.department = payload.subjectName;

                var allocList = [];
                var pCount = parseInt(payload.periodsPerWeek) || 5;
                (payload.classNames || []).forEach(function(cName) {
                    var foundCls = allClasses.find(function(c) { return c.name === cName; });
                    var clsId = foundCls ? foundCls.id : ("c-" + cName.toLowerCase().replace(/\s+/g, '-'));
                    allocList.push({
                        subject_id: subId,
                        class_id: clsId,
                        periods_per_week: pCount
                    });
                });
                payload.allocations = allocList;
            }

            if (isConnected && supabaseClient) {
                // Delete existing allocations for this teacher in Supabase
                await supabaseClient.from("allocations").delete().eq("teacher_id", teacherId);

                // Insert new allocations
                if (payload.allocations && payload.allocations.length > 0) {
                    var rows = payload.allocations.map(function(a) {
                        return {
                            teacher_id: teacherId,
                            subject_id: a.subject_id,
                            class_id: a.class_id,
                            periods_per_week: parseInt(a.periods_per_week) || 1
                        };
                    });
                    await supabaseClient.from("allocations").insert(rows);
                }

                // Update teacher department
                if (payload.department || (payload.newSubjects && payload.newSubjects.length > 0)) {
                    var dept = payload.department || payload.newSubjects.join(", ");
                    await supabaseClient.from("teachers").update({ department: dept }).eq("id", teacherId);
                }
            }

            // Sync Local Storage
            var allAllocs = JSON.parse(localStorage.getItem("SCH_ALLOCATIONS") || "[]");
            allAllocs = allAllocs.filter(function(a) { return a.teacher_id !== teacherId; });

            if (payload.allocations && payload.allocations.length > 0) {
                var startId = Date.now();
                payload.allocations.forEach(function(a, idx) {
                    allAllocs.push({
                        id: "alloc-" + (startId + idx),
                        teacher_id: teacherId,
                        subject_id: a.subject_id,
                        class_id: a.class_id,
                        periods_per_week: parseInt(a.periods_per_week) || 1
                    });
                });
            }
            localStorage.setItem("SCH_ALLOCATIONS", JSON.stringify(allAllocs));

            // Update teacher in local storage
            var localTeachers = JSON.parse(localStorage.getItem("SCH_TEACHERS") || "[]");
            for (var j = 0; j < localTeachers.length; j++) {
                if (localTeachers[j].id === teacherId) {
                    if (payload.newSubjects) localTeachers[j].subjects = payload.newSubjects;
                    if (payload.department) localTeachers[j].department = payload.department;
                    else if (payload.newSubjects) localTeachers[j].department = payload.newSubjects.join(", ");
                    break;
                }
            }
            localStorage.setItem("SCH_TEACHERS", JSON.stringify(localTeachers));

            return { success: true };
        },

        // Export All Database Records as JSON
        exportAllData: async function() {
            var teachers = await this.getTeachers();
            var subjects = await this.getSubjects();
            var classes = await this.getClasses();
            var allocations = await this.getAllocations();
            var curriculum = await this.getCurriculum();
            var settings = await this.getSettings();

            return {
                timestamp: new Date().toISOString(),
                source: isConnected ? "Supabase Cloud" : "Local Storage",
                school_name: settings.school_name || "Smart School",
                settings: settings,
                teachers: teachers,
                subjects: subjects,
                classes: classes,
                curriculum: curriculum,
                allocations: allocations
            };
        },

        // ==========================
        // SUBSTITUTIONS CRUD
        // ==========================
        getSubstitutions: async function(filterDay) {
            var list = [];
            if (isConnected && supabaseClient) {
                var query = supabaseClient.from("substitutions").select("*").order("created_at", { ascending: false });
                if (filterDay) query = query.eq("day", filterDay);
                var res = await query;
                if (!res.error && res.data) {
                    var m = await this._idMaps();
                    // the app displays names, the cloud stores UUIDs
                    list = res.data.map(function(r) {
                        return {
                            id: r.id, day: r.day, period: r.period,
                            class_id: m.cRev[r.class_id] || r.class_id,
                            original_teacher_id: m.tRev[r.original_teacher_id] || r.original_teacher_id,
                            substitute_teacher_id: m.tRev[r.substitute_teacher_id] || r.substitute_teacher_id,
                            subject_id: m.sRev[r.subject_id] || r.subject_id,
                            note: r.note, created_at: r.created_at
                        };
                    });
                    return list;
                }
                if (res.error) this._fail("getSubstitutions", res.error);
            }
            list = JSON.parse(localStorage.getItem("SCH_SUBSTITUTIONS") || "[]");
            if (filterDay) list = list.filter(function(s) { return s.day === filterDay; });
            return list;
        },

        saveSubstitution: async function(sub) {
            var newSub = {
                id: sub.id || ("sub-" + Date.now()),
                day: sub.day,
                period: parseInt(sub.period),
                class_id: sub.class_id || sub.className || "",
                original_teacher_id: sub.original_teacher_id || sub.originalTeacher || "",
                substitute_teacher_id: sub.substitute_teacher_id || sub.substituteTeacher || "",
                subject_id: sub.subject_id || sub.subject || "",
                note: sub.note || "",
                created_at: sub.created_at || new Date().toISOString()
            };

            if (isConnected && supabaseClient) {
                var m = await this._idMaps();
                var row = {
                    day: newSub.day, period: newSub.period,
                    class_id: m.c[newSub.class_id],
                    original_teacher_id: m.t[newSub.original_teacher_id],
                    substitute_teacher_id: m.t[newSub.substitute_teacher_id],
                    subject_id: m.s[newSub.subject_id],
                    note: newSub.note
                };
                if (row.class_id && row.original_teacher_id && row.substitute_teacher_id && row.subject_id) {
                    var res = await supabaseClient.from("substitutions")
                        .upsert([row], { onConflict: "class_id,day,period" }).select().single();
                    if (!res.error && res.data) { newSub.id = res.data.id; return newSub; }
                    if (res.error) this._fail("saveSubstitution", res.error);
                } else {
                    this._fail("saveSubstitution", "Could not match names to database records (class/teacher/subject)");
                }
            }

            var list = JSON.parse(localStorage.getItem("SCH_SUBSTITUTIONS") || "[]");
            var existingIdx = list.findIndex(function(s) {
                return s.day === newSub.day && s.period === newSub.period && s.class_id === newSub.class_id;
            });
            if (existingIdx >= 0) list[existingIdx] = newSub; else list.push(newSub);
            localStorage.setItem("SCH_SUBSTITUTIONS", JSON.stringify(list));
            return newSub;
        },

        deleteSubstitution: async function(id) {
            if (isConnected && supabaseClient) {
                var r = await supabaseClient.from("substitutions").delete().eq("id", id);
                if (r.error) this._fail("deleteSubstitution", r.error);
            }
            var list = JSON.parse(localStorage.getItem("SCH_SUBSTITUTIONS") || "[]").filter(function(s) {
                return s.id !== id;
            });
            localStorage.setItem("SCH_SUBSTITUTIONS", JSON.stringify(list));
            return true;
        },

        // ==========================
        // TIMETABLE (saved in Supabase table `timetable_slots`)
        // ==========================
        saveTimetable: async function(schedule) {
            localStorage.setItem("SCH_ACTIVE_TIMETABLE", JSON.stringify(schedule));
            if (!(isConnected && supabaseClient)) return { cloud: false };
            var m = await this._idMaps();
            var rows = [];
            for (var cls in schedule) {
                for (var day in schedule[cls]) {
                    for (var p in schedule[cls][day]) {
                        var cell = schedule[cls][day][p];
                        if (!m.c[cls]) continue;
                        rows.push({
                            class_id: m.c[cls], day: day, period: parseInt(p),
                            teacher_id: (cell && cell.teacher && m.t[cell.teacher]) || null,
                            subject_id: (cell && cell.subject && m.s[cell.subject]) || null
                        });
                    }
                }
            }
            var del = await supabaseClient.from("timetable_slots").delete().not("id", "is", null);
            if (del.error) { this._fail("saveTimetable (clear)", del.error); return { cloud: false }; }
            for (var i = 0; i < rows.length; i += 500) {
                var ins = await supabaseClient.from("timetable_slots").insert(rows.slice(i, i + 500));
                if (ins.error) { this._fail("saveTimetable", ins.error); return { cloud: false }; }
            }
            return { cloud: true, rows: rows.length };
        },

        loadTimetable: async function() {
            if (isConnected && supabaseClient) {
                var res = await supabaseClient.from("timetable_slots").select("*");
                if (!res.error && res.data && res.data.length > 0) {
                    var m = await this._idMaps();
                    var sch = {};
                    res.data.forEach(function(r) {
                        var cn = m.cRev[r.class_id]; if (!cn) return;
                        sch[cn] = sch[cn] || {};
                        sch[cn][r.day] = sch[cn][r.day] || {};
                        sch[cn][r.day][r.period] = (r.subject_id && m.sRev[r.subject_id])
                            ? { subject: m.sRev[r.subject_id], teacher: r.teacher_id ? (m.tRev[r.teacher_id] || null) : null }
                            : null;
                    });
                    localStorage.setItem("SCH_ACTIVE_TIMETABLE", JSON.stringify(sch));
                    return sch;
                }
                if (res.error) this._fail("loadTimetable", res.error);
            }
            try { return JSON.parse(localStorage.getItem("SCH_ACTIVE_TIMETABLE") || "null"); } catch (e) { return null; }
        },

        clearTimetableData: async function() {
            localStorage.removeItem("SCH_ACTIVE_TIMETABLE");
            if (isConnected && supabaseClient) {
                var r = await supabaseClient.from("timetable_slots").delete().not("id", "is", null);
                if (r.error) this._fail("clearTimetable", r.error);
            }
        },

        // Helper: Find Free Teachers for any slot with intelligent ranking
        getFreeTeachersForSlot: function(day, period, schedule, teachersList, periodsList) {
            var busyTeachers = new Set();
            var dayLoads = {};
            var weekLoads = {};

            teachersList.forEach(function(t) {
                dayLoads[t.name] = 0;
                weekLoads[t.name] = 0;
            });

            // Calculate busy status and day/week counts from current schedule
            for (var cls in schedule) {
                for (var d in schedule[cls]) {
                    for (var p in schedule[cls][d]) {
                        var cell = schedule[cls][d][p];
                        if (cell && cell.teacher) {
                            weekLoads[cell.teacher] = (weekLoads[cell.teacher] || 0) + 1;
                            if (d === day) {
                                dayLoads[cell.teacher] = (dayLoads[cell.teacher] || 0) + 1;
                                if (parseInt(p) === parseInt(period)) {
                                    busyTeachers.add(cell.teacher);
                                }
                            }
                        }
                    }
                }
            }

            var freeTeachers = [];
            teachersList.forEach(function(t) {
                if (!busyTeachers.has(t.name)) {
                    var maxD = t.max_periods_daily || 6;
                    var maxW = t.max_periods_weekly || 35;
                    var todayCnt = dayLoads[t.name] || 0;
                    var weekCnt = weekLoads[t.name] || 0;
                    var canTakeMoreToday = (todayCnt < maxD);

                    freeTeachers.push({
                        id: t.id,
                        name: t.name,
                        department: t.department,
                        subjects: t.subjects || [],
                        periods_today: todayCnt,
                        max_periods_daily: maxD,
                        periods_weekly: weekCnt,
                        max_periods_weekly: maxW,
                        can_take_more_today: canTakeMoreToday,
                        available_slots_today: Math.max(0, maxD - todayCnt)
                    });
                }
            });

            // Rank free teachers:
            // 1. Teachers who can take more today (todayCnt < maxD)
            // 2. Fewest periods today
            // 3. Fewest periods this week
            freeTeachers.sort(function(a, b) {
                if (a.can_take_more_today !== b.can_take_more_today) {
                    return a.can_take_more_today ? -1 : 1;
                }
                if (a.periods_today !== b.periods_today) {
                    return a.periods_today - b.periods_today;
                }
                return a.periods_weekly - b.periods_weekly;
            });

            return {
                day: day,
                period: period,
                totalTeachers: teachersList.length,
                busyCount: busyTeachers.size,
                freeCount: freeTeachers.length,
                freeTeachers: freeTeachers
            };
        },

        // Reset to Initial Seed Data
        resetToDefault: function() {
            localStorage.removeItem("SCH_TEACHERS");
            localStorage.removeItem("SCH_SUBJECTS");
            localStorage.removeItem("SCH_CLASSES");
            localStorage.removeItem("SCH_ALLOCATIONS");
            localStorage.removeItem("SCH_CURRICULUM");
            localStorage.removeItem("SCH_SETTINGS");
            localStorage.removeItem("SCH_SUBSTITUTIONS");
            localStorage.removeItem("SCH_ACTIVE_TIMETABLE");
            initLocalStorage();
        }
    };
})();
