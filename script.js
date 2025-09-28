// متغیرهای جهانی
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
                { id: 2, title: "دوره خبرنگاری", description: "تصویری از دوره خبرنگاری حرفهای", imageUrl: "https://via.placeholder.com/300x200/0a1930/ffffff?text=دوره+خبرنگاری" }
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
                { id: "blog", title: "مقالات و وبلاگ", visible: true, order: 3 },
                { id: "videos", title: "ویدیوهای آموزشی", visible: true, order: 4 },
                { id: "downloads", title: "منابع قابل دانلود", visible: true, order: 5 },
                { id: "forum", title: "انجمن گفتگو", visible: true, order: 6 },
                { id: "instructors", title: "اساتید", visible: true, order: 7 },
                { id: "students", title: "شاگردان ممتاز", visible: true, order: 8 },
                { id: "registration", title: "ثبت نام", visible: true, order: 9 },
                { id: "dashboard", title: "داشبورد", visible: true, order: 10 }
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

        // اعتبارسنجی ورودی‌ها
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
            setupAnnouncementSlider();
            lazyLoadImages();
            
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
            document.getElementById('uploadArea').addEventListener('click', triggerImageUpload);
            document.getElementById('uploadArea').addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    triggerImageUpload();
                }
            });
            document.getElementById('galleryImage').addEventListener('change', handleImagePreview);
            document.getElementById('galleryUploadForm').addEventListener('submit', handleGalleryUpload);
            
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
                console.error('خطا در به‌روزرسانی ترتیب بخش:', error);
            }
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
                    password: sanitizeInput(document.getElementById('adminPassword').value),
                    role: document.getElementById('adminRole').value
                };
                
                if (adminId) {
                    // ویرایش ادمین موجود
                    const index = data.admins.findIndex(a => a.id === parseInt(adminId));
                    if (index !== -1) {
                        data.admins[index] = { ...data.admins[index], ...adminData };
                    }
                } else {
                    // افزودن ادمین جدید
                    const newId = data.admins.length > 0 ? Math.max(...data.admins.map(a => a.id)) + 1 : 1;
                    data.admins.push({
                        id: newId,
                        ...adminData
                    });
                }
                
                saveData(data);
                hideAdminForm();
                
                // بارگذاری مجدد لیست ادمینها
                const tbody = document.getElementById('adminsList');
                tbody.innerHTML = '';
                
                data.admins.forEach(admin => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${sanitizeInput(admin.name)}</td>
                        <td>${sanitizeInput(admin.email)}</td>
                        <td>${admin.role === 'super' ? 'سوپر ادمین' : 'ادمین'}</td>
                        <td>${new Date().toLocaleDateString('fa-IR')}</td>
                        <td>
                            <button class="btn-edit" onclick="editAdmin(${admin.id})">ویرایش</button>
                            <button class="btn-delete" onclick="deleteAdmin(${admin.id})">حذف</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (error) {
                console.error('خطا در ذخیره ادمین:', error);
                alert('خطا در ذخیره ادمین، لطفاً دوباره تلاش کنید');
            } finally {
                setButtonLoading(submitBtn, false);
            }
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
                document.getElementById('adminPassword').value = admin.password;
                document.getElementById('adminRole').value = admin.role;
                document.getElementById('adminName').focus();
            }
        }

        // حذف ادمین
        function deleteAdmin(adminId) {
            if (confirm('آیا از حذف این ادمین اطمینان دارید؟')) {
                try {
                    const data = getData();
                    
                    // جلوگیری از حذف آخرین ادمین
                    if (data.admins.length <= 1) {
                        alert('حداقل باید یک ادمین در سیستم وجود داشته باشد');
                        return;
                    }
                    
                    data.admins = data.admins.filter(a => a.id !== adminId);
                    saveData(data);
                    
                    // بارگذاری مجدد لیست ادمینها
                    const tbody = document.getElementById('adminsList');
                    tbody.innerHTML = '';
                    
                    data.admins.forEach(admin => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${sanitizeInput(admin.name)}</td>
                            <td>${sanitizeInput(admin.email)}</td>
                            <td>${admin.role === 'super' ? 'سوپر ادمین' : 'ادمین'}</td>
                            <td>${new Date().toLocaleDateString('fa-IR')}</td>
                            <td>
                                <button class="btn-edit" onclick="editAdmin(${admin.id})">ویرایش</button>
                                <button class="btn-delete" onclick="deleteAdmin(${admin.id})">حذف</button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
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
                const dataStr = JSON.stringify(data);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                
                const url = URL.createObjectURL(dataBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `academy-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
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
            
            if (!fileInput.files[0]) {
                alert('لطفاً یک فایل پشتیبان انتخاب کنید');
                return;
            }
            
            if (!confirm('آیا از بازیابی دادهها اطمینان دارید؟ تمام دادههای فعلی جایگزین خواهند شد.')) {
                return;
            }
            
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const backupData = JSON.parse(e.target.result);
                    localStorage.setItem('academyData', JSON.stringify(backupData));
                    
                    // بارگذاری مجدد دادهها
                    updateStats();
                    loadCourses();
                    loadStudents();
                    loadRecentRegistrations();
                    loadAnnouncements();
                    loadGallery();
                    loadSections();
                    
                    alert('دادهها با موفقیت بازیابی شدند');
                } catch (error) {
                    console.error('خطا در بازیابی دادهها:', error);
                    alert('خطا در بازیابی دادهها: فایل نامعتبر است');
                }
            };
            
            reader.readAsText(file);
        }

        // نمایش مودال ثبت نام
        function openModal(courseName, courseId) {
            const modal = document.getElementById('registration-modal');
            const courseTitle = document.getElementById('modal-course-title');
            const courseIdInput = document.getElementById('course-id');
            
            courseTitle.textContent = `ثبت‌نام در ${courseName}`;
            courseIdInput.value = courseId;
            modal.style.display = 'flex';
            document.getElementById('student-name').focus();
        }

        // بستن مودال
        function closeModal() {
            document.getElementById('registration-modal').style.display = 'none';
        }

        // نمایش مودال ثبت نام
        function showRegistrationModal(courseId) {
            const data = getData();
            const course = data.courses.find(c => c.id === parseInt(courseId));
            
            if (!course) {
                alert('دوره مورد نظر یافت نشد');
                return;
            }
            
            if (course.enrolled >= course.capacity) {
                alert('ظرفیت این دوره تکمیل شده است');
                return;
            }
            
            openModal(course.name, courseId);
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
            
            // افزودن event listener به دکمهها
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => showSlide(index));
            });
            
            // تغییر خودکار اسلاید هر 5 ثانیه
            setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000);
            
            // نمایش اولین اسلاید
            showSlide(0);
        }

        // تابع کمکی برای تولید شناسه یکتا
        function generateId(items) {
            return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
        }
