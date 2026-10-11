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
        ],

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
            { id: "s-nazra", name: "Nazra", code: "NZR", color_accent: "#eab308" }
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
        })
    };

    // Helper: Build ID maps for rapid lookups
    function getEntityMaps(data) {
        var tByName = {}, tById = {};
        var sByName = {}, sById = {};
        var cByName = {}, cById = {};

        data.teachers.forEach(function(t) { tByName[t.name] = t; tById[t.id] = t; });
        data.subjects.forEach(function(s) { sByName[s.name] = s; sById[s.id] = s; });
        data.classes.forEach(function(c) { cByName[c.name] = c; cById[c.id] = c; });

        return { tByName: tByName, tById: tById, sByName: sByName, sById: sById, cByName: cByName, cById: cById };
    }

    // Initialize LocalStorage Data if not present
    function initLocalStorage() {
        if (!localStorage.getItem("SCH_TEACHERS")) {
            localStorage.setItem("SCH_TEACHERS", JSON.stringify(DEFAULT_DATA.teachers));
        } else {
            // Ensure existing cached teachers have subjects array populated
            var cachedTeachers = JSON.parse(localStorage.getItem("SCH_TEACHERS") || "[]");
            var updated = false;
            var defMap = {};
            DEFAULT_DATA.teachers.forEach(function(t) { defMap[t.name] = t.subjects; });
            cachedTeachers.forEach(function(t) {
                if (!t.subjects || t.subjects.length === 0) {
                    t.subjects = defMap[t.name] || (t.department && t.department !== "General" ? [t.department] : []);
                    updated = true;
                }
            });
            if (updated) localStorage.setItem("SCH_TEACHERS", JSON.stringify(cachedTeachers));
        }
        if (!localStorage.getItem("SCH_SUBJECTS")) {
            localStorage.setItem("SCH_SUBJECTS", JSON.stringify(DEFAULT_DATA.subjects));
        }
        if (!localStorage.getItem("SCH_CLASSES")) {
            localStorage.setItem("SCH_CLASSES", JSON.stringify(DEFAULT_DATA.classes));
        }
        if (!localStorage.getItem("SCH_ALLOCATIONS")) {
            // Build default allocations from ALLOCATIONS array in index.html
            var rawAllocs = window.RAW_DEFAULT_ALLOCATIONS || [];
            var tMap = {}, sMap = {}, cMap = {};
            DEFAULT_DATA.teachers.forEach(function(t) { tMap[t.name] = t.id; });
            DEFAULT_DATA.subjects.forEach(function(s) { sMap[s.name] = s.id; });
            DEFAULT_DATA.classes.forEach(function(c) { cMap[c.name] = c.id; });

            var built = [];
            var allocId = 1;
            rawAllocs.forEach(function(a) {
                var tid = tMap[a.teacher];
                var sid = sMap[a.subject];
                if (tid && sid) {
                    a.classes.forEach(function(clsName) {
                        var cid = cMap[clsName];
                        if (cid) {
                            built.push({
                                id: "alloc-" + (allocId++),
                                teacher_id: tid,
                                subject_id: sid,
                                class_id: cid,
                                periods_per_week: a.periods
                            });
                        }
                    });
                }
            });
            localStorage.setItem("SCH_ALLOCATIONS", JSON.stringify(built));
        }
    }

    // Public Database Service Interface
    window.DB = {
        // Init connection to Supabase
        init: async function() {
            initLocalStorage();
            var url = localStorage.getItem("SB_URL") || (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url);
            var key = localStorage.getItem("SB_KEY") || (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey);

            if (url && key && window.supabase && window.supabase.createClient) {
                try {
                    supabaseClient = window.supabase.createClient(url, key);
                    // Test ping
                    var test = await supabaseClient.from("teachers").select("count", { count: "exact", head: true });
                    if (!test.error) {
                        isConnected = true;
                        console.log("Connected to Supabase PostgreSQL Database successfully!");

                        // Auto-check: if teachers are still marked "General", auto-sync their subject specializations
                        try {
                            var generalCheck = await supabaseClient.from("teachers").select("id").eq("department", "General").limit(1);
                            if (!generalCheck.error && generalCheck.data && generalCheck.data.length > 0) {
                                console.log("Detected unassigned 'General' teachers in Supabase. Auto-syncing subject specializations to cloud...");
                                this.syncTeacherSubjectsToSupabase();
                            }
                        } catch (syncErr) {
                            console.warn("Background subject sync error:", syncErr);
                        }

                        return { connected: true, client: supabaseClient };
                    } else {
                        console.warn("Supabase credentials entered, but test query returned:", test.error.message);
                    }
                } catch (e) {
                    console.warn("Supabase connection failed, falling back to Local Storage:", e);
                }
            }

            isConnected = false;
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
            isConnected = false;
        },

        // ==========================
        // TEACHERS CRUD
        // ==========================
        getTeachers: async function() {
            var list = [];
            if (isConnected) {
                var res = await supabaseClient.from("teachers").select("*").order("name");
                if (!res.error && res.data) list = res.data;
            } else {
                list = JSON.parse(localStorage.getItem("SCH_TEACHERS") || "[]");
            }

            var defMap = {};
            DEFAULT_DATA.teachers.forEach(function(t) { defMap[t.name] = t.subjects; });

            list.forEach(function(t) {
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
                id: teacher.id || "t-" + Date.now(),
                name: teacher.name,
                department: teacher.department || (subjects.length > 0 ? subjects.join(", ") : "General"),
                subjects: subjects,
                max_periods_weekly: parseInt(teacher.max_periods_weekly) || 35
            };

            if (isConnected) {
                var sbPayload = {
                    name: newT.name,
                    department: newT.department,
                    max_periods_weekly: newT.max_periods_weekly
                };
                var res = await supabaseClient.from("teachers").insert([sbPayload]).select().single();
                if (!res.error && res.data) {
                    newT.id = res.data.id;
                    return newT;
                }
            }

            var list = JSON.parse(localStorage.getItem("SCH_TEACHERS") || "[]");
            list.push(newT);
            localStorage.setItem("SCH_TEACHERS", JSON.stringify(list));
            return newT;
        },

        updateTeacher: async function(id, updates) {
            if (isConnected) {
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
            if (isConnected) {
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
            if (isConnected) {
                var res = await supabaseClient.from("subjects").select("*").order("name");
                if (!res.error && res.data) return res.data;
            }
            return JSON.parse(localStorage.getItem("SCH_SUBJECTS") || "[]");
        },

        addSubject: async function(subject) {
            var newS = {
                id: subject.id || "s-" + Date.now(),
                name: subject.name,
                code: subject.code || subject.name.slice(0, 4).toUpperCase(),
                color_accent: subject.color_accent || "#3b82f6"
            };

            if (isConnected) {
                var res = await supabaseClient.from("subjects").insert([newS]).select().single();
                if (!res.error && res.data) return res.data;
            }

            var list = JSON.parse(localStorage.getItem("SCH_SUBJECTS") || "[]");
            list.push(newS);
            localStorage.setItem("SCH_SUBJECTS", JSON.stringify(list));
            return newS;
        },

        updateSubject: async function(id, updates) {
            if (isConnected) {
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
            if (isConnected) {
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
            if (isConnected) {
                var res = await supabaseClient.from("classes").select("*").order("grade");
                if (!res.error && res.data) return res.data;
            }
            return JSON.parse(localStorage.getItem("SCH_CLASSES") || "[]");
        },

        addClass: async function(cls) {
            var newC = {
                id: cls.id || "c-" + Date.now(),
                name: cls.name,
                grade: parseInt(cls.grade) || 1,
                section: cls.section || "A"
            };

            if (isConnected) {
                var res = await supabaseClient.from("classes").insert([newC]).select().single();
                if (!res.error && res.data) return res.data;
            }

            var list = JSON.parse(localStorage.getItem("SCH_CLASSES") || "[]");
            list.push(newC);
            localStorage.setItem("SCH_CLASSES", JSON.stringify(list));
            return newC;
        },

        deleteClass: async function(id) {
            if (isConnected) {
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
            teachers.forEach(function(t) { tMap[t.id] = t; });
            subjects.forEach(function(s) { sMap[s.id] = s; });
            classes.forEach(function(c) { cMap[c.id] = c; });

            var rawAllocs = [];
            if (isConnected) {
                var res = await supabaseClient.from("allocations").select("*");
                if (!res.error && res.data) rawAllocs = res.data;
            } else {
                rawAllocs = JSON.parse(localStorage.getItem("SCH_ALLOCATIONS") || "[]");
            }

            // Hydrate with names for solver & display
            return rawAllocs.map(function(a) {
                var t = tMap[a.teacher_id] || { name: "Unknown" };
                var s = sMap[a.subject_id] || { name: "Unknown" };
                var c = cMap[a.class_id] || { name: "Unknown" };
                return {
                    id: a.id,
                    teacher_id: a.teacher_id,
                    teacher_name: t.name,
                    subject_id: a.subject_id,
                    subject_name: s.name,
                    class_id: a.class_id,
                    class_name: c.name,
                    periods_per_week: a.periods_per_week
                };
            });
        },

        addAllocation: async function(teacher_id, subject_id, class_id, periods) {
            var newAlloc = {
                id: "alloc-" + Date.now(),
                teacher_id: teacher_id,
                subject_id: subject_id,
                class_id: class_id,
                periods_per_week: parseInt(periods) || 1
            };

            if (isConnected) {
                var res = await supabaseClient.from("allocations").insert([{
                    teacher_id: teacher_id,
                    subject_id: subject_id,
                    class_id: class_id,
                    periods_per_week: parseInt(periods) || 1
                }]).select().single();
                if (!res.error && res.data) return res.data;
            }

            var list = JSON.parse(localStorage.getItem("SCH_ALLOCATIONS") || "[]");
            list.push(newAlloc);
            localStorage.setItem("SCH_ALLOCATIONS", JSON.stringify(list));
            return newAlloc;
        },

        deleteAllocation: async function(id) {
            if (isConnected) {
                await supabaseClient.from("allocations").delete().eq("id", id);
            }
            var list = JSON.parse(localStorage.getItem("SCH_ALLOCATIONS") || "[]").filter(function(a) { return a.id !== id; });
            localStorage.setItem("SCH_ALLOCATIONS", JSON.stringify(list));
            return true;
        },

        // ==========================
        // TEACHER-SUBJECT MAPPING & BATCH REASSIGNMENT
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
            // Supports high-level payload:
            // { subjectName: "Maths", periodsPerWeek: 5, classNames: ["10 Blue", "9 Blue"] }
            // Or low-level payload:
            // { newSubjects: ["Maths"], department: "Maths", allocations: [...] }
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

            if (isConnected) {
                // 1. Delete all existing allocations for this teacher in Supabase
                var del = await supabaseClient.from("allocations").delete().eq("teacher_id", teacherId);
                if (del.error) console.error("Supabase delete allocations error:", del.error);

                // 2. Insert new allocations
                if (payload.allocations && payload.allocations.length > 0) {
                    var rows = payload.allocations.map(function(a) {
                        return {
                            teacher_id: teacherId,
                            subject_id: a.subject_id,
                            class_id: a.class_id,
                            periods_per_week: parseInt(a.periods_per_week) || 1
                        };
                    });
                    var ins = await supabaseClient.from("allocations").insert(rows);
                    if (ins.error) console.error("Supabase insert allocations error:", ins.error);
                }

                // 3. Update department / subject specialization
                if (payload.department || (payload.newSubjects && payload.newSubjects.length > 0)) {
                    var dept = payload.department || payload.newSubjects.join(", ");
                    await supabaseClient.from("teachers").update({ department: dept }).eq("id", teacherId);
                }
            }

            // Always update Local Storage as well
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

        // Sync All Teacher Specializations directly to Supabase Cloud Database
        syncTeacherSubjectsToSupabase: async function() {
            if (!isConnected) {
                return { success: false, message: "Not connected to Supabase" };
            }
            var defMap = {};
            DEFAULT_DATA.teachers.forEach(function(t) {
                defMap[t.name] = t.department || (t.subjects ? t.subjects.join(", ") : "General");
            });

            var count = 0;
            for (var name in defMap) {
                var dept = defMap[name];
                var res = await supabaseClient.from("teachers").update({ department: dept }).eq("name", name);
                if (!res.error) count++;
            }
            console.log("Successfully synced " + count + " teacher specializations to Supabase cloud tables!");
            return { success: true, updatedCount: count };
        },

        // Export All Database Records as JSON
        exportAllData: async function() {
            var teachers = await this.getTeachers();
            var subjects = await this.getSubjects();
            var classes = await this.getClasses();
            var allocations = await this.getAllocations();

            return {
                timestamp: new Date().toISOString(),
                source: isConnected ? "Supabase Cloud" : "Local Storage",
                teachers: teachers,
                subjects: subjects,
                classes: classes,
                allocations: allocations
            };
        },

        // Reset to Initial Seed Data
        resetToDefault: function() {
            localStorage.removeItem("SCH_TEACHERS");
            localStorage.removeItem("SCH_SUBJECTS");
            localStorage.removeItem("SCH_CLASSES");
            localStorage.removeItem("SCH_ALLOCATIONS");
            initLocalStorage();
        }
    };
})();
