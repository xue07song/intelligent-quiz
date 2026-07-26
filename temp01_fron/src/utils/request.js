import axios from 'axios';

// 创建 Axios 实例（配置好后端地址）
const instance = axios.create({
    baseURL: 'http://localhost:3000', // 指向你昨天启动的 Express 后端
    timeout: 10000,                  // 10秒超时
});

export default instance;