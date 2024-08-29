const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// 設置檔案存儲方式和命名規則
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // 指定檔案存儲的目錄
    },
    filename: function(req, file, cb) {
    // 生成檔名，格式為：年月日時分秒毫秒-檔案名
    const uniqueSuffix = new Date().toISOString().replace(/ [-T:\.Z]/ g, '') +'-' + file.originalname;
    cb(null, uniqueSuffix);
}
});

const upload = multer({ storage: storage });

// API 路由: 處理檔案上傳
app.post('/api/v1/upload', upload.single('file'), (req, res) =>
{
if (!req.file)
{
    return res.status(400).json({ message: '沒有檔案上傳' });
    }

    res.json({ message: '檔案上傳成功', filename: req.file.filename });
});

app.listen(5001, () =>
{
    console.log('伺服器在 http://localhost:5001 啟動');
});
