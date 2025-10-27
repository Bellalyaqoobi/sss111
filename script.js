// سیستم مدیریت چندین فروشگاه - کد کامل و اصلاح شده
(function() {
    'use strict';
    
    // تنظیمات سیستم
    const SYSTEM_CONFIG = {
        adminPhone: '0796304080',
        telegramBotToken: '8207227177:AAEp7JifbIQUCWYscaOxokpvdvTxat7EbQ8',
        telegramChatId: '8106254967',
        version: '1.0.0'
    };
    
    // مدیریت وضعیت سیستم
    const SystemState = {
        currentUser: null,
        isAdmin: false,
        users: [],
        pendingApprovals: [],
        adminCredentials: { email: 'admin@example.com', password: 'admin123' },
        
        init() {
            this.loadFromStorage();
            this.setupEventListeners();
            this.showAppropriatePage();
            
            // تست داده‌های ذخیره شده
            console.log('کاربران:', this.users);
            console.log('در انتظار تأیید:', this.pendingApprovals);
        },
        
        loadFromStorage() {
            try {
                // استفاده از localStorage برای ماندگاری داده‌ها
                const savedUsers = localStorage.getItem('store_users');
                const savedPending = localStorage.getItem('pending_approvals');
                const savedCurrent = localStorage.getItem('current_user');
                
                this.users = savedUsers ? JSON.parse(savedUsers) : [];
                this.pendingApprovals = savedPending ? JSON.parse(savedPending) : [];
                this.currentUser = savedCurrent ? JSON.parse(savedCurrent) : null;
                
                // ایجاد کاربر پیش‌فرض اگر هیچ کاربری وجود ندارد
                if (this.users.length === 0 && this.pendingApprovals.length === 0) {
                    this.createDefaultUser();
                }
            } catch (error) {
                console.error('خطا در بارگذاری داده‌ها:', error);
                this.users = [];
                this.pendingApprovals = [];
                this.createDefaultUser();
            }
        },
        
        createDefaultUser() {
            const defaultUser = {
                id: 1,
                storeName: "فروشگاه نمونه",
                ownerName: "مدیر نمونه",
                email: "store@example.com",
                password: "123456",
                approved: true,
                telegramBotToken: "",
                telegramChatId: "",
                createdAt: new Date().toISOString(),
                products: [
                    { id: 1, name: "گوشی موبایل سامسونگ", category: "1", price: 8500000, parent: null, description: "گوشی موبایل سری سامسونگ", isSold: false },
                    { id: 2, name: "مدل Galaxy S21", category: "1", price: 10200000, parent: 1, description: "گوشی پرچمدار سری گلکسی", isSold: false },
                    { id: 3, name: "مدل Galaxy A52", category: "1", price: 6800000, parent: 1, description: "گوشی میانرده سری A", isSold: false }
                ],
                categories: [
                    { id: 1, name: "الکترونیک", parent: null, productCount: 3 },
                    { id: 2, name: "موبایل و تبلت", parent: 1, productCount: 3 }
                ],
                soldItems: []
            };
            
            this.users.push(defaultUser);
            this.saveToStorage();
        },
        
        saveToStorage() {
            try {
                localStorage.setItem('store_users', JSON.stringify(this.users));
                localStorage.setItem('pending_approvals', JSON.stringify(this.pendingApprovals));
                if (this.currentUser) {
                    localStorage.setItem('current_user', JSON.stringify(this.currentUser));
                } else {
                    localStorage.removeItem('current_user');
                }
                
                // لاگ برای دیباگ
                console.log('داده‌ها ذخیره شدند:', {
                    users: this.users.length,
                    pending: this.pendingApprovals.length,
                    current: this.currentUser ? 'دارد' : 'ندارد'
                });
            } catch (error) {
                console.error('خطا در ذخیره داده‌ها:', error);
                this.showNotification('خطا در ذخیره داده‌ها', 'error');
            }
        },
        
        setupEventListeners() {
            // مدیریت تب‌های ورود
            document.getElementById('userLoginTab').addEventListener('click', () => this.switchLoginTab('user'));
            document.getElementById('adminLoginTab').addEventListener('click', () => this.switchLoginTab('admin'));
            
            // فرم‌های ورود
            document.getElementById('userLoginForm').addEventListener('submit', (e) => this.handleUserLogin(e));
            document.getElementById('adminLoginForm').addEventListener('submit', (e) => this.handleAdminLogin(e));
            
            // فرم ثبت‌نام
            document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
            
            // دکمه‌های ناوبری
            document.getElementById('showRegisterForm').addEventListener('click', () => this.showRegisterPage());
            document.getElementById('backToLogin').addEventListener('click', () => this.showLoginPage());
            
            // دکمه‌های خروج
            document.getElementById('userLogout').addEventListener('click', () => this.logout());
            document.getElementById('adminLogout').addEventListener('click', () => this.logout());
            
            // فرم‌های مدیریت محصولات و دسته‌بندی‌ها
            document.getElementById('productForm').addEventListener('submit', (e) => this.handleAddProduct(e));
            document.getElementById('categoryForm').addEventListener('submit', (e) => this.handleAddCategory(e));
            document.getElementById('editProductForm').addEventListener('submit', (e) => this.handleEditProduct(e));
            
            // دکمه‌های فروش
            document.getElementById('markAsSold').addEventListener('click', () => this.markProductsAsSold());
            
            // دکمه‌های پشتیبان‌گیری
            document.getElementById('backupData').addEventListener('click', () => this.backupData());
            document.getElementById('restoreData').addEventListener('click', () => this.triggerRestore());
            document.getElementById('clearData').addEventListener('click', () => this.clearData());
            document.getElementById('restoreFile').addEventListener('change', (e) => this.restoreData(e));
            
            // دکمه‌های پرینت
            document.getElementById('printProducts').addEventListener('click', () => this.printProducts());
            document.getElementById('printCategories').addEventListener('click', () => this.printCategories());
            document.getElementById('printSales').addEventListener('click', () => this.printSales());
            document.getElementById('printInventory').addEventListener('click', () => this.printInventory());
            
            // تنظیمات تلگرام
            document.getElementById('saveTelegramSettings').addEventListener('click', () => this.saveTelegramSettings());
            
            // مدیریت مودال‌ها
            document.querySelectorAll('.close-modal').forEach(btn => {
                btn.addEventListener('click', () => this.closeAllModals());
            });
            
            // مدیریت پنل ادمین
            document.getElementById('createStoreAccount').addEventListener('click', () => this.openCreateStoreModal());
            document.getElementById('createStoreForm').addEventListener('submit', (e) => this.handleCreateStore(e));
            document.getElementById('backupAllData').addEventListener('click', () => this.backupAllData());
            document.getElementById('resetAllData').addEventListener('click', () => this.resetAllData());
            document.getElementById('viewAllData').addEventListener('click', () => this.viewAllData());
            
            // کلیک خارج از مودال برای بستن
            window.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal')) {
                    this.closeAllModals();
                }
            });
        },
        
        switchLoginTab(tab) {
            const userTab = document.getElementById('userLoginTab');
            const adminTab = document.getElementById('adminLoginTab');
            const userForm = document.getElementById('userLoginForm');
            const adminForm = document.getElementById('adminLoginForm');
            
            if (tab === 'user') {
                userTab.classList.add('active');
                adminTab.classList.remove('active');
                userForm.style.display = 'block';
                adminForm.style.display = 'none';
            } else {
                userTab.classList.remove('active');
                adminTab.classList.add('active');
                userForm.style.display = 'none';
                adminForm.style.display = 'block';
            }
        },
        
        showAppropriatePage() {
            const loginPage = document.getElementById('loginPage');
            const registerPage = document.getElementById('registerPage');
            const userDashboard = document.getElementById('userDashboard');
            const adminDashboard = document.getElementById('adminDashboard');
            
            // مخفی کردن تمام صفحات
            loginPage.style.display = 'none';
            registerPage.style.display = 'none';
            userDashboard.style.display = 'none';
            adminDashboard.style.display = 'none';
            
            if (this.currentUser) {
                if (this.isAdmin) {
                    adminDashboard.style.display = 'block';
                    this.renderAdminDashboard();
                } else {
                    userDashboard.style.display = 'block';
                    this.renderUserDashboard();
                }
            } else {
                loginPage.style.display = 'flex';
            }
        },
        
        showLoginPage() {
            document.getElementById('loginPage').style.display = 'flex';
            document.getElementById('registerPage').style.display = 'none';
        },
        
        showRegisterPage() {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('registerPage').style.display = 'flex';
        },
        
        handleUserLogin(e) {
            e.preventDefault();
            const email = document.getElementById('userEmail').value;
            const password = document.getElementById('userPassword').value;
            
            // جستجو در کاربران تأیید شده
            let user = this.users.find(u => u.email === email && u.password === password && u.approved);
            
            if (!user) {
                // جستجو در کاربران در انتظار تأیید
                user = this.pendingApprovals.find(u => u.email === email && u.password === password);
                if (user) {
                    this.currentUser = user;
                    this.isAdmin = false;
                    this.saveToStorage();
                    this.showAppropriatePage();
                    this.showNotification('حساب شما در انتظار تأیید مدیر است', 'warning');
                    return;
                }
            }
            
            if (user) {
                this.currentUser = user;
                this.isAdmin = false;
                this.saveToStorage();
                this.showAppropriatePage();
                this.showNotification('ورود موفقیت‌آمیز', 'success');
            } else {
                this.showNotification('ایمیل یا رمز عبور اشتباه است', 'error');
            }
        },
        
        handleAdminLogin(e) {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            
            if (email === this.adminCredentials.email && password === this.adminCredentials.password) {
                this.currentUser = { storeName: 'مدیر سیستم', ownerName: 'مدیر', email: email };
                this.isAdmin = true;
                this.saveToStorage();
                this.showAppropriatePage();
                this.showNotification('ورود مدیر موفقیت‌آمیز', 'success');
            } else {
                this.showNotification('ایمیل یا رمز عبور مدیر اشتباه است', 'error');
            }
        },
        
        handleRegister(e) {
            e.preventDefault();
            const storeName = document.getElementById('storeName').value;
            const ownerName = document.getElementById('ownerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // بررسی تطابق رمز عبور
            if (password !== confirmPassword) {
                this.showNotification('رمز عبور و تکرار آن مطابقت ندارند', 'error');
                return;
            }
            
            // بررسی وجود ایمیل
            if (this.users.find(u => u.email === email) || this.pendingApprovals.find(u => u.email === email)) {
                this.showNotification('این ایمیل قبلاً ثبت‌نام شده است', 'error');
                return;
            }
            
            // ایجاد کاربر جدید
            const newUser = {
                id: Date.now(),
                storeName,
                ownerName,
                email,
                password,
                approved: false,
                telegramBotToken: "",
                telegramChatId: "",
                createdAt: new Date().toISOString(),
                products: [],
                categories: [],
                soldItems: []
            };
            
            console.log('کاربر جدید ایجاد شد:', newUser);
            
            this.pendingApprovals.push(newUser);
            console.log('لیست انتظار پس از ثبت‌نام:', this.pendingApprovals);
            
            this.saveToStorage();
            
            // بررسی ذخیره‌سازی
            const savedData = localStorage.getItem('pending_approvals');
            console.log('داده‌های ذخیره شده در localStorage:', savedData);
            
            this.showNotification('ثبت‌نام موفقیت‌آمیز. منتظر تأیید مدیر باشید', 'success');
            this.showLoginPage();
            
            // ارسال پیام به مدیر
            this.sendToAdminTelegram(
                `🏪 درخواست ثبت‌نام جدید\n\n` +
                `فروشگاه: ${storeName}\n` +
                `صاحب: ${ownerName}\n` +
                `ایمیل: ${email}\n` +
                `تاریخ: ${new Date().toLocaleDateString('fa-IR')}\n\n` +
                `لطفا به پنل مدیریت مراجعه کنید.`
            );
        },
        
        handleCreateStore(e) {
            e.preventDefault();
            const storeName = document.getElementById('newStoreName').value;
            const ownerName = document.getElementById('newOwnerName').value;
            const email = document.getElementById('newStoreEmail').value;
            const password = document.getElementById('newStorePassword').value;
            
            // بررسی وجود ایمیل
            if (this.users.find(u => u.email === email) || this.pendingApprovals.find(u => u.email === email)) {
                this.showNotification('این ایمیل قبلاً ثبت‌نام شده است', 'error');
                return;
            }
            
            // ایجاد کاربر جدید
            const newUser = {
                id: Date.now(),
                storeName,
                ownerName,
                email,
                password,
                approved: true,
                telegramBotToken: "",
                telegramChatId: "",
                createdAt: new Date().toISOString(),
                products: [],
                categories: [],
                soldItems: []
            };
            
            this.users.push(newUser);
            this.saveToStorage();
            this.closeAllModals();
            this.renderAdminDashboard();
            
            this.showNotification(`حساب فروشگاه ${storeName} با موفقیت ایجاد شد`, 'success');
            
            // ارسال پیام به مدیر
            this.sendToAdminTelegram(
                `✅ حساب جدید ایجاد شد\n\n` +
                `فروشگاه: ${storeName}\n` +
                `صاحب: ${ownerName}\n` +
                `ایمیل: ${email}\n` +
                `تاریخ: ${new Date().toLocaleDateString('fa-IR')}`
            );
        },
        
        logout() {
            this.currentUser = null;
            this.isAdmin = false;
            this.saveToStorage();
            this.showAppropriatePage();
            this.showNotification('خروج موفقیت‌آمیز', 'info');
        },
        
        renderUserDashboard() {
            if (!this.currentUser) return;
            
            // به‌روزرسانی اطلاعات کاربر
            document.getElementById('userName').textContent = this.currentUser.storeName;
            document.getElementById('userAvatar').textContent = this.currentUser.storeName.charAt(0);
            
            // نمایش وضعیت تأیید کاربر
            const userStatusElement = document.getElementById('userStatus');
            const pendingApprovalElement = document.getElementById('pendingApproval');
            const userDashboardContent = document.getElementById('userDashboardContent');
            
            if (this.currentUser.approved) {
                userStatusElement.innerHTML = '<span class="user-status status-approved">تأیید شده</span>';
                pendingApprovalElement.style.display = 'none';
                userDashboardContent.style.display = 'block';
                
                // به‌روزرسانی آمار
                this.updateUserStats();
                
                // رندر محصولات و دسته‌بندی‌ها
                this.renderUserProducts();
                this.renderUserCategories();
                this.renderUserSoldItems();
                this.populateUserCategoryDropdowns();
                this.populateUserParentDropdowns();
                this.updateUserProductsChecklist();
                
                // بارگذاری تنظیمات تلگرام کاربر
                if (document.getElementById('userTelegramToken')) {
                    document.getElementById('userTelegramToken').value = this.currentUser.telegramBotToken || '';
                    document.getElementById('userTelegramChatId').value = this.currentUser.telegramChatId || '';
                }
            } else {
                userStatusElement.innerHTML = '<span class="user-status status-pending">در انتظار تأیید</span>';
                pendingApprovalElement.style.display = 'block';
                userDashboardContent.style.display = 'none';
            }
        },
        
        updateUserStats() {
            if (!this.currentUser) return;
            
            document.getElementById('totalProducts').textContent = this.currentUser.products.length;
            document.getElementById('totalCategories').textContent = this.currentUser.categories.length;
            document.getElementById('totalParents').textContent = this.currentUser.products.filter(p => p.parent === null).length;
            
            // تعداد فروش امروز
            const today = new Date().toDateString();
            const todaySales = this.currentUser.soldItems.filter(item => 
                new Date(item.soldAt).toDateString() === today
            ).length;
            document.getElementById('totalSold').textContent = todaySales;
        },
        
        renderUserProducts() {
            if (!this.currentUser) return;
            
            const tbody = document.getElementById('productsTableBody');
            tbody.innerHTML = '';
            
            const parentProducts = this.currentUser.products.filter(p => p.parent === null);
            
            parentProducts.forEach(product => {
                const parentRow = document.createElement('tr');
                parentRow.className = 'parent-item';
                parentRow.innerHTML = `
                    <td>
                        <button class="toggle-children" data-id="${product.id}">+</button>
                        ${product.name}
                    </td>
                    <td>${this.getUserCategoryName(product.category)}</td>
                    <td>${product.price.toLocaleString('fa-IR')}</td>
                    <td>-</td>
                    <td>${product.isSold ? '<span style="color:red">فروخته شده</span>' : '<span style="color:green">موجود</span>'}</td>
                    <td class="actions">
                        <button class="btn-success" onclick="SystemState.openEditProductModal(${product.id})">ویرایش</button>
                        <button class="btn-danger" onclick="SystemState.deleteUserProduct(${product.id})">حذف</button>
                    </td>
                `;
                tbody.appendChild(parentRow);
                
                const childProducts = this.currentUser.products.filter(p => p.parent === product.id);
                childProducts.forEach(child => {
                    const childRow = document.createElement('tr');
                    childRow.className = 'child-item hidden';
                    childRow.setAttribute('data-parent', product.id);
                    childRow.innerHTML = `
                        <td>→ ${child.name}</td>
                        <td>${this.getUserCategoryName(child.category)}</td>
                        <td>${child.price.toLocaleString('fa-IR')}</td>
                        <td>${product.name}</td>
                        <td>${child.isSold ? '<span style="color:red">فروخته شده</span>' : '<span style="color:green">موجود</span>'}</td>
                        <td class="actions">
                            <button class="btn-success" onclick="SystemState.openEditProductModal(${child.id})">ویرایش</button>
                            <button class="btn-danger" onclick="SystemState.deleteUserProduct(${child.id})">حذف</button>
                        </td>
                    `;
                    tbody.appendChild(childRow);
                });
            });
            
            // اضافه کردن event listener برای دکمه‌های toggle
            document.querySelectorAll('.toggle-children').forEach(button => {
                button.addEventListener('click', function() {
                    const parentId = this.getAttribute('data-id');
                    const childRows = document.querySelectorAll(`tr[data-parent="${parentId}"]`);
                    const isHidden = childRows[0].classList.contains('hidden');
                    
                    childRows.forEach(row => {
                        if (isHidden) {
                            row.classList.remove('hidden');
                        } else {
                            row.classList.add('hidden');
                        }
                    });
                    
                    this.textContent = isHidden ? '-' : '+';
                });
            });
            
            // اگر محصولی وجود ندارد
            if (parentProducts.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align: center; color: var(--secondary);">
                            هیچ محصولی ثبت نشده است
                        </td>
                    </tr>
                `;
            }
        },
        
        renderUserCategories() {
            if (!this.currentUser) return;
            
            const tbody = document.getElementById('categoriesTableBody');
            tbody.innerHTML = '';
            
            const parentCategories = this.currentUser.categories.filter(c => c.parent === null);
            
            parentCategories.forEach(category => {
                const parentRow = document.createElement('tr');
                parentRow.className = 'parent-item';
                parentRow.innerHTML = `
                    <td>
                        <button class="toggle-children" data-id="${category.id}">+</button>
                        ${category.name}
                    </td>
                    <td>-</td>
                    <td>${category.productCount}</td>
                    <td class="actions">
                        <button class="btn-success" onclick="SystemState.editCategory(${category.id})">ویرایش</button>
                        <button class="btn-danger" onclick="SystemState.deleteUserCategory(${category.id})">حذف</button>
                    </td>
                `;
                tbody.appendChild(parentRow);
                
                const childCategories = this.currentUser.categories.filter(c => c.parent === category.id);
                childCategories.forEach(child => {
                    const childRow = document.createElement('tr');
                    childRow.className = 'child-item hidden';
                    childRow.setAttribute('data-parent', category.id);
                    childRow.innerHTML = `
                        <td>→ ${child.name}</td>
                        <td>${category.name}</td>
                        <td>${child.productCount}</td>
                        <td class="actions">
                            <button class="btn-success" onclick="SystemState.editCategory(${child.id})">ویرایش</button>
                            <button class="btn-danger" onclick="SystemState.deleteUserCategory(${child.id})">حذف</button>
                        </td>
                    `;
                    tbody.appendChild(childRow);
                });
            });
            
            // اضافه کردن event listener برای دکمه‌های toggle
            document.querySelectorAll('.toggle-children').forEach(button => {
                button.addEventListener('click', function() {
                    const parentId = this.getAttribute('data-id');
                    const childRows = document.querySelectorAll(`tr[data-parent="${parentId}"]`);
                    const isHidden = childRows[0].classList.contains('hidden');
                    
                    childRows.forEach(row => {
                        if (isHidden) {
                            row.classList.remove('hidden');
                        } else {
                            row.classList.add('hidden');
                        }
                    });
                    
                    this.textContent = isHidden ? '-' : '+';
                });
            });
            
            // اگر دسته‌بندی وجود ندارد
            if (parentCategories.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align: center; color: var(--secondary);">
                            هیچ دسته‌بندی ثبت نشده است
                        </td>
                    </tr>
                `;
            }
        },
        
        renderUserSoldItems() {
            if (!this.currentUser) return;
            
            const soldItemsList = document.getElementById('soldItemsList');
            soldItemsList.innerHTML = '';
            
            // نمایش فقط فروش‌های امروز
            const today = new Date().toDateString();
            const todaySales = this.currentUser.soldItems.filter(item => 
                new Date(item.soldAt).toDateString() === today
            );
            
            if (todaySales.length === 0) {
                soldItemsList.innerHTML = '<p style="text-align: center; color: var(--secondary);">هیچ فروشی برای امروز ثبت نشده است</p>';
                return;
            }
            
            todaySales.forEach((item, index) => {
                const soldItem = document.createElement('div');
                soldItem.className = 'sold-item';
                soldItem.innerHTML = `
                    <div class="sold-item-info">
                        <div class="sold-item-name">${item.productName}</div>
                        <div class="sold-item-details">
                            قیمت: ${item.price.toLocaleString('fa-IR')} افغانی | 
                            دسته‌بندی: ${this.getUserCategoryName(item.category)} |
                            زمان: ${new Date(item.soldAt).toLocaleTimeString('fa-IR')}
                        </div>
                    </div>
                    <div class="sold-item-actions">
                        <button class="btn-warning" onclick="SystemState.returnProduct(${index})">بازگرداندن</button>
                    </div>
                `;
                soldItemsList.appendChild(soldItem);
            });
        },
        
        populateUserCategoryDropdowns() {
            if (!this.currentUser) return;
            
            const categorySelects = [
                document.getElementById('productCategory'),
                document.getElementById('editProductCategory'),
                document.getElementById('categoryParent')
            ];
            
            categorySelects.forEach(select => {
                if (select) {
                    // حفظ مقدار فعلی
                    const currentValue = select.value;
                    select.innerHTML = '<option value="">انتخاب کنید</option>';
                    
                    // اضافه کردن دسته‌بندی‌های اصلی
                    this.currentUser.categories
                        .filter(c => c.parent === null)
                        .forEach(category => {
                            const option = document.createElement('option');
                            option.value = category.id;
                            option.textContent = category.name;
                            select.appendChild(option);
                        });
                    
                    // بازگرداندن مقدار قبلی اگر هنوز وجود دارد
                    if (currentValue && Array.from(select.options).some(opt => opt.value === currentValue)) {
                        select.value = currentValue;
                    }
                }
            });
        },
        
        populateUserParentDropdowns() {
            if (!this.currentUser) return;
            
            const parentSelects = [
                document.getElementById('productParent'),
                document.getElementById('editProductParent')
            ];
            
            parentSelects.forEach(select => {
                if (select) {
                    // حفظ مقدار فعلی
                    const currentValue = select.value;
                    select.innerHTML = '<option value="">هیچکدام (محصول اصلی)</option>';
                    
                    // اضافه کردن محصولات اصلی
                    this.currentUser.products
                        .filter(p => p.parent === null)
                        .forEach(product => {
                            const option = document.createElement('option');
                            option.value = product.id;
                            option.textContent = product.name;
                            select.appendChild(option);
                        });
                    
                    // بازگرداندن مقدار قبلی اگر هنوز وجود دارد
                    if (currentValue && Array.from(select.options).some(opt => opt.value === currentValue)) {
                        select.value = currentValue;
                    }
                }
            });
        },
        
        updateUserProductsChecklist() {
            if (!this.currentUser) return;
            
            const checklist = document.getElementById('productsChecklist');
            checklist.innerHTML = '';
            
            const availableProducts = this.currentUser.products.filter(p => !p.isSold);
            
            if (availableProducts.length === 0) {
                checklist.innerHTML = '<p style="text-align: center; color: var(--secondary);">هیچ محصولی برای فروش موجود نیست</p>';
                return;
            }
            
            availableProducts.forEach(product => {
                const checkboxItem = document.createElement('div');
                checkboxItem.className = 'checkbox-item';
                checkboxItem.innerHTML = `
                    <input type="checkbox" id="product_${product.id}" value="${product.id}">
                    <label for="product_${product.id}">
                        ${product.name} - ${product.price.toLocaleString('fa-IR')} افغانی
                        ${product.parent ? ` (فرعی)` : ''}
                    </label>
                `;
                checklist.appendChild(checkboxItem);
            });
        },
        
        getUserCategoryName(categoryId) {
            if (!this.currentUser) return 'نامشخص';
            const category = this.currentUser.categories.find(c => c.id == categoryId);
            return category ? category.name : 'نامشخص';
        },
        
        handleAddProduct(e) {
            e.preventDefault();
            if (!this.currentUser) return;
            
            const name = document.getElementById('productName').value;
            const category = document.getElementById('productCategory').value;
            const price = parseInt(document.getElementById('productPrice').value);
            const parent = document.getElementById('productParent').value || null;
            const description = document.getElementById('productDescription').value;
            
            const newProduct = {
                id: Date.now(),
                name,
                category,
                price,
                parent: parent ? parseInt(parent) : null,
                description,
                isSold: false
            };
            
            this.currentUser.products.push(newProduct);
            
            // به‌روزرسانی تعداد محصولات در دسته‌بندی
            const categoryObj = this.currentUser.categories.find(c => c.id == category);
            if (categoryObj) {
                categoryObj.productCount++;
            }
            
            this.saveToStorage();
            this.renderUserDashboard();
            document.getElementById('productForm').reset();
            
            this.showNotification('محصول با موفقیت اضافه شد', 'success');
            
            // ارسال پیام به تلگرام
            this.sendToUserTelegram(
                `➕ محصول جدید اضافه شد\n\n` +
                `نام: ${name}\n` +
                `قیمت: ${price.toLocaleString('fa-IR')} افغانی\n` +
                `دسته‌بندی: ${this.getUserCategoryName(category)}\n` +
                `تاریخ: ${new Date().toLocaleDateString('fa-IR')}`
            );
        },
        
        handleAddCategory(e) {
            e.preventDefault();
            if (!this.currentUser) return;
            
            const name = document.getElementById('categoryName').value;
            const parent = document.getElementById('categoryParent').value || null;
            
            const newCategory = {
                id: Date.now(),
                name,
                parent: parent ? parseInt(parent) : null,
                productCount: 0
            };
            
            this.currentUser.categories.push(newCategory);
            this.saveToStorage();
            this.renderUserDashboard();
            document.getElementById('categoryForm').reset();
            
            this.showNotification('دسته‌بندی با موفقیت اضافه شد', 'success');
            
            // ارسال پیام به تلگرام
            this.sendToUserTelegram(
                `📁 دسته‌بندی جدید اضافه شد\n\n` +
                `نام: ${name}\n` +
                `تاریخ: ${new Date().toLocaleDateString('fa-IR')}`
            );
        },
        
        openEditProductModal(productId) {
            if (!this.currentUser) return;
            
            const product = this.currentUser.products.find(p => p.id === productId);
            if (!product) return;
            
            document.getElementById('editProductId').value = product.id;
            document.getElementById('editProductName').value = product.name;
            document.getElementById('editProductCategory').value = product.category;
            document.getElementById('editProductPrice').value = product.price;
            document.getElementById('editProductParent').value = product.parent || '';
            document.getElementById('editProductDescription').value = product.description || '';
            
            // مطمئن شویم dropdownها پر شده‌اند
            this.populateUserCategoryDropdowns();
            this.populateUserParentDropdowns();
            
            document.getElementById('editProductModal').style.display = 'flex';
        },
        
        handleEditProduct(e) {
            e.preventDefault();
            if (!this.currentUser) return;
            
            const productId = parseInt(document.getElementById('editProductId').value);
            const name = document.getElementById('editProductName').value;
            const category = document.getElementById('editProductCategory').value;
            const price = parseInt(document.getElementById('editProductPrice').value);
            const parent = document.getElementById('editProductParent').value || null;
            const description = document.getElementById('editProductDescription').value;
            
            const productIndex = this.currentUser.products.findIndex(p => p.id === productId);
            if (productIndex === -1) return;
            
            // ذخیره وضعیت قبلی برای به‌روزرسانی آمار دسته‌بندی
            const oldCategory = this.currentUser.products[productIndex].category;
            
            // به‌روزرسانی محصول
            this.currentUser.products[productIndex] = {
                ...this.currentUser.products[productIndex],
                name,
                category,
                price,
                parent: parent ? parseInt(parent) : null,
                description
            };
            
            // به‌روزرسانی آمار دسته‌بندی‌ها
            if (oldCategory !== category) {
                const oldCategoryObj = this.currentUser.categories.find(c => c.id == oldCategory);
                if (oldCategoryObj) {
                    oldCategoryObj.productCount--;
                }
                
                const newCategoryObj = this.currentUser.categories.find(c => c.id == category);
                if (newCategoryObj) {
                    newCategoryObj.productCount++;
                }
            }
            
            this.saveToStorage();
            this.renderUserDashboard();
            this.closeAllModals();
            
            this.showNotification('محصول با موفقیت ویرایش شد', 'success');
            
            // ارسال پیام به تلگرام
            this.sendToUserTelegram(
                `✏️ محصول ویرایش شد\n\n` +
                `نام: ${name}\n` +
                `قیمت جدید: ${price.toLocaleString('fa-IR')} افغانی\n` +
                `دسته‌بندی: ${this.getUserCategoryName(category)}\n` +
                `تاریخ: ${new Date().toLocaleDateString('fa-IR')}`
            );
        },
        
        deleteUserProduct(productId) {
            if (!this.currentUser) return;
            
            if (!confirm('آیا از حذف این محصول اطمینان دارید؟')) return;
            
            const productIndex = this.currentUser.products.findIndex(p => p.id === productId);
            if (productIndex === -1) return;
            
            const product = this.currentUser.products[productIndex];
            
            // به‌روزرسانی آمار دسته‌بندی
            const categoryObj = this.currentUser.categories.find(c => c.id == product.category);
            if (categoryObj) {
                categoryObj.productCount--;
            }
            
            // حذف محصول
            this.currentUser.products.splice(productIndex, 1);
            
            // حذف محصولات فرزند اگر وجود دارند
            this.currentUser.products = this.currentUser.products.filter(p => p.parent !== productId);
            
            this.saveToStorage();
            this.renderUserDashboard();
            
            this.showNotification('محصول با موفقیت حذف شد', 'success');
            
            // ارسال پیام به تلگرام
            this.sendToUserTelegram(
                `🗑️ محصول حذف شد\n\n` +
                `نام: ${product.name}\n` +
                `تاریخ: ${new Date().toLocaleDateString('fa-IR')}`
            );
        },
        
        deleteUserCategory(categoryId) {
            if (!this.currentUser) return;
            
            if (!confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟ محصولات مرتبط نیز حذف خواهند شد.')) return;
            
            const categoryIndex = this.currentUser.categories.findIndex(c => c.id === categoryId);
            if (categoryIndex === -1) return;
            
            const category = this.currentUser.categories[categoryIndex];
            
            // حذف دسته‌بندی
            this.currentUser.categories.splice(categoryIndex, 1);
            
            // حذف دسته‌بندی‌های فرزند
            this.currentUser.categories = this.currentUser.categories.filter(c => c.parent !== categoryId);
            
            // حذف محصولات مرتبط
            this.currentUser.products = this.currentUser.products.filter(p => p.category != categoryId);
            
            this.saveToStorage();
            this.renderUserDashboard();
            
            this.showNotification('دسته‌بندی با موفقیت حذف شد', 'success');
        },
        
        markProductsAsSold() {
            if (!this.currentUser) return;
            
            const checkboxes = document.querySelectorAll('#productsChecklist input[type="checkbox"]:checked');
            if (checkboxes.length === 0) {
                this.showNotification('هیچ محصولی انتخاب نشده است', 'warning');
                return;
            }
            
            const soldProducts = [];
            let totalAmount = 0;
            
            checkboxes.forEach(checkbox => {
                const productId = parseInt(checkbox.value);
                const productIndex = this.currentUser.products.findIndex(p => p.id === productId);
                
                if (productIndex !== -1) {
                    const product = this.currentUser.products[productIndex];
                    product.isSold = true;
                    
                    // اضافه کردن به لیست فروش‌ها
                    this.currentUser.soldItems.push({
                        productId: product.id,
                        productName: product.name,
                        category: product.category,
                        price: product.price,
                        soldAt: new Date().toISOString()
                    });
                    
                    soldProducts.push(product);
                    totalAmount += product.price;
                }
            });
            
            this.saveToStorage();
            this.renderUserDashboard();
            
            this.showNotification(
                `${soldProducts.length} محصول با موفقیت به عنوان فروخته شده ثبت شد`,
                'success'
            );
            
            // ارسال پیام به تلگرام
            if (soldProducts.length === 1) {
                this.sendToUserTelegram(
                    `💰 فروش جدید ثبت شد\n\n` +
                    `محصول: ${soldProducts[0].name}\n` +
                    `قیمت: ${soldProducts[0].price.toLocaleString('fa-IR')} افغانی\n` +
                    `دسته‌بندی: ${this.getUserCategoryName(soldProducts[0].category)}\n` +
                    `تاریخ: ${new Date().toLocaleDateString('fa-IR')}`
                );
            } else {
                this.sendToUserTelegram(
                    `💰 فروش چندگانه ثبت شد\n\n` +
                    `تعداد محصولات: ${soldProducts.length}\n` +
                    `جمع مبلغ: ${totalAmount.toLocaleString('fa-IR')} افغانی\n` +
                    `تاریخ: ${new Date().toLocaleDateString('fa-IR')}`
                );
            }
        },
        
        returnProduct(soldItemIndex) {
            if (!this.currentUser) return;
            
            if (!confirm('آیا از بازگرداندن این محصول اطمینان دارید؟')) return;
            
            const soldItem = this.currentUser.soldItems[soldItemIndex];
            
            // بازگرداندن وضعیت محصول
            const productIndex = this.currentUser.products.findIndex(p => p.id === soldItem.productId);
            if (productIndex !== -1) {
                this.currentUser.products[productIndex].isSold = false;
            }
            
            // حذف از لیست فروش‌ها
            this.currentUser.soldItems.splice(soldItemIndex, 1);
            
            this.saveToStorage();
            this.renderUserDashboard();
            
            this.showNotification('محصول با موفقیت بازگردانده شد', 'success');
            
            // ارسال پیام به تلگرام
            this.sendToUserTelegram(
                `↩️ محصول بازگردانده شد\n\n` +
                `محصول: ${soldItem.productName}\n` +
                `قیمت: ${soldItem.price.toLocaleString('fa-IR')} افغانی\n` +
                `تاریخ: ${new Date().toLocaleDateString('fa-IR')}`
            );
        },
        
        backupData() {
            if (!this.currentUser) return;
            
            const data = {
                user: this.currentUser,
                backupDate: new Date().toISOString(),
                system: 'Store Management System'
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup-${this.currentUser.storeName}-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('پشتیبان با موفقیت دانلود شد', 'success');
        },
        
        triggerRestore() {
            document.getElementById('restoreFile').click();
        },
        
        restoreData(e) {
            if (!this.currentUser) return;
            
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (data.user && data.system === 'Store Management System') {
                        // جایگزینی داده‌های کاربر
                        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
                        if (userIndex !== -1) {
                            this.users[userIndex] = data.user;
                            this.currentUser = data.user;
                            this.saveToStorage();
                            this.renderUserDashboard();
                            this.showNotification('داده‌ها با موفقیت بازیابی شدند', 'success');
                        }
                    } else {
                        this.showNotification('فایل پشتیبان معتبر نیست', 'error');
                    }
                } catch (error) {
                    console.error('خطا در بازیابی داده‌ها:', error);
                    this.showNotification('خطا در بازیابی داده‌ها', 'error');
                }
            };
            reader.readAsText(file);
            
            // ریست کردن input فایل
            e.target.value = '';
        },
        
        clearData() {
            if (!this.currentUser) return;
            
            if (!confirm('آیا از پاک کردن تمام داده‌های خود اطمینان دارید؟ این عمل غیرقابل برگشت است.')) return;
            
            // حفظ اطلاعات پایه کاربر
            const userBase = {
                id: this.currentUser.id,
                storeName: this.currentUser.storeName,
                ownerName: this.currentUser.ownerName,
                email: this.currentUser.email,
                password: this.currentUser.password,
                approved: this.currentUser.approved,
                telegramBotToken: this.currentUser.telegramBotToken,
                telegramChatId: this.currentUser.telegramChatId,
                createdAt: this.currentUser.createdAt
            };
            
            // ریست کردن داده‌ها
            this.currentUser = {
                ...userBase,
                products: [],
                categories: [],
                soldItems: []
            };
            
            // به‌روزرسانی در لیست کاربران
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                this.users[userIndex] = this.currentUser;
            }
            
            this.saveToStorage();
            this.renderUserDashboard();
            
            this.showNotification('تمامی داده‌ها پاک شدند', 'success');
            
            // ارسال پیام به تلگرام
            this.sendToUserTelegram(
                `🔄 داده‌ها بازنشانی شدند\n\n` +
                `تمامی محصولات، دسته‌بندی‌ها و تاریخچه فروش پاک شدند.\n` +
                `تاریخ: ${new Date().toLocaleDateString('fa-IR')}`
            );
        },
        
        printProducts() {
            if (!this.currentUser) return;
            
            const printArea = document.getElementById('printArea');
            printArea.innerHTML = '';
            
            let content = `
                <div class="print-header">
                    <
