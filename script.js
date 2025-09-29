  let currentAdmin = null;
        let adminAuthenticated = false;

        // دادههای نمونه برای ذخیرهسازی در localStorage
        const initialData = {
            courses: [
                { id: 1, name: "خبرنگاری حرفهای", duration: 6, capacity: 30, enrolled: 25, status: "active", description: "آموزش اصول خبرنگاری و گزارشنویسی حرفهای" },
                { id: 2, name: "فن بیان و سخنوری", duration: 4, capacity: 25, enrolled: 20, status: "active", description: "تقویت مهارتهای کلامی و فن بیان" },
                { id: 3, name: "روانشناسی ارتباطات", duration: 5, capacity: 20, enrolled: 18, status: "active", description: "درک روانشناسی ارتباطات مؤثر" }
            ],
            students: [
                { id: 1, name: "محمد رضا حسینی", email: "mohammad@example.com", courses: [1, 2], joinDate: "1403/05/01" },
                { id: 2, name: "فاطمه احمدی", email: "fatemeh@example.com", courses: [1, 3], joinDate: "1403/05/10" },
                { id: 3, name: "علی محمدی", email: "ali@example.com", courses: [2], joinDate: "1403/05/15" }
            ],
            registrations: [
                { id: 1, studentName: "محمد رضا حسینی", courseName: "خبرنگاری حرفهای", date: "1403/05/01", status: "تکمیل شده" },
                { id: 2, studentName: "فاطمه احمدی", email: "fatemeh@example.com", courseName: "فن بیان و سخنوری", date: "1403/05/10", status: "در حال بررسی" }
            ],
            announcements: [
                { id: 1, title: "شروع دوره جدید خبرنگاری", content: "دوره جدید خبرنگاری حرفهای از تاریخ 1403/06/01 آغاز میشود.", priority: "high", date: "1403/05/20" },
                { id: 2, title: "برگزاری کارگاه رایگان", content: "کارگاه رایگان فن بیان در تاریخ 1403/05/25 برگزار میشود.", priority: "medium", date: "1403/05/15" }
            ],
            gallery: [
                { id: 1, title: "کارگاه فن بیان", description: "تصویری از کارگاه فن بیان در آکادمی", imageUrl: "https://via.placeholder.com/300x200/1e3a5f/ffffff?text=کارگاه+فن+بیان" },
                { id: 2, title: "دوره خبرنگاری", description: "تصویری از دوره خبرنگاری حرفهای", imageUrl: "https://via.placeholder.com/300x200/0a1930/ffffff?text=دوره+خبرنگاری" },
                { id: 3, title: "جلسه آموزشی", description: "تصویری از جلسه آموزشی با اساتید", imageUrl: "https://via.placeholder.com/300x200/2c3e50/ffffff?text=جلسه+آموزشی" }
            ],
            videos: [
                { id: 1, title: "تکنیکهای کنترل استرس در سخنرانی", category: "فن بیان", duration: 15, url: "https://example.com/video1", description: "آموزش تکنیکهای کنترل استرس در سخنرانی", uploadDate: "1403/05/10" },
                { id: 2, title: "اصول نگارش خبر حرفهای", category: "خبرنگاری", duration: 22, url: "https://example.com/video2", description: "آموزش اصول نگارش خبر حرفهای", uploadDate: "1403/05/15" },
                { id: 3, title: "تمرینات صدا سازی برای گویندگان", category: "صدا و بیان", duration: 18, url: "https://example.com/video3", description: "تمرینات صدا سازی برای گویندگان", uploadDate: "1403/05/20" }
            ],
            downloads: [
                { id: 1, title: "جزوه فن بیان پیشرفته", type: "PDF", size: 2.4, category: "فن بیان", url: "#", description: "جزوه کامل فن بیان پیشرفته", uploadDate: "1403/05/10" },
                { id: 2, title: "تمرینات عملی خبرنگاری", type: "DOCX", size: 1.8, category: "خبرنگاری", url: "#", description: "تمرینات عملی خبرنگاری", uploadDate: "1403/05/15" },
                { id: 3, title: "اسلایدهای روانشناسی ارتباطات", type: "PPTX", size: 3.2, category: "روانشناسی", url: "#", description: "اسلایدهای روانشناسی ارتباطات", uploadDate: "1403/05/20" },
                { id: 4, title: "تمرینات صدا سازی", type: "MP3", size: 15.7, category: "صدا و بیان", url: "#", description: "تمرینات صدا سازی", uploadDate: "1403/05/25" }
            ],
            quizzes: [
                { id: 1, title: "آزمون پایان ترم خبرنگاری", course: "خبرنگاری حرفهای", questions: 30, duration: 60, description: "آزمون پایان ترم دوره خبرنگاری حرفهای", status: "active" },
                { id: 2, title: "آزمون میانی فن بیان", course: "فن بیان و سخنوری", questions: 20, duration: 45, description: "آزمون میانی دوره فن بیان و سخنوری", status: "active" },
                { id: 3, title: "آزمون روانشناسی ارتباطات", course: "روانشناسی ارتباطات", questions: 25, duration: 50, description: "آزمون دوره روانشناسی ارتباطات", status: "inactive" }
            ],
            forumCategories: [
                { id: 1, name: "خبرنگاری و رسانه", description: "بحث و گفتگو درباره موضوعات مربوط به خبرنگاری، رسانه و روزنامهنگاری", topics: 245, replies: 1247 },
                { id: 2, name: "فن بیان و سخنوری", description: "مباحث مربوط به فن بیان، سخنوری، گویندگی و مهارتهای کلامی", topics: 189, replies: 987 },
                { id: 3, name: "روانشناسی و ارتباطات", description: "بحث درباره روانشناسی ارتباطات، مهارتهای اجتماعی و تعاملات انسانی", topics: 156, replies: 845 }
            ],
            admins: [
                { id: 1, name: "احمد رضا ستاری", email: "admin@setare-academy.af", password: "admin123", role: "super" }
            ],
            siteSettings: {
                title: "آکادمی نخبگان ستاری",
                description: "مرکز تخصصی آموزشهای حرفهای در کاپیسا افغانستان",
                contactPhone: "0792371380",
                contactEmail: "info@setare-academy.af"
            },
            sections: [
                { id: "courses", title: "دوره های آموزشی", visible: true, order: 1 },
                { id: "online-courses", title: "ظرفیت آنلاین", visible: true, order: 2 },
                { id: "gallery", title: "گالری آموزشی", visible: true, order: 3 },
                { id: "blog", title: "مقالات و وبلاگ", visible: true, order: 4 },
                { id: "videos", title: "ویدیوهای آموزشی", visible: true, order: 5 },
                { id: "downloads", title: "منابع قابل دانلود", visible: true, order: 6 },
                { id: "forum", title: "انجمن گفتگو", visible: true, order: 7 },
                { id: "instructors", title: "اساتید", visible: true, order: 8 },
                { id: "students", title: "شاگردان ممتاز", visible: true, order: 9 },
                { id: "registration", title: "ثبت نام", visible: true, order: 10 },
                { id: "dashboard", title: "داشبورد", visible: true, order: 11 }
            ]
        };

        // مقداردهی اولیه دادهها در localStorage
        function initializeData() {
            if (!localStorage.getItem('academyData')) {
                localStorage.setItem('academyData', JSON.stringify(initialData));
            }
        }

        // دریافت دادهها از localStorage
        function getData() {
            return JSON.parse(localStorage.getItem('academyData')) || initialData;
        }

        // ذخیره دادهها در localStorage
        function saveData(data) {
            localStorage.setItem('academyData', JSON.stringify(data));
        }

        // اعتبارسنجی ورودیها
        function sanitizeInput(input) {
            if (typeof input !== 'string') return input;
            return input.replace(/[<>]/g, '');
        }

        // تنظیم وضعیت لودینگ دکمه
        function setButtonLoading(button, isLoading) {
            if (isLoading) {
                button.disabled = true;
                button.classList.add('btn-loading');
            } else {
                button.disabled = false;
                button.classList.remove('btn-loading');
            }
        }

        // بارگذاری صفحه
        document.addEventListener('DOMContentLoaded', function() {
            initializeData();
            initializeEventListeners();
            updateStats();
            loadCourses();
            loadStudents();
            loadRecentRegistrations();
            loadAnnouncements();
            loadGallery();
            loadSections();
            loadVideos();
            loadDownloads();
            loadQuizzes();
            loadForumCategories();
            setupAnnouncementSlider();
            lazyLoadImages();
            
            // بارگذاری دادههای صفحه اصلی
            loadMainGallery();
            loadMainVideos();
            loadMainDownloads();
            loadMainForum();
            
            // بررسی وضعیت ورود ادمین
            checkAdminLoginStatus();
        });

        // تنظیم event listeners
        function initializeEventListeners() {
            // منوی موبایل
            document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
            
            // اسکرول هدر
            window.addEventListener('scroll', stickyHeader);
            
            // دکمه ورود ادمین
            document.getElementById('adminLoginBtn').addEventListener('click', showAdminLoginModal);
            
            // فرم ورود ادمین
            document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
            
            // دکمه خروج ادمین
            document.getElementById('adminLogout').addEventListener('click', handleAdminLogout);
            
            // ناوبری داشبورد ادمین
            document.querySelectorAll('.admin-nav-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    switchAdminSection(this.getAttribute('data-section'));
                });
            });
            
            // مدیریت دورهها
            document.getElementById('addCourseBtn').addEventListener('click', showCourseForm);
            document.getElementById('cancelCourseEdit').addEventListener('click', hideCourseForm);
            document.getElementById('courseEditForm').addEventListener('submit', handleCourseSave);
            
            // مدیریت اعلانها
            document.getElementById('addAnnouncementBtn').addEventListener('click', showAnnouncementForm);
            document.getElementById('cancelAnnouncementEdit').addEventListener('click', hideAnnouncementForm);
            document.getElementById('announcementEditForm').addEventListener('submit', handleAnnouncementSave);
            
            // مدیریت گالری
            document.getElementById('addGalleryItemBtn').addEventListener('click', showGalleryForm);
            document.getElementById('uploadArea').addEventListener('click', triggerImageUpload);
            document.getElementById('uploadArea').addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    triggerImageUpload();
                }
            });
            document.getElementById('galleryImage').addEventListener('change', handleImagePreview);
            document.getElementById('galleryUploadForm').addEventListener('submit', handleGalleryUpload);
            
            // مدیریت ویدیوها
            document.getElementById('addVideoBtn').addEventListener('click', showVideoForm);
            document.getElementById('cancelVideoEdit').addEventListener('click', hideVideoForm);
            document.getElementById('videoEditForm').addEventListener('submit', handleVideoSave);
            
            // مدیریت منابع
            document.getElementById('addDownloadBtn').addEventListener('click', showDownloadForm);
            document.getElementById('cancelDownloadEdit').addEventListener('click', hideDownloadForm);
            document.getElementById('downloadEditForm').addEventListener('submit', handleDownloadSave);
            
            // مدیریت آزمونها
            document.getElementById('addQuizBtn').addEventListener('click', showQuizForm);
            document.getElementById('cancelQuizEdit').addEventListener('click', hideQuizForm);
            document.getElementById('quizEditForm').addEventListener('submit', handleQuizSave);
            
            // مدیریت انجمن
            document.getElementById('addCategoryBtn').addEventListener('click', showCategoryForm);
            document.getElementById('cancelCategoryEdit').addEventListener('click', hideCategoryForm);
            document.getElementById('categoryEditForm').addEventListener('submit', handleCategorySave);
            
            // تنظیمات عمومی
            document.getElementById('generalSettings').addEventListener('submit', handleGeneralSettingsSave);
            
            // پشتیبانگیری
            document.getElementById('backupData').addEventListener('click', backupData);
            document.getElementById('restoreData').addEventListener('click', restoreData);
            
            // مدیریت ادمینها
            document.getElementById('addAdminBtn').addEventListener('click', showAdminForm);
            document.getElementById('cancelAdminEdit').addEventListener('click', hideAdminForm);
            document.getElementById('adminEditForm').addEventListener('submit', handleAdminSave);
            
            // ثبت نام دورهها
            document.querySelectorAll('.register-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const courseId = this.getAttribute('data-course-id');
                    showRegistrationModal(courseId);
                });
            });
            
            // بستن مودالها
            document.querySelectorAll('.close-modal').forEach(btn => {
                btn.addEventListener('click', function() {
                    this.closest('.modal').style.display = 'none';
                });
            });
            
            // کلیک خارج از مودال برای بستن
            window.addEventListener('click', function(e) {
                if (e.target.classList.contains('modal')) {
                    e.target.style.display = 'none';
                }
            });
            
            // مدیریت کیبورد برای مودالها
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.style.display = 'none';
                    });
                }
            });
        }

        // لود تدریجی تصاویر
        function lazyLoadImages() {
            const lazyImages = document.querySelectorAll('.lazy-image');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }

        // هدر چسبنده
        function stickyHeader() {
            const header = document.getElementById('header');
            if (window.scrollY > 100) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        }

        // منوی موبایل
        function toggleMobileMenu() {
            const nav = document.querySelector('nav ul');
            nav.classList.toggle('show');
        }

        // بررسی وضعیت ورود ادمین
        function checkAdminLoginStatus() {
            const savedAdmin = localStorage.getItem('currentAdmin');
            if (savedAdmin) {
                currentAdmin = JSON.parse(savedAdmin);
                adminAuthenticated = true;
                document.getElementById('adminLoginBtn').style.display = 'none';
            }
        }

        // نمایش مودال ورود ادمین
        function showAdminLoginModal() {
            document.getElementById('adminLoginModal').style.display = 'flex';
            document.getElementById('adminEmail').focus();
        }

        // ورود ادمین
        function handleAdminLogin(e) {
            e.preventDefault();
            
            const email = sanitizeInput(document.getElementById('adminEmail').value);
            const password = sanitizeInput(document.getElementById('adminPassword').value);
            const messageEl = document.getElementById('adminLoginMessage');
            const submitBtn = e.target.querySelector('button[type="submit"]');
            
            setButtonLoading(submitBtn, true);
            
            try {
                const data = getData();
                const admin = data.admins.find(a => a.email === email && a.password === password);
                
                if (admin) {
                    currentAdmin = admin;
                    adminAuthenticated = true;
                    localStorage.setItem('currentAdmin', JSON.stringify(admin));
                    
                    document.getElementById('adminLoginModal').style.display = 'none';
                    document.getElementById('adminDashboard').style.display = 'block';
                    document.getElementById('adminLoginBtn').style.display = 'none';
                    
                    // بارگذاری دادههای داشبورد
                    updateStats();
                    loadCourses();
                    loadStudents();
                    loadRecentRegistrations();
                    loadAnnouncements();
                    loadGallery();
                    loadSections();
                    loadVideos();
                    loadDownloads();
                    loadQuizzes();
                    loadForumCategories();
                    
                    messageEl.textContent = '';
                    document.getElementById('adminLoginForm').reset();
                } else {
                    messageEl.textContent = 'ایمیل یا رمز عبور اشتباه است';
                }
            } catch (error) {
                console.error('خطا در ورود ادمین:', error);
                messageEl.textContent = 'خطا در سیستم، لطفاً دوباره تلاش کنید';
            } finally {
                setButtonLoading(submitBtn, false);
            }
        }

        // خروج ادمین
        function handleAdminLogout() {
            currentAdmin = null;
            adminAuthenticated = false;
            localStorage.removeItem('currentAdmin');
            
            document.getElementById('adminDashboard').style.display = 'none';
            document.getElementById('adminLoginBtn').style.display = 'block';
        }

        // تغییر بخش در داشبورد ادمین
        function switchAdminSection(sectionId) {
            // غیرفعال کردن تمام لینکها
            document.querySelectorAll('.admin-nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // فعال کردن لینک انتخاب شده
            document.querySelector(`.admin-nav-link[data-section="${sectionId}"]`).classList.add('active');
            
            // مخفی کردن تمام بخشها
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // نمایش بخش انتخاب شده
            document.getElementById(`${sectionId}-section`).classList.add('active');
        }

        // آپدیت آمار داشبورد
        function updateStats() {
            const data = getData();
            
            document.getElementById('totalCourses').textContent = data.courses.length;
            document.getElementById('totalStudents').textContent = data.students.length;
            document.getElementById('activeCourses').textContent = data.courses.filter(c => c.status === 'active').length;
            
            // ثبتنامهای امروز (نمونهسازی)
            const today = new Date().toLocaleDateString('fa-IR');
            const todayRegistrations = data.registrations.filter(r => r.date === today).length;
            document.getElementById('todayRegistrations').textContent = todayRegistrations;
        }

        // بارگذاری دورهها
        function loadCourses() {
            const data = getData();
            const tbody = document.getElementById('coursesList');
            
            tbody.innerHTML = '';
            
            data.courses.forEach(course => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sanitizeInput(course.name)}</td>
                    <td>${course.duration} ماه</td>
                    <td>${course.capacity}</td>
                    <td>${course.enrolled}</td>
                    <td>${course.status === 'active' ? 'فعال' : 'غیرفعال'}</td>
                    <td>
                        <button class="btn-edit" onclick="editCourse(${course.id})">ویرایش</button>
                        <button class="btn-delete" onclick="deleteCourse(${course.id})">حذف</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        // بارگذاری دانشجویان
        function loadStudents() {
            const data = getData();
            const tbody = document.getElementById('studentsList');
            
            tbody.innerHTML = '';
            
            data.students.forEach(student => {
                const courseNames = student.courses.map(courseId => {
                    const course = data.courses.find(c => c.id === courseId);
                    return course ? sanitizeInput(course.name) : 'دوره حذف شده';
                }).join(', ');
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sanitizeInput(student.name)}</td>
                    <td>${sanitizeInput(student.email)}</td>
                    <td>${courseNames}</td>
                    <td>${student.joinDate}</td>
                    <td>
                        <button class="btn-edit">ویرایش</button>
                        <button class="btn-delete">حذف</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        // بارگذاری ثبتنامهای اخیر
        function loadRecentRegistrations() {
            const data = getData();
            const tbody = document.getElementById('recentRegistrations');
            
            tbody.innerHTML = '';
            
            // نمایش 5 ثبتنام اخیر
            const recent = data.registrations.slice(-5).reverse();
            
            recent.forEach(reg => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sanitizeInput(reg.studentName)}</td>
                    <td>${sanitizeInput(reg.courseName)}</td>
                    <td>${reg.date}</td>
                    <td>${reg.status}</td>
                `;
                tbody.appendChild(row);
            });
        }

        // نمایش فرم دوره
        function showCourseForm() {
            document.getElementById('courseForm').style.display = 'block';
            document.getElementById('courseFormTitle').textContent = 'افزودن دوره جدید';
            document.getElementById('editCourseId').value = '';
            document.getElementById('courseEditForm').reset();
            document.getElementById('courseName').focus();
        }

        // مخفی کردن فرم دوره
        function hideCourseForm() {
            document.getElementById('courseForm').style.display = 'none';
        }

        // ویرایش دوره
        function editCourse(courseId) {
            const data = getData();
            const course = data.courses.find(c => c.id === courseId);
            
            if (course) {
                document.getElementById('courseForm').style.display = 'block';
                document.getElementById('courseFormTitle').textContent = 'ویرایش دوره';
                document.getElementById('editCourseId').value = course.id;
                document.getElementById('courseName').value = course.name;
                document.getElementById('courseDuration').value = course.duration;
                document.getElementById('courseCapacity').value = course.capacity;
                document.getElementById('courseStatus').value = course.status;
                document.getElementById('courseDescription').value = course.description || '';
                document.getElementById('courseName').focus();
            }
        }

        // ذخیره دوره
        function handleCourseSave(e) {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true);
            
            try {
                const data = getData();
                const courseId = document.getElementById('editCourseId').value;
                const courseData = {
                    name: sanitizeInput(document.getElementById('courseName').value),
                    duration: parseInt(document.getElementById('courseDuration').value),
                    capacity: parseInt(document.getElementById('courseCapacity').value),
                    status: document.getElementById('courseStatus').value,
                    description: sanitizeInput(document.getElementById('courseDescription').value)
                };
                
                if (courseId) {
                    // ویرایش دوره موجود
                    const index = data.courses.findIndex(c => c.id === parseInt(courseId));
                    if (index !== -1) {
                        data.courses[index] = { ...data.courses[index], ...courseData };
                    }
                } else {
                    // افزودن دوره جدید
                    const newId = data.courses.length > 0 ? Math.max(...data.courses.map(c => c.id)) + 1 : 1;
                    data.courses.push({
                        id: newId,
                        enrolled: 0,
                        ...courseData
                    });
                }
                
                saveData(data);
                loadCourses();
                hideCourseForm();
                updateStats();
            } catch (error) {
                console.error('خطا در ذخیره دوره:', error);
                alert('خطا در ذخیره دوره، لطفاً دوباره تلاش کنید');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        }

        // حذف دوره
        function deleteCourse(courseId) {
            if (confirm('آیا از حذف این دوره اطمینان دارید؟')) {
                try {
                    const data = getData();
                    data.courses = data.courses.filter(c => c.id !== courseId);
                    saveData(data);
                    loadCourses();
                    updateStats();
                } catch (error) {
                    console.error('خطا در حذف دوره:', error);
                    alert('خطا در حذف دوره، لطفاً دوباره تلاش کنید');
                }
            }
        }

        // بارگذاری اعلانها
        function loadAnnouncements() {
            const data = getData();
            const container = document.getElementById('announcementsList');
            
            container.innerHTML = '';
            
            data.announcements.forEach(announcement => {
                const item = document.createElement('div');
                item.className = 'announcement-item';
                item.innerHTML = `
                    <div class="announcement-header">
                        <div class="announcement-title">${sanitizeInput(announcement.title)}</div>
                        <div class="announcement-date">${announcement.date}</div>
                    </div>
                    <div class="announcement-content">${sanitizeInput(announcement.content)}</div>
                    <div style="margin-top: 10px;">
                        <button class="btn-edit" onclick="editAnnouncement(${announcement.id})">ویرایش</button>
                        <button class="btn-delete" onclick="deleteAnnouncement(${announcement.id})">حذف</button>
                    </div>
                `;
                container.appendChild(item);
            });
        }

        // نمایش فرم اعلان
        function showAnnouncementForm() {
            document.getElementById('announcementForm').style.display = 'block';
            document.getElementById('announcementFormTitle').textContent = 'افزودن اعلان جدید';
            document.getElementById('editAnnouncementId').value = '';
            document.getElementById('announcementEditForm').reset();
            document.getElementById('announcementTitle').focus();
        }

        // مخفی کردن فرم اعلان
        function hideAnnouncementForm() {
            document.getElementById('announcementForm').style.display = 'none';
        }

        // ویرایش اعلان
        function editAnnouncement(announcementId) {
            const data = getData();
            const announcement = data.announcements.find(a => a.id === announcementId);
            
            if (announcement) {
                document.getElementById('announcementForm').style.display = 'block';
                document.getElementById('announcementFormTitle').textContent = 'ویرایش اعلان';
                document.getElementById('editAnnouncementId').value = announcement.id;
                document.getElementById('announcementTitle').value = announcement.title;
                document.getElementById('announcementContent').value = announcement.content;
                document.getElementById('announcementPriority').value = announcement.priority;
                document.getElementById('announcementTitle').focus();
            }
        }

        // ذخیره اعلان
        function handleAnnouncementSave(e) {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true);
            
            try {
                const data = getData();
                const announcementId = document.getElementById('editAnnouncementId').value;
                const announcementData = {
                    title: sanitizeInput(document.getElementById('announcementTitle').value),
                    content: sanitizeInput(document.getElementById('announcementContent').value),
                    priority: document.getElementById('announcementPriority').value,
                    date: new Date().toLocaleDateString('fa-IR')
                };
                
                if (announcementId) {
                    // ویرایش اعلان موجود
                    const index = data.announcements.findIndex(a => a.id === parseInt(announcementId));
                    if (index !== -1) {
                        data.announcements[index] = { ...data.announcements[index], ...announcementData };
                    }
                } else {
                    // افزودن اعلان جدید
                    const newId = data.announcements.length > 0 ? Math.max(...data.announcements.map(a => a.id)) + 1 : 1;
                    data.announcements.push({
                        id: newId,
                        ...announcementData
                    });
                }
                
                saveData(data);
                loadAnnouncements();
                hideAnnouncementForm();
            } catch (error) {
                console.error('خطا در ذخیره اعلان:', error);
                alert('خطا در ذخیره اعلان، لطفاً دوباره تلاش کنید');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        }

        // حذف اعلان
        function deleteAnnouncement(announcementId) {
            if (confirm('آیا از حذف این اعلان اطمینان دارید؟')) {
                try {
                    const data = getData();
                    data.announcements = data.announcements.filter(a => a.id !== announcementId);
                    saveData(data);
                    loadAnnouncements();
                } catch (error) {
                    console.error('خطا در حذف اعلان:', error);
                    alert('خطا در حذف اعلان، لطفاً دوباره تلاش کنید');
                }
            }
        }

        // بارگذاری گالری
        function loadGallery() {
            const data = getData();
            const container = document.getElementById('galleryGrid');
            
            container.innerHTML = '';
            
            data.gallery.forEach(item => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <img src="${item.imageUrl}" alt="${sanitizeInput(item.title)}" class="gallery-image">
                    <div class="gallery-overlay">
                        <div>${sanitizeInput(item.title)}</div>
                        <div style="font-size: 0.8rem; margin-top: 5px;">${sanitizeInput(item.description)}</div>
                    </div>
                    <div class="gallery-controls">
                        <button class="gallery-btn delete" onclick="deleteGalleryItem(${item.id})" aria-label="حذف عکس">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                container.appendChild(galleryItem);
            });
        }

        // بارگذاری گالری در صفحه اصلی
        function loadMainGallery() {
            const data = getData();
            const container = document.getElementById('mainGallery');
            
            container.innerHTML = '';
            
            data.gallery.forEach(item => {
                const galleryCard = document.createElement('div');
                galleryCard.className = 'gallery-card';
                galleryCard.innerHTML = `
                    <img src="${item.imageUrl}" alt="${sanitizeInput(item.title)}" class="gallery-img">
                    <div class="gallery-info">
                        <h3 class="gallery-title">${sanitizeInput(item.title)}</h3>
                        <p class="gallery-desc">${sanitizeInput(item.description)}</p>
                    </div>
                `;
                container.appendChild(galleryCard);
            });
        }

        // نمایش فرم گالری
        function showGalleryForm() {
            document.getElementById('galleryUploadForm').style.display = 'block';
            document.getElementById('galleryUploadForm').scrollIntoView({ behavior: 'smooth' });
        }

        // فعال سازی آپلود عکس
        function triggerImageUpload() {
            document.getElementById('galleryImage').click();
        }

        // پیشنمایش عکس
        function handleImagePreview(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('imagePreview').src = e.target.result;
                    document.getElementById('imagePreview').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        }

        // آپلود عکس به گالری
        function handleGalleryUpload(e) {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true);
            
            try {
                const fileInput = document.getElementById('galleryImage');
                const title = sanitizeInput(document.getElementById('galleryTitle').value);
                const description = sanitizeInput(document.getElementById('galleryDescription').value);
                
                if (!fileInput.files[0] || !title) {
                    alert('لطفاً عکس و عنوان را وارد کنید');
                    return;
                }
                
                const file = fileInput.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const data = getData();
                    const newId = data.gallery.length > 0 ? Math.max(...data.gallery.map(g => g.id)) + 1 : 1;
                    
                    data.gallery.push({
                        id: newId,
                        title: title,
                        description: description,
                        imageUrl: e.target.result
                    });
                    
                    saveData(data);
                    loadGallery();
                    loadMainGallery();
                    
                    // ریست فرم
                    document.getElementById('galleryUploadForm').reset();
                    document.getElementById('imagePreview').style.display = 'none';
                    
                    alert('عکس با موفقیت به گالری اضافه شد');
                };
                
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('خطا در آپلود عکس:', error);
                alert('خطا در آپلود عکس، لطفاً دوباره تلاش کنید');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        }

        // حذف عکس از گالری
        function deleteGalleryItem(itemId) {
            if (confirm('آیا از حذف این عکس اطمینان دارید؟')) {
                try {
                    const data = getData();
                    data.gallery = data.gallery.filter(g => g.id !== itemId);
                    saveData(data);
                    loadGallery();
                    loadMainGallery();
                } catch (error) {
                    console.error('خطا در حذف عکس:', error);
                    alert('خطا در حذف عکس، لطفاً دوباره تلاش کنید');
                }
            }
        }

        // بارگذاری بخشها
        function loadSections() {
            const data = getData();
            const container = document.getElementById('sectionsList');
            
            container.innerHTML = '';
            
            // مرتبسازی بخشها بر اساس ترتیب
            const sortedSections = [...data.sections].sort((a, b) => a.order - b.order);
            
            sortedSections.forEach(section => {
                const sectionItem = document.createElement('div');
                sectionItem.className = 'section-item';
                sectionItem.innerHTML = `
                    <div class="section-header">
                        <div class="section-title">${section.title}</div>
                        <div class="section-controls">
                            <button class="btn-edit">ویرایش</button>
                            <button class="btn-delete">حذف</button>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="section-visibility">
                            <span>وضعیت نمایش:</span>
                            <label class="visibility-toggle">
                                <input type="checkbox" ${section.visible ? 'checked' : ''} onchange="toggleSectionVisibility('${section.id}', this.checked)">
                                <span>${section.visible ? 'فعال' : 'غیرفعال'}</span>
                            </label>
                        </div>
                        <div>
                            <span>ترتیب نمایش:</span>
                            <input type="number" value="${section.order}" min="1" max="20" onchange="updateSectionOrder('${section.id}', this.value)" style="width: 60px; margin-right: 10px;">
                        </div>
                    </div>
                `;
                container.appendChild(sectionItem);
            });
        }

        // تغییر وضعیت نمایش بخش
        function toggleSectionVisibility(sectionId, isVisible) {
            try {
                const data = getData();
                const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
                
                if (sectionIndex !== -1) {
                    data.sections[sectionIndex].visible = isVisible;
                    saveData(data);
                }
            } catch (error) {
                console.error('خطا در تغییر وضعیت بخش:', error);
            }
        }

        // بهروزرسانی ترتیب بخش
        function updateSectionOrder(sectionId, newOrder) {
            try {
                const data = getData();
                const sectionIndex = data.sections.findIndex(s => s.id === sectionId);
                
                if (sectionIndex !== -1) {
                    data.sections[sectionIndex].order = parseInt(newOrder);
                    saveData(data);
                    loadSections(); // بارگذاری مجدد برای مرتبسازی
                }
            } catch (error) {
                console.error('خطا در بهروزرسانی ترتیب بخش:', error);
            }
        }

        // بارگذاری ویدیوها
        function loadVideos() {
            const data = getData();
            const tbody = document.getElementById('videosList');
            
            tbody.innerHTML = '';
            
            data.videos.forEach(video => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sanitizeInput(video.title)}</td>
                    <td>${video.category}</td>
                    <td>${video.duration} دقیقه</td>
                    <td>${video.uploadDate}</td>
                    <td>
                        <button class="btn-edit" onclick="editVideo(${video.id})">ویرایش</button>
                        <button class="btn-delete" onclick="deleteVideo(${video.id})">حذف</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        // بارگذاری ویدیوها در صفحه اصلی
        function loadMainVideos() {
            const data = getData();
            const container = document.getElementById('mainVideos');
            
            container.innerHTML = '';
            
            data.videos.forEach(video => {
                const videoCard = document.createElement('div');
                videoCard.className = 'video-card';
                videoCard.innerHTML = `
                    <div style="position: relative;">
                        <img src="https://via.placeholder.com/400x200/1e3a5f/ffffff?text=ویدیو+آموزشی" alt="${sanitizeInput(video.title)}" class="video-thumbnail lazy-image">
                        <button class="video-play" aria-label="پخش ویدیو" onclick="playVideo('${video.url}')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                    <div class="video-content">
                        <h3 class="video-title">${sanitizeInput(video.title)}</h3>
                        <div class="video-meta">
                            <span><i class="fas fa-clock"></i> ${video.duration} دقیقه</span>
                            <span><i class="fas fa-tag"></i> ${video.category}</span>
                        </div>
                    </div>
                `;
                container.appendChild(videoCard);
            });
        }

        // پخش ویدیو
        function playVideo(url) {
            window.open(url, '_blank');
        }

        // نمایش فرم ویدیو
        function showVideoForm() {
            document.getElementById('videoForm').style.display = 'block';
            document.getElementById('videoFormTitle').textContent = 'افزودن ویدیو جدید';
            document.getElementById('editVideoId').value = '';
            document.getElementById('videoEditForm').reset();
            document.getElementById('videoTitle').focus();
        }

        // مخفی کردن فرم ویدیو
        function hideVideoForm() {
            document.getElementById('videoForm').style.display = 'none';
        }

        // ویرایش ویدیو
        function editVideo(videoId) {
            const data = getData();
            const video = data.videos.find(v => v.id === videoId);
            
            if (video) {
                document.getElementById('videoForm').style.display = 'block';
                document.getElementById('videoFormTitle').textContent = 'ویرایش ویدیو';
                document.getElementById('editVideoId').value = video.id;
                document.getElementById('videoTitle').value = video.title;
                document.getElementById('videoCategory').value = video.category;
                document.getElementById('videoDuration').value = video.duration;
                document.getElementById('videoUrl').value = video.url;
                document.getElementById('videoDescription').value = video.description || '';
                document.getElementById('videoTitle').focus();
            }
        }

        // ذخیره ویدیو
        function handleVideoSave(e) {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true);
            
            try {
                const data = getData();
                const videoId = document.getElementById('editVideoId').value;
                const videoData = {
                    title: sanitizeInput(document.getElementById('videoTitle').value),
                    category: document.getElementById('videoCategory').value,
                    duration: parseInt(document.getElementById('videoDuration').value),
                    url: sanitizeInput(document.getElementById('videoUrl').value),
                    description: sanitizeInput(document.getElementById('videoDescription').value),
                    uploadDate: new Date().toLocaleDateString('fa-IR')
                };
                
                if (videoId) {
                    // ویرایش ویدیو موجود
                    const index = data.videos.findIndex(v => v.id === parseInt(videoId));
                    if (index !== -1) {
                        data.videos[index] = { ...data.videos[index], ...videoData };
                    }
                } else {
                    // افزودن ویدیو جدید
                    const newId = data.videos.length > 0 ? Math.max(...data.videos.map(v => v.id)) + 1 : 1;
                    data.videos.push({
                        id: newId,
                        ...videoData
                    });
                }
                
                saveData(data);
                loadVideos();
                loadMainVideos();
                hideVideoForm();
            } catch (error) {
                console.error('خطا در ذخیره ویدیو:', error);
                alert('خطا در ذخیره ویدیو، لطفاً دوباره تلاش کنید');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        }

        // حذف ویدیو
        function deleteVideo(videoId) {
            if (confirm('آیا از حذف این ویدیو اطمینان دارید؟')) {
                try {
                    const data = getData();
                    data.videos = data.videos.filter(v => v.id !== videoId);
                    saveData(data);
                    loadVideos();
                    loadMainVideos();
                } catch (error) {
                    console.error('خطا در حذف ویدیو:', error);
                    alert('خطا در حذف ویدیو، لطفاً دوباره تلاش کنید');
                }
            }
        }

        // بارگذاری منابع
        function loadDownloads() {
            const data = getData();
            const tbody = document.getElementById('downloadsList');
            
            tbody.innerHTML = '';
            
            data.downloads.forEach(download => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sanitizeInput(download.title)}</td>
                    <td>${download.type}</td>
                    <td>${download.size} MB</td>
                    <td>${download.category}</td>
                    <td>${download.uploadDate}</td>
                    <td>
                        <button class="btn-edit" onclick="editDownload(${download.id})">ویرایش</button>
                        <button class="btn-delete" onclick="deleteDownload(${download.id})">حذف</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        // بارگذاری منابع در صفحه اصلی
        function loadMainDownloads() {
            const data = getData();
            const container = document.getElementById('mainDownloads');
            
            container.innerHTML = '';
            
            data.downloads.forEach(download => {
                const downloadCard = document.createElement('div');
                downloadCard.className = 'download-card';
                downloadCard.innerHTML = `
                    <div class="download-icon">
                        <i class="fas fa-file-${getFileIcon(download.type)}"></i>
                    </div>
                    <h3 class="download-title">${sanitizeInput(download.title)}</h3>
                    <p class="download-size">${download.type} - ${download.size} MB</p>
                    <a href="${download.url}" class="btn">دانلود</a>
                `;
                container.appendChild(downloadCard);
            });
        }

        // دریافت آیکون فایل بر اساس نوع
        function getFileIcon(fileType) {
            switch(fileType) {
                case 'PDF': return 'pdf';
                case 'DOCX': return 'word';
                case 'PPTX': return 'powerpoint';
                case 'MP3': return 'audio';
                case 'ZIP': return 'archive';
                default: return 'file';
            }
        }

        // نمایش فرم منبع
        function showDownloadForm() {
            document.getElementById('downloadForm').style.display = 'block';
            document.getElementById('downloadFormTitle').textContent = 'افزودن منبع جدید';
            document.getElementById('editDownloadId').value = '';
            document.getElementById('downloadEditForm').reset();
            document.getElementById('downloadTitle').focus();
        }

        // مخفی کردن فرم منبع
        function hideDownloadForm() {
            document.getElementById('downloadForm').style.display = 'none';
        }

        // ویرایش منبع
        function editDownload(downloadId) {
            const data = getData();
            const download = data.downloads.find(d => d.id === downloadId);
            
            if (download) {
                document.getElementById('downloadForm').style.display = 'block';
                document.getElementById('downloadFormTitle').textContent = 'ویرایش منبع';
                document.getElementById('editDownloadId').value = download.id;
                document.getElementById('downloadTitle').value = download.title;
                document.getElementById('downloadType').value = download.type;
                document.getElementById('downloadSize').value = download.size;
                document.getElementById('downloadCategory').value = download.category;
                document.getElementById('downloadUrl').value = download.url;
                document.getElementById('downloadDescription').value = download.description || '';
                document.getElementById('downloadTitle').focus();
            }
        }

        // ذخیره منبع
        function handleDownloadSave(e) {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true);
            
            try {
                const data = getData();
                const downloadId = document.getElementById('editDownloadId').value;
                const downloadData = {
                    title: sanitizeInput(document.getElementById('downloadTitle').value),
                    type: document.getElementById('downloadType').value,
                    size: parseFloat(document.getElementById('downloadSize').value),
                    category: document.getElementById('downloadCategory').value,
                    url: sanitizeInput(document.getElementById('downloadUrl').value),
                    description: sanitizeInput(document.getElementById('downloadDescription').value),
                    uploadDate: new Date().toLocaleDateString('fa-IR')
                };
                
                if (downloadId) {
                    // ویرایش منبع موجود
                    const index = data.downloads.findIndex(d => d.id === parseInt(downloadId));
                    if (index !== -1) {
                        data.downloads[index] = { ...data.downloads[index], ...downloadData };
                    }
                } else {
                    // افزودن منبع جدید
                    const newId = data.downloads.length > 0 ? Math.max(...data.downloads.map(d => d.id)) + 1 : 1;
                    data.downloads.push({
                        id: newId,
                        ...downloadData
                    });
                }
                
                saveData(data);
                loadDownloads();
                loadMainDownloads();
                hideDownloadForm();
            } catch (error) {
                console.error('خطا در ذخیره منبع:', error);
                alert('خطا در ذخیره منبع، لطفاً دوباره تلاش کنید');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        }

        // حذف منبع
        function deleteDownload(downloadId) {
            if (confirm('آیا از حذف این منبع اطمینان دارید؟')) {
                try {
                    const data = getData();
                    data.downloads = data.downloads.filter(d => d.id !== downloadId);
                    saveData(data);
                    loadDownloads();
                    loadMainDownloads();
                } catch (error) {
                    console.error('خطا در حذف منبع:', error);
                    alert('خطا در حذف منبع، لطفاً دوباره تلاش کنید');
                }
            }
        }

        // بارگذاری آزمونها
        function loadQuizzes() {
            const data = getData();
            const tbody = document.getElementById('quizzesList');
            
            tbody.innerHTML = '';
            
            data.quizzes.forEach(quiz => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sanitizeInput(quiz.title)}</td>
                    <td>${quiz.course}</td>
                    <td>${quiz.questions}</td>
                    <td>${quiz.duration}</td>
                    <td>${quiz.status === 'active' ? 'فعال' : 'غیرفعال'}</td>
                    <td>
                        <button class="btn-edit" onclick="editQuiz(${quiz.id})">ویرایش</button>
                        <button class="btn-delete" onclick="deleteQuiz(${quiz.id})">حذف</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        // نمایش فرم آزمون
        function showQuizForm() {
            document.getElementById('quizForm').style.display = 'block';
            document.getElementById('quizFormTitle').textContent = 'افزودن آزمون جدید';
            document.getElementById('editQuizId').value = '';
            document.getElementById('quizEditForm').reset();
            document.getElementById('quizTitle').focus();
        }

        // مخفی کردن فرم آزمون
        function hideQuizForm() {
            document.getElementById('quizForm').style.display = 'none';
        }

        // ویرایش آزمون
     // ادامه تابع editQuiz
function editQuiz(quizId) {
    const data = getData();
    const quiz = data.quizzes.find(q => q.id === quizId);
    
    if (quiz) {
        document.getElementById('quizForm').style.display = 'block';
        document.getElementById('quizFormTitle').textContent = 'ویرایش آزمون';
        document.getElementById('editQuizId').value = quiz.id;
        document.getElementById('quizTitle').value = quiz.title;
        document.getElementById('quizCourse').value = quiz.course;
        document.getElementById('quizQuestions').value = quiz.questions;
        document.getElementById('quizDuration').value = quiz.duration;
        document.getElementById('quizDescription').value = quiz.description || '';
        document.getElementById('quizTitle').focus();
    }
}

// ذخیره آزمون
function handleQuizSave(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);
    
    try {
        const data = getData();
        const quizId = document.getElementById('editQuizId').value;
        const quizData = {
            title: sanitizeInput(document.getElementById('quizTitle').value),
            course: document.getElementById('quizCourse').value,
            questions: parseInt(document.getElementById('quizQuestions').value),
            duration: parseInt(document.getElementById('quizDuration').value),
            description: sanitizeInput(document.getElementById('quizDescription').value),
            status: 'active'
        };
        
        if (quizId) {
            // ویرایش آزمون موجود
            const index = data.quizzes.findIndex(q => q.id === parseInt(quizId));
            if (index !== -1) {
                data.quizzes[index] = { ...data.quizzes[index], ...quizData };
            }
        } else {
            // افزودن آزمون جدید
            const newId = data.quizzes.length > 0 ? Math.max(...data.quizzes.map(q => q.id)) + 1 : 1;
            data.quizzes.push({
                id: newId,
                ...quizData
            });
        }
        
        saveData(data);
        loadQuizzes();
        hideQuizForm();
    } catch (error) {
        console.error('خطا در ذخیره آزمون:', error);
        alert('خطا در ذخیره آزمون، لطفاً دوباره تلاش کنید');
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

// حذف آزمون
function deleteQuiz(quizId) {
    if (confirm('آیا از حذف این آزمون اطمینان دارید؟')) {
        try {
            const data = getData();
            data.quizzes = data.quizzes.filter(q => q.id !== quizId);
            saveData(data);
            loadQuizzes();
        } catch (error) {
            console.error('خطا در حذف آزمون:', error);
            alert('خطا در حذف آزمون، لطفاً دوباره تلاش کنید');
        }
    }
}

// بارگذاری دستهبندیهای انجمن
function loadForumCategories() {
    const data = getData();
    const tbody = document.getElementById('forumCategoriesList');
    
    tbody.innerHTML = '';
    
    data.forumCategories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sanitizeInput(category.name)}</td>
            <td>${sanitizeInput(category.description)}</td>
            <td>${category.topics}</td>
            <td>${category.replies}</td>
            <td>
                <button class="btn-edit" onclick="editCategory(${category.id})">ویرایش</button>
                <button class="btn-delete" onclick="deleteCategory(${category.id})">حذف</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// بارگذاری انجمن در صفحه اصلی
function loadMainForum() {
    const data = getData();
    const container = document.getElementById('mainForum');
    
    container.innerHTML = '';
    
    data.forumCategories.forEach(category => {
        const forumCategory = document.createElement('div');
        forumCategory.className = 'forum-category';
        forumCategory.innerHTML = `
            <h3>${sanitizeInput(category.name)}</h3>
            <p>${sanitizeInput(category.description)}</p>
            <div class="forum-stats">
                <span>${category.topics} موضوع</span>
                <span>${category.replies} پاسخ</span>
            </div>
        `;
        container.appendChild(forumCategory);
    });
}

// نمایش فرم دستهبندی
function showCategoryForm() {
    document.getElementById('categoryForm').style.display = 'block';
    document.getElementById('categoryFormTitle').textContent = 'افزودن دستهبندی جدید';
    document.getElementById('editCategoryId').value = '';
    document.getElementById('categoryEditForm').reset();
    document.getElementById('categoryName').focus();
}

// مخفی کردن فرم دستهبندی
function hideCategoryForm() {
    document.getElementById('categoryForm').style.display = 'none';
}

// ویرایش دستهبندی
function editCategory(categoryId) {
    const data = getData();
    const category = data.forumCategories.find(c => c.id === categoryId);
    
    if (category) {
        document.getElementById('categoryForm').style.display = 'block';
        document.getElementById('categoryFormTitle').textContent = 'ویرایش دستهبندی';
        document.getElementById('editCategoryId').value = category.id;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryDescription').value = category.description;
        document.getElementById('categoryName').focus();
    }
}

// ذخیره دستهبندی
function handleCategorySave(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);
    
    try {
        const data = getData();
        const categoryId = document.getElementById('editCategoryId').value;
        const categoryData = {
            name: sanitizeInput(document.getElementById('categoryName').value),
            description: sanitizeInput(document.getElementById('categoryDescription').value)
        };
        
        if (categoryId) {
            // ویرایش دستهبندی موجود
            const index = data.forumCategories.findIndex(c => c.id === parseInt(categoryId));
            if (index !== -1) {
                data.forumCategories[index] = { 
                    ...data.forumCategories[index], 
                    ...categoryData 
                };
            }
        } else {
            // افزودن دستهبندی جدید
            const newId = data.forumCategories.length > 0 ? Math.max(...data.forumCategories.map(c => c.id)) + 1 : 1;
            data.forumCategories.push({
                id: newId,
                topics: 0,
                replies: 0,
                ...categoryData
            });
        }
        
        saveData(data);
        loadForumCategories();
        loadMainForum();
        hideCategoryForm();
    } catch (error) {
        console.error('خطا در ذخیره دستهبندی:', error);
        alert('خطا در ذخیره دستهبندی، لطفاً دوباره تلاش کنید');
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

// حذف دستهبندی
function deleteCategory(categoryId) {
    if (confirm('آیا از حذف این دستهبندی اطمینان دارید؟')) {
        try {
            const data = getData();
            data.forumCategories = data.forumCategories.filter(c => c.id !== categoryId);
            saveData(data);
            loadForumCategories();
            loadMainForum();
        } catch (error) {
            console.error('خطا در حذف دستهبندی:', error);
            alert('خطا در حذف دستهبندی، لطفاً دوباره تلاش کنید');
        }
    }
}

// مدیریت ادمینها
function loadAdmins() {
    const data = getData();
    const tbody = document.getElementById('adminsList');
    
    tbody.innerHTML = '';
    
    data.admins.forEach(admin => {
        // عدم نمایش رمز عبور
        const adminCopy = {...admin, password: '••••••••'};
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sanitizeInput(adminCopy.name)}</td>
            <td>${sanitizeInput(adminCopy.email)}</td>
            <td>${adminCopy.role === 'super' ? 'سوپر ادمین' : 'ادمین'}</td>
            <td>${adminCopy.joinDate || '1403/01/01'}</td>
            <td>
                <button class="btn-edit" onclick="editAdmin(${adminCopy.id})">ویرایش</button>
                ${adminCopy.id !== 1 ? `<button class="btn-delete" onclick="deleteAdmin(${adminCopy.id})">حذف</button>` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// نمایش فرم ادمین
function showAdminForm() {
    document.getElementById('adminForm').style.display = 'block';
    document.getElementById('adminFormTitle').textContent = 'افزودن ادمین جدید';
    document.getElementById('editAdminId').value = '';
    document.getElementById('adminEditForm').reset();
    document.getElementById('adminName').focus();
}

// مخفی کردن فرم ادمین
function hideAdminForm() {
    document.getElementById('adminForm').style.display = 'none';
}

// ویرایش ادمین
function editAdmin(adminId) {
    const data = getData();
    const admin = data.admins.find(a => a.id === adminId);
    
    if (admin) {
        document.getElementById('adminForm').style.display = 'block';
        document.getElementById('adminFormTitle').textContent = 'ویرایش ادمین';
        document.getElementById('editAdminId').value = admin.id;
        document.getElementById('adminName').value = admin.name;
        document.getElementById('adminEmail').value = admin.email;
        document.getElementById('adminRole').value = admin.role;
        document.getElementById('adminPassword').value = ''; // عدم نمایش رمز عبور
        document.getElementById('adminPassword').required = false;
        document.getElementById('adminName').focus();
    }
}

// ذخیره ادمین
function handleAdminSave(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);
    
    try {
        const data = getData();
        const adminId = document.getElementById('editAdminId').value;
        const adminData = {
            name: sanitizeInput(document.getElementById('adminName').value),
            email: sanitizeInput(document.getElementById('adminEmail').value),
            role: document.getElementById('adminRole').value
        };
        
        // اگر رمز عبور وارد شده باشد
        const password = document.getElementById('adminPassword').value;
        if (password) {
            adminData.password = password;
        }
        
        if (adminId) {
            // ویرایش ادمین موجود
            const index = data.admins.findIndex(a => a.id === parseInt(adminId));
            if (index !== -1) {
                // اگر رمز عبور جدید وارد نشده، رمز قبلی را حفظ کن
                if (!password) {
                    adminData.password = data.admins[index].password;
                }
                data.admins[index] = { ...data.admins[index], ...adminData };
            }
        } else {
            // افزودن ادمین جدید
            if (!password) {
                alert('لطفاً رمز عبور را وارد کنید');
                return;
            }
            
            const newId = data.admins.length > 0 ? Math.max(...data.admins.map(a => a.id)) + 1 : 1;
            data.admins.push({
                id: newId,
                joinDate: new Date().toLocaleDateString('fa-IR'),
                ...adminData
            });
        }
        
        saveData(data);
        loadAdmins();
        hideAdminForm();
    } catch (error) {
        console.error('خطا در ذخیره ادمین:', error);
        alert('خطا در ذخیره ادمین، لطفاً دوباره تلاش کنید');
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

// حذف ادمین
function deleteAdmin(adminId) {
    if (adminId === 1) {
        alert('امکان حذف سوپر ادمین اصلی وجود ندارد');
        return;
    }
    
    if (confirm('آیا از حذف این ادمین اطمینان دارید؟')) {
        try {
            const data = getData();
            data.admins = data.admins.filter(a => a.id !== adminId);
            saveData(data);
            loadAdmins();
        } catch (error) {
            console.error('خطا در حذف ادمین:', error);
            alert('خطا در حذف ادمین، لطفاً دوباره تلاش کنید');
        }
    }
}

// ذخیره تنظیمات عمومی
function handleGeneralSettingsSave(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);
    
    try {
        const data = getData();
        
        data.siteSettings = {
            title: sanitizeInput(document.getElementById('siteTitle').value),
            description: sanitizeInput(document.getElementById('siteDescription').value),
            contactPhone: sanitizeInput(document.getElementById('contactPhone').value),
            contactEmail: sanitizeInput(document.getElementById('contactEmail').value)
        };
        
        saveData(data);
        
        // بهروزرسانی عنوان صفحه
        document.title = data.siteSettings.title;
        
        alert('تنظیمات با موفقیت ذخیره شد');
    } catch (error) {
        console.error('خطا در ذخیره تنظیمات:', error);
        alert('خطا در ذخیره تنظیمات، لطفاً دوباره تلاش کنید');
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

// پشتیبانگیری از دادهها
function backupData() {
    try {
        const data = getData();
        const backup = {
            ...data,
            backupDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `academy-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('پشتیبانگیری با موفقیت انجام شد');
    } catch (error) {
        console.error('خطا در پشتیبانگیری:', error);
        alert('خطا در پشتیبانگیری، لطفاً دوباره تلاش کنید');
    }
}

// بازیابی دادهها
function restoreData() {
    const fileInput = document.getElementById('backupFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('لطفاً یک فایل پشتیبان انتخاب کنید');
        return;
    }
    
    if (!confirm('آیا از بازیابی دادهها اطمینان دارید؟ تمام دادههای فعلی جایگزین خواهند شد.')) {
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            
            // اعتبارسنجی ساختار دادهها
            if (!backupData.courses || !backupData.students) {
                throw new Error('فایل پشتیبان معتبر نیست');
            }
            
            saveData(backupData);
            
            // بارگذاری مجدد تمام دادهها
            updateStats();
            loadCourses();
            loadStudents();
            loadRecentRegistrations();
            loadAnnouncements();
            loadGallery();
            loadSections();
            loadVideos();
            loadDownloads();
            loadQuizzes();
            loadForumCategories();
            loadAdmins();
            
            // بارگذاری مجدد صفحه اصلی
            loadMainGallery();
            loadMainVideos();
            loadMainDownloads();
            loadMainForum();
            
            alert('دادهها با موفقیت بازیابی شدند');
            fileInput.value = '';
        } catch (error) {
            console.error('خطا در بازیابی دادهها:', error);
            alert('خطا در بازیابی دادهها. فایل پشتیبان معتبر نیست.');
        }
    };
    
    reader.readAsText(file);
}

// تنظیم اسلایدر اعلانها
function setupAnnouncementSlider() {
    const slides = document.querySelectorAll('.announcement-slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // کلیک روی داتها
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // اسلایدر خودکار
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

// توابع مربوط به مودال ثبتنام
function openModal(courseName, courseId) {
    document.getElementById('modal-course-title').textContent = `ثبتنام در ${courseName}`;
    document.getElementById('course-id').value = courseId;
    document.getElementById('registration-modal').style.display = 'flex';
    document.getElementById('student-name').focus();
}

function closeModal() {
    document.getElementById('registration-modal').style.display = 'none';
    document.getElementById('registration-form').reset();
    document.getElementById('success-message').style.display = 'none';
}

// مدیریت ثبتنام در دورهها
document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const courseId = document.getElementById('course-id').value;
    const studentName = sanitizeInput(document.getElementById('student-name').value);
    const studentEmail = sanitizeInput(document.getElementById('student-email').value);
    
    setButtonLoading(submitBtn, true);
    
    // شبیهسازی ثبتنام (در حالت واقعی باید به سرور ارسال شود)
    setTimeout(() => {
        try {
            const data = getData();
            
            // افزودن به لیست ثبتنامها
            const newRegId = data.registrations.length > 0 ? Math.max(...data.registrations.map(r => r.id)) + 1 : 1;
            data.registrations.push({
                id: newRegId,
                studentName: studentName,
                email: studentEmail,
                courseName: document.getElementById('modal-course-title').textContent.replace('ثبتنام در ', ''),
                date: new Date().toLocaleDateString('fa-IR'),
                status: 'تکمیل شده'
            });
            
            saveData(data);
            
            // نمایش پیام موفقیت
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('registration-form').reset();
            
            // بهروزرسانی آمار
            updateStats();
            loadRecentRegistrations();
            
        } catch (error) {
            console.error('خطا در ثبتنام:', error);
            alert('خطا در ثبتنام، لطفاً دوباره تلاش کنید');
        } finally {
            setButtonLoading(submitBtn, false);
        }
    }, 1500);
});

// مقداردهی اولیه زمانی که DOM لود شد
document.addEventListener('DOMContentLoaded', function() {
    // بارگذاری تنظیمات سایت
    const data = getData();
    if (data.siteSettings) {
        document.getElementById('siteTitle').value = data.siteSettings.title;
        document.getElementById('siteDescription').value = data.siteSettings.description;
        document.getElementById('contactPhone').value = data.siteSettings.contactPhone;
        document.getElementById('contactEmail').value = data.siteSettings.contactEmail;
    }
    
    // بارگذاری ادمینها
    loadAdmins();
});

// تابع کمکی برای نمایش تاریخ شمسی
function toPersianDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        calendar: 'persian',
        numberingSystem: 'arab'
    };
    return new Date(date).toLocaleDateString('fa-IR', options);
}

// بهبود عملکرد جستجو
document.querySelector('.search-input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 2) {
        // اجرای جستجو
        performSearch(searchTerm);
    }
});

function performSearch(term) {
    // در حالت واقعی این تابع باید با سرور ارتباط برقرار کند
    console.log('جستجو برای:', term);
    // اینجا میتوانید نتایج جستجو را نمایش دهید
}

// بهبود UX برای موبایل
function checkTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

if (checkTouchDevice()) {
    document.body.classList.add('touch-device');
}

// مدیریت خطاهای جهانی
window.addEventListener('error', function(e) {
    console.error('خطای جهانی:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise رد شده:', e.reason);
});
