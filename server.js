import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// استيراد معالجات الـ API الخاصة بالمشروع
import contactHandler from './api/contact.js';
import deleteUserHandler from './api/delete-user.js';
import getUsersHandler from './api/get-users.js';
import nourHandler from './api/nour.js';
import saveUserHandler from './api/save-user.js';
import updateUserHandler from './api/update-user.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// تمكين تحليل أجسام الطلبات بصيغة JSON
app.use(express.json());

// توجيه مسارات الـ API لتعمل تماماً كما في Vercel
app.all('/api/contact', contactHandler);
app.all('/api/delete-user', deleteUserHandler);
app.all('/api/get-users', getUsersHandler);
app.all('/api/nour', nourHandler);
app.all('/api/save-user', saveUserHandler);
app.all('/api/update-user', updateUserHandler);

// تقديم الملفات الثابتة لموقع React المبني
app.use(express.static(path.join(__dirname, 'dist')));

// دعم التوجيه الداخلي لـ React Router لجميع المسارات الأخرى
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
