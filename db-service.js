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

        // Init connection to Supabase
        init: async function() {
            initLocalStorage();
            var defaultUrl = "https://aoxloxnkctbccyqsdghk.supabase.co";
            var defaultKey = "sb_publishable_WfV3i9xNoFmsiLUiJtzoRA_tWUcBtIW";
            var url = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || localStorage.getItem("SB_URL") || defaultUrl;
            var key = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || localStorage.getItem("SB_KEY") || defaultKey;

            if (url && key && window.supabase && window.supabase.createClient) {
                try {
                    supabaseClient = window.supabase.createClient(url, key);
                    this.client = supabaseClient;
                    // Test ping
                    var test = await supabaseClient.from("teachers").select("count", { count: "exact", head: true });
                    if (!test.error) {
                        isConnected = true;
                        console.log("Connected to Supabase PostgreSQL Database successfully!");
                        return { connected: true, client: supabaseClient };
                    } else {
                        console.warn("Supabase credentials entered, but test query returned:", test.error.message);
                    }
                } catch (e) {
                    console.warn("Supabase connection failed, falling back to Local Storage:", e);
                }
            }

            isConnected = false;
            this.client = supabaseClient;
            return { connected: false, fallback: true };
        },

        isConnected: function() {
            return isConnected;
        },

        setCredentials: async function(url, key) {
            localStorage.setItem("SB_URL", url);
            localStorage.setItem("SB_KEY", key);
            return await this.init();
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
            var list = [];
            if (isConnected && supabaseClient) {
                var res = await supabaseClient.from("teachers").select("*").order("name");
                if (!res.error && res.data && res.data.length > 0) {
                    list = res.data;
                }
            }
            if (!list || list.length === 0) {
                list = JSON.parse(localStorage.getItem("SCH_TEACHERS") || "[]");
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
                }
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
                if (!res.error && res.data && res.data.length > 0) return res.data;
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
                var res = await supabaseClient.from("subjects").insert([newS]).select().single();
                if (!res.error && res.data) return res.data;
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
                if (!res.error && res.data && res.data.length > 0) return res.data;
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
                var res = await supabaseClient.from("classes").insert([newC]).select().single();
                if (!res.error && res.data) return res.data;
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
                if (!res.error && res.data && res.data.length > 0) {
                    return res.data.map(function(r) {
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
                if (!res.error && res.data) list = res.data;
            } else {
                list = JSON.parse(localStorage.getItem("SCH_SUBSTITUTIONS") || "[]");
                if (filterDay) {
                    list = list.filter(function(s) { return s.day === filterDay; });
                }
            }
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
                var res = await supabaseClient.from("substitutions").upsert([newSub]).select().single();
                if (!res.error && res.data) return res.data;
            }

            var list = JSON.parse(localStorage.getItem("SCH_SUBSTITUTIONS") || "[]");
            var existingIdx = list.findIndex(function(s) {
                return s.day === newSub.day && s.period === newSub.period && s.class_id === newSub.class_id;
            });
            if (existingIdx >= 0) {
                list[existingIdx] = newSub;
            } else {
                list.push(newSub);
            }
            localStorage.setItem("SCH_SUBSTITUTIONS", JSON.stringify(list));
            return newSub;
        },

        deleteSubstitution: async function(id) {
            if (isConnected && supabaseClient) {
                await supabaseClient.from("substitutions").delete().eq("id", id);
            }
            var list = JSON.parse(localStorage.getItem("SCH_SUBSTITUTIONS") || "[]").filter(function(s) {
                return s.id !== id;
            });
            localStorage.setItem("SCH_SUBSTITUTIONS", JSON.stringify(list));
            return true;
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
            initLocalStorage();
        }
    };
})();
