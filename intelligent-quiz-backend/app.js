const express = require('express');
const cors = require('cors');
const pool = require('./db'); // 引入数据库连接池

const app = express();
const port = process.env.PORT || 3000;

// ---------- 配置中间件 ----------
app.use(cors());          // 允许跨域请求
app.use(express.json());  // 解析请求体中的 JSON 数据

// ==========================================
// 1. 新增题目 (CREATE)
// 请求方式: POST
// 路径: /questions
// ==========================================
app.post('/questions', async (req, res) => {
    // 注意：req.body 里现在接收的是中文字段名
    const { id, 章节, 题型, 序号, 题目, 选项, 答案, 解析, 难度, 知识点, 使用频度, 出题人 } = req.body;
    
    if (!id || !题目) {
        return res.status(400).json({ error: 'ID和题目内容不能为空' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO `题库1` (id, 章节, 题型, 序号, 题目, 选项, 答案, 解析, 难度, 知识点, 使用频度, 出题人) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, 章节, 题型, 序号, 题目, 选项, 答案, 解析, 难度, 知识点, 使用频度, 出题人]
        );
        res.status(201).json({ id: id, message: '✅ 题目创建成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器内部错误，创建失败' });
    }
});

// ==========================================
// 2. 查询所有题目 (READ ALL)
// 请求方式: GET
// 路径: /questions
// ==========================================
app.get('/questions', async (req, res) => {
    try {
        // 按 id 倒序排列，最新的在前面
        const [rows] = await pool.query('SELECT * FROM `题库1` ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器内部错误，查询失败' });
    }
});

// ==========================================
// 3. 查询单条题目 (READ ONE)
// 请求方式: GET
// 路径: /questions/:id
// ==========================================
app.get('/questions/:id', async (req, res) => {
    const { id } = req.params;
    if (!id || typeof id !== 'string' || id.trim() === '') {
        return res.status(400).json({ error: '无效的ID格式' });
    }
    try {
        const [rows] = await pool.query('SELECT * FROM `题库1` WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: '❌ 题目不存在' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器内部错误，查询失败' });
    }
});

// ==========================================
// 4. 修改题目 (UPDATE)
// 请求方式: PUT
// 路径: /questions/:id
// ==========================================
app.put('/questions/:id', async (req, res) => {
    const { id } = req.params;
    const { 章节, 题型, 序号, 题目, 选项, 答案, 解析, 难度, 知识点, 使用频度, 出题人 } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE `题库1` SET 章节=?, 题型=?, 序号=?, 题目=?, 选项=?, 答案=?, 解析=?, 难度=?, 知识点=?, 使用频度=?, 出题人=? WHERE id=?',
            [章节, 题型, 序号, 题目, 选项, 答案, 解析, 难度, 知识点, 使用频度, 出题人, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '❌ 题目不存在，更新失败' });
        }
        res.json({ message: '✅ 更新成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器内部错误，更新失败' });
    }
});

// ==========================================
// 5. 删除题目 (DELETE)
// 请求方式: DELETE
// 路径: /questions/:id
// ==========================================
app.delete('/questions/:id', async (req, res) => {
    const { id } = req.params;
    if (!id || typeof id !== 'string' || id.trim() === '') {
        return res.status(400).json({ error: '无效的ID格式' });
    }
    try {
        const [result] = await pool.query('DELETE FROM `题库1` WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '❌ 题目不存在，删除失败' });
        }
        res.json({ message: '✅ 删除成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器内部错误，删除失败' });
    }
});

// ---------- 启动服务 ----------
app.listen(port, () => {
    console.log(`🚀 智能题库后端服务已启动！`);
    console.log(`📍 监听地址: http://localhost:${port}`);
    console.log(`📋 测试接口示例: GET http://localhost:${port}/questions`);
});