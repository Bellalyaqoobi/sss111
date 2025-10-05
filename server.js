const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Telegraf } = require('telegraf');

const app = express();
const PORT = process.env.PORT || 3000;

// تنظیمات تلگرام
const TELEGRAM_BOT_TOKEN = '8459199254:AAEqCLIMDfs9uj2LNcX_93zt69_V_QrO_uY';
const TELEGRAM_CHAT_ID = '6071335955';
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// ایجاد پوشههای لازم
const folders = ['uploads/images', 'uploads/videos', 'data', 'public'];
folders.forEach(folder => {
    const fullPath = path.join(__dirname, folder);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// پیکربندی Multer برای آپلود تصاویر
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// پیکربندی Multer برای آپلود ویدیوها
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadImage = multer({ 
    storage: imageStorage,
    limits: { 
        fileSize: 50 * 1024 * 1024 // 50MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

const uploadVideo = multer({ 
    storage: videoStorage,
    limits: { 
        fileSize: 500 * 1024 * 1024 // 500MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'), false);
        }
    }
});

const uploadAny = multer({
    dest: 'uploads/temp/',
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB
    }
});

// تابع برای خواندن دادهها از فایل
function readData(filename) {
    try {
        const filePath = path.join(__dirname, 'data', filename);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return data ? JSON.parse(data) : [];
        }
        return [];
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
}

// تابع برای نوشتن دادهها در فایل
function writeData(filename, data) {
    try {
        const filePath = path.join(__dirname, 'data', filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
}

// دادههای پیشفرض
const defaultData = {
    gallery: [
        {
            id: 1,
            image: '/uploads/images/default-gallery-1.jpg',
            title: 'کالی لینکس ۲۰۲۳',
            description: 'جدیدترین نسخه کالی لینکس با ابزارهای به روز شده',
            type: 'image'
        }
    ],
    products: [
        {
            id: 1,
            name: "Nmap Pro Edition",
            category: "ابزار شبکه",
            price: 2990,
            description: "ابزار اسکن شبکه پیشرفته با قابلیتهای گسترده برای شناسایی میزبانها و سرویسها",
            image: "/uploads/images/default-product-1.jpg",
            video: ""
        }
    ],
    features: [
        {
            id: 1,
            icon: "fas fa-shield-alt",
            title: "امنیت پیشرفته",
            description: "ابزارهای تست نفوذ و امنیت با قابلیتهای پیشرفته برای شناسایی آسیبپذیریها"
        }
    ],
    videos: [
        {
            id: 1,
            title: "آموزش نصب کالی لینکس",
            description: "آموزش کامل نصب و راهاندازی کالی لینکس",
            videoUrl: "/uploads/videos/default-video-1.mp4",
            thumbnail: "/uploads/images/default-video-thumb-1.jpg",
            duration: "15:30",
            category: "آموزشی"
        }
    ],
    hero: {
        title: "ابزارهای حرفهای کالی لینکس",
        description: "مجموعهای کامل از ابزارهای امنیتی و تست نفوذ برای متخصصان امنیت سایبری. تمامی ابزارها با مجوزهای قانونی و برای اهداف آموزشی ارائه میشوند."
    },
    ethical: {
        title: "راهنمای استفاده اخلاقی",
        description: "همه ابزارها باید تنها برای اهداف قانونی و اخلاقی استفاده شوند",
        warning: "<h3><i class='fas fa-exclamation-triangle'></i> هشدار مسئولیت اخلاقی</h3><p>کلیه ابزارهای ارائه شده در این وبسایت تنها برای اهداف آموزشی، تست نفوذ مجاز و ارزیابی امنیت سیستمهایی که مالکیت آنها را دارید، طراحی شدهاند.</p>",
        footer: "با خرید هر یک از محصولات، تأیید میکنید که از آنها تنها برای اهداف قانونی استفاده خواهید کرد و مسئولیت هرگونه استفاده غیرقانونی بر عهده شما خواهد بود.",
        allowed: "تست نفوذ با مجوز کتبی، آموزش امنیت، تحقیق امنیتی قانونی",
        prohibited: "دسترسی غیرمجاز، حملات مخرب، نقض حریم خصوصی دیگران"
    },
    footer: {
        about: "Kali Tools Pro ارائهدهنده ابزارهای تخصصی امنیت سایبری و تست نفوذ برای متخصصان و علاقهمندان به امنیت اطلاعات است.",
        address: "کابل، افغانستان",
        phone: "۰۷۹۰ ۱۲۳ ۴۵۶",
        email: "info@kalitoolspro.af",
        copyright: "کلیه حقوق مادی و معنوی این وبسایت متعلق به Kali Tools Pro میباشد. (۱۴۰۳)"
    }
};

// ایجاد دادههای پیشفرض اگر وجود ندارند
function initializeDefaultData() {
    const files = [
        'gallery.json', 'products.json', 'features.json', 
        'videos.json', 'hero.json', 'ethical.json', 'footer.json'
    ];
    
    files.forEach(file => {
        const dataType = file.replace('.json', '');
        if (!readData(file).length && defaultData[dataType]) {
            writeData(file, defaultData[dataType]);
        }
    });
}

// API Routes

// دریافت تمام دادهها
app.get('/api/data', (req, res) => {
    try {
        const data = {
            gallery: readData('gallery.json'),
            products: readData('products.json'),
            features: readData('features.json'),
            videos: readData('videos.json'),
            hero: readData('hero.json')[0] || defaultData.hero,
            ethical: readData('ethical.json')[0] || defaultData.ethical,
            footer: readData('footer.json')[0] || defaultData.footer
        };
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error in /api/data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'خطا در دریافت دادهها',
            error: error.message 
        });
    }
});

// Routes برای ذخیره دادهها
const dataRoutes = [
    { path: '/gallery', file: 'gallery.json' },
    { path: '/products', file: 'products.json' },
    { path: '/features', file: 'features.json' },
    { path: '/videos', file: 'videos.json' },
    { path: '/hero', file: 'hero.json' },
    { path: '/ethical', file: 'ethical.json' },
    { path: '/footer', file: 'footer.json' }
];

dataRoutes.forEach(route => {
    app.post(`/api${route.path}`, (req, res) => {
        try {
            const data = req.body[route.path.replace('/', '')] || req.body;
            if (writeData(route.file, data)) {
                res.json({ success: true, message: 'Data saved successfully' });
            } else {
                res.status(500).json({ success: false, message: 'Failed to save data' });
            }
        } catch (error) {
            console.error(`Error saving ${route.path}:`, error);
            res.status(500).json({ success: false, message: 'خطا در ذخیره دادهها' });
        }
    });
});

// آپلود تصویر
app.post('/api/upload/image', uploadImage.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
        const imageUrl = `/uploads/images/${req.file.filename}`;
        res.json({ 
            success: true, 
            message: 'Image uploaded successfully',
            fileUrl: imageUrl
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ 
            success: false, 
            message: 'خطا در آپلود تصویر',
            error: error.message 
        });
    }
});

// آپلود ویدیو
app.post('/api/upload/video', uploadVideo.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
        const videoUrl = `/uploads/videos/${req.file.filename}`;
        res.json({ 
            success: true, 
            message: 'Video uploaded successfully',
            fileUrl: videoUrl
        });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ 
            success: false, 
            message: 'خطا در آپلود ویدیو',
            error: error.message 
        });
    }
});

// آپلود فایل عمومی
app.post('/api/upload/file', uploadAny.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
        // تشخیص نوع فایل و انتقال به پوشه مناسب
        const fileType = req.file.mimetype.split('/')[0];
        const newFileName = `${fileType}-${Date.now()}-${req.file.originalname}`;
        let newPath = '';
        
        if (fileType === 'image') {
            newPath = path.join(__dirname, 'uploads/images', newFileName);
        } else if (fileType === 'video') {
            newPath = path.join(__dirname, 'uploads/videos', newFileName);
        } else {
            // برای فایلهای دیگر
            newPath = path.join(__dirname, 'uploads/files', newFileName);
        }
        
        fs.renameSync(req.file.path, newPath);
        
        const fileUrl = `/uploads/${fileType}s/${newFileName}`;
        res.json({ 
            success: true, 
            message: 'File uploaded successfully',
            fileUrl: fileUrl,
            fileType: fileType
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ 
            success: false, 
            message: 'خطا در آپلود فایل',
            error: error.message 
        });
    }
});

// ارسال سفارش به تلگرام
app.post('/api/order', async (req, res) => {
    try {
        const { orderData, customerInfo } = req.body;
        
        // آمادهسازی جزئیات سفارش
        const orderDetails = orderData.map(item => {
            return `- ${item.name} (${item.quantity} عدد) - ${item.price * item.quantity} AFN`;
        }).join('\n');
        
        const totalPrice = orderData.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        const message = `
🛒 سفارش جدید از Kali Tools Pro

👤 اطلاعات مشتری:
نام: ${customerInfo.name}
تلفن: ${customerInfo.phone}
تلگرام: ${customerInfo.telegram || 'ندارد'}
آدرس: ${customerInfo.address || 'ندارد'}

📦 جزئیات سفارش:
${orderDetails}

💰 جمع کل: ${totalPrice} AFN
💳 روش پرداخت: ${customerInfo.payment}

⏰ زمان سفارش: ${new Date().toLocaleString('fa-IR')}
        `.trim();
        
        // ارسال به تلگرام
        await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, message);
        
        res.json({ 
            success: true, 
            message: 'Order sent successfully',
            orderId: 'ORD-' + Date.now()
        });
        
    } catch (error) {
        console.error('Error sending order:', error);
        res.status(500).json({ 
            success: false, 
            message: 'خطا در ارسال سفارش',
            error: error.message 
        });
    }
});

// دریافت پشتیبان
app.get('/api/backup', (req, res) => {
    try {
        const data = {
            gallery: readData('gallery.json'),
            products: readData('products.json'),
            features: readData('features.json'),
            videos: readData('videos.json'),
            hero: readData('hero.json'),
            ethical: readData('ethical.json'),
            footer: readData('footer.json'),
            timestamp: new Date().toISOString()
        };
        
        const filename = `kalitools-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ success: false, message: 'Failed to create backup' });
    }
});

// بازیابی پشتیبان
app.post('/api/restore', uploadAny.single('backup'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No backup file uploaded' });
        }
        
        const backupData = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));
        
        if (backupData.gallery) writeData('gallery.json', backupData.gallery);
        if (backupData.products) writeData('products.json', backupData.products);
        if (backupData.features) writeData('features.json', backupData.features);
        if (backupData.videos) writeData('videos.json', backupData.videos);
        if (backupData.hero) writeData('hero.json', backupData.hero);
        if (backupData.ethical) writeData('ethical.json', backupData.ethical);
        if (backupData.footer) writeData('footer.json', backupData.footer);
        
        // حذف فایل آپلود شده
        fs.unlinkSync(req.file.path);
        
        res.json({ success: true, message: 'Backup restored successfully' });
    } catch (error) {
        console.error('Restore error:', error);
        res.status(500).json({ success: false, message: 'Failed to restore backup' });
    }
});

// Route اصلی برای سرو فایل HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route برای مدیریت خطاهای 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// مدیریت خطاهای سرور
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// راهاندازی سرور
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
    
    // مقداردهی اولیه دادهها
    initializeDefaultData();
});
