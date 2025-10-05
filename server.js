const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// پوشهها را ایجاد کن
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

// پیکربندی Multer برای آپلود فایل
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// تابع برای خواندن دادهها از فایل
function readData(filename) {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
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

// API Routes

// دریافت تمام دادهها
app.get('/api/data', (req, res) => {
  const data = {
    gallery: readData('gallery.json') || [],
    products: readData('products.json') || [],
    features: readData('features.json') || [],
    hero: readData('hero.json') || {},
    ethical: readData('ethical.json') || {},
    footer: readData('footer.json') || {}
  };
  res.json(data);
});

// ذخیره گالری
app.post('/api/gallery', (req, res) => {
  const { gallery } = req.body;
  if (writeData('gallery.json', gallery)) {
    res.json({ success: true, message: 'Gallery data saved successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save gallery data' });
  }
});

// ذخیره محصولات
app.post('/api/products', (req, res) => {
  const { products } = req.body;
  if (writeData('products.json', products)) {
    res.json({ success: true, message: 'Products data saved successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save products data' });
  }
});

// ذخیره امکانات
app.post('/api/features', (req, res) => {
  const { features } = req.body;
  if (writeData('features.json', features)) {
    res.json({ success: true, message: 'Features data saved successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save features data' });
  }
});

// ذخیره بخش اصلی
app.post('/api/hero', (req, res) => {
  const { hero } = req.body;
  if (writeData('hero.json', hero)) {
    res.json({ success: true, message: 'Hero data saved successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save hero data' });
  }
});

// ذخیره راهنمای اخلاقی
app.post('/api/ethical', (req, res) => {
  const { ethical } = req.body;
  if (writeData('ethical.json', ethical)) {
    res.json({ success: true, message: 'Ethical data saved successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save ethical data' });
  }
});

// ذخیره فوتر
app.post('/api/footer', (req, res) => {
  const { footer } = req.body;
  if (writeData('footer.json', footer)) {
    res.json({ success: true, message: 'Footer data saved successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save footer data' });
  }
});

// آپلود تصویر
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ 
    success: true, 
    message: 'Image uploaded successfully',
    imageUrl: imageUrl
  });
});

// ارسال سفارش به تلگرام
app.post('/api/order', async (req, res) => {
  const { orderData, customerInfo } = req.body;
  
  try {
    const TELEGRAM_BOT_TOKEN = '8459199254:AAEqCLIMDfs9uj2LNcX_93zt69_V_QrO_uY';
    const TELEGRAM_CHAT_ID = '6071335955';
    
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
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      res.json({ success: true, message: 'Order sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send order to Telegram' });
    }
  } catch (error) {
    console.error('Telegram send error:', error);
    res.status(500).json({ success: false, message: 'Server error while sending order' });
  }
});

// دریافت پشتیبان
app.get('/api/backup', (req, res) => {
  try {
    const data = {
      gallery: readData('gallery.json') || [],
      products: readData('products.json') || [],
      features: readData('features.json') || [],
      hero: readData('hero.json') || {},
      ethical: readData('ethical.json') || {},
      footer: readData('footer.json') || {},
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
app.post('/api/restore', upload.single('backup'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No backup file uploaded' });
  }
  
  try {
    const backupData = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));
    
    if (backupData.gallery) writeData('gallery.json', backupData.gallery);
    if (backupData.products) writeData('products.json', backupData.products);
    if (backupData.features) writeData('features.json', backupData.features);
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
