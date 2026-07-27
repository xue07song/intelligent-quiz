import request from '@/utils/request';

// 1. 查询所有题目 (GET)
export const getQuestions = () => {
    return request.get('/questions');
};

// 2. 新增题目 (POST)
export const addQuestion = (data) => {
    return request.post('/questions', data);
};

// 3. 修改题目 (PUT)
export const updateQuestion = (id, data) => {
    return request.put(`/questions/${id}`, data);
};

// 4. 删除题目 (DELETE)
export const deleteQuestion = (id) => {
    return request.delete(`/questions/${id}`);
};

// 5. 根据ID查询单个题目 (GET)
export const getQuestionById = (id) => {
    return request.get(`/questions/${id}`);
};