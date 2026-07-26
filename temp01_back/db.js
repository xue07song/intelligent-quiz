// 引入 mysql2 的 promise 版本（支持 async/await）
const mysql = require('mysql2/promise');
// 引入 dotenv 读取 .env 文件中的配置
require('dotenv').config();

// 👇 调试日志：打印后端读取到的数据库名
console.log('🔥 当前后端读取的数据库名是:', process.env.DB_NAME);

// 创建连接池（只声明一次！）
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 导出连接池，供 app.js 使用
module.exports = pool;