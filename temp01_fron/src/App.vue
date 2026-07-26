<template>
  <div id="app" style="padding: 20px; max-width: 1400px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <!-- 头部 -->
    <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h1 style="color: #2c3e50; margin: 0;">📚 智能题库管理系统</h1>
      <button @click="openAddDialog" class="btn-primary">+ 新增题目</button>
    </header>

    <!-- 表格 -->
    <div style="background: #fff; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); overflow-x: auto; padding: 10px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; min-width: 1200px;">
        <thead>
          <tr style="background: #f5f7fa; border-bottom: 2px solid #e4e7ed;">
            <th style="padding: 12px 8px; text-align: left; white-space: nowrap;">ID</th>
            <th style="padding: 12px 8px; text-align: left; white-space: nowrap;">章节</th>
            <th style="padding: 12px 8px; text-align: left; white-space: nowrap;">题型</th>
            <th style="padding: 12px 8px; text-align: left; white-space: nowrap;">序号</th>
            <th style="padding: 12px 8px; text-align: left; white-space: nowrap;">题目内容</th>
            <th style="padding: 12px 8px; text-align: left; white-space: nowrap;">选项</th>
            <th style="padding: 12px 8px; text-align: left; white-space: nowrap;">答案</th>
            <th style="padding: 12px 8px; text-align: left; white-space: nowrap;">解析</th>
            <th style="padding: 12px 8px; text-align: left; white-space: nowrap;">难度</th>
            <th style="padding: 12px 8px; text-align: left; white-space: nowrap;">知识点</th>
            <th style="padding: 12px 8px; text-align: left; white-space: nowrap;">使用频率</th>
            <th style="padding: 12px 8px; text-align: left; white-space: nowrap;">出题人</th>
            <th style="padding: 12px 8px; text-align: center; white-space: nowrap;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id" style="border-bottom: 1px solid #ebeef5;">
            <td style="padding: 10px 8px;">{{ item.id }}</td>
            <td style="padding: 10px 8px;">{{ item.章节 }}</td>
            <td style="padding: 10px 8px;">{{ getTypeName(item.题型) }}</td>
            <td style="padding: 10px 8px;">{{ item.序号 }}</td>
            <td style="padding: 10px 8px; max-width: 200px; word-break: break-word;">{{ item.题目 }}</td>
            <td style="padding: 10px 8px; max-width: 150px; word-break: break-word;">{{ item.选项 }}</td>
            <td style="padding: 10px 8px;">{{ item.答案 }}</td>
            <td style="padding: 10px 8px; max-width: 120px; word-break: break-word;">{{ item.解析 }}</td>
            <td style="padding: 10px 8px;">{{ item.难度 }}</td>
            <td style="padding: 10px 8px; max-width: 120px; word-break: break-word;">{{ item.知识点 }}</td>
            <td style="padding: 10px 8px;">{{ item.使用频率 }}</td>
            <td style="padding: 10px 8px;">{{ item.出题人 }}</td>
            <td style="padding: 10px 8px; text-align: center; white-space: nowrap;">
              <button @click="openViewDialog(item)" class="btn-view">查看</button>
              <button @click="openEditDialog(item)" class="btn-edit">编辑</button>
              <button @click="handleDelete(item.id)" class="btn-delete">删除</button>
            </td>
          </tr>
          <tr v-if="list.length === 0">
            <td colspan="13" style="text-align: center; padding: 30px 0; color: #909399;">暂无数据，请新增</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ========== 新增/编辑 弹窗 ========== -->
    <div v-if="dialogVisible" class="modal-overlay" @click.self="dialogVisible = false">
      <div class="modal-content" style="max-width: 700px;">
        <h2 style="margin-top: 0;">{{ dialogType === 'add' ? '📝 新增题目' : '✏️ 编辑题目' }}</h2>
        <form @submit.prevent="submitForm">
          <!-- 按照图示顺序排列 -->
          <div class="form-row">
            <div class="form-group"><label>ID *</label><input v-model="form.id" class="input" placeholder="如 Q001" :disabled="dialogType === 'edit'" /></div>
            <div class="form-group"><label>章节</label><input v-model.number="form.章节" type="number" class="input" placeholder="数字" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>题型 *</label>
              <select v-model="form.题型" class="input">
                <option v-for="(name, key) in typeMap" :key="key" :value="parseInt(key)">{{ name }}</option>
              </select>
            </div>
            <div class="form-group"><label>序号</label><input v-model.number="form.序号" type="number" class="input" placeholder="数字" /></div>
          </div>
          <div class="form-group"><label>题目内容 *</label><input v-model="form.题目" class="input" placeholder="请输入题目" /></div>
          <div class="form-group"><label>选项 (请将ABCD全部填在此处，建议用分隔符)</label>
            <textarea v-model="form.选项" rows="3" class="input" placeholder="例如：A.北京 B.上海 C.广州 D.深圳"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group"><label>答案</label><input v-model="form.答案" class="input" placeholder="如 A" /></div>
            <div class="form-group"><label>解析</label><input v-model="form.解析" class="input" placeholder="解析内容" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>难度</label><input v-model="form.难度" class="input" placeholder="如 1-5" /></div>
            <div class="form-group"><label>知识点</label><input v-model="form.知识点" class="input" placeholder="知识点" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>使用频率</label><input v-model="form.使用频率" class="input" placeholder="如 0" /></div>
            <div class="form-group"><label>出题人</label><input v-model="form.出题人" class="input" placeholder="姓名" /></div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
            <button type="button" @click="dialogVisible = false" class="btn-cancel">取消</button>
            <button type="submit" class="btn-primary">{{ dialogType === 'add' ? '确认新增' : '确认修改' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========== 查看详情 弹窗（只读） ========== -->
    <div v-if="viewVisible" class="modal-overlay" @click.self="viewVisible = false">
      <div class="modal-content" style="max-width: 700px;">
        <h2 style="margin-top: 0;">📄 题目详情</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div><strong>ID</strong>：{{ viewData.id }}</div>
          <div><strong>章节</strong>：{{ viewData.章节 }}</div>
          <div><strong>题型</strong>：{{ getTypeName(viewData.题型) }}</div>
          <div><strong>序号</strong>：{{ viewData.序号 }}</div>
          <div style="grid-column: 1 / -1;"><strong>题目内容</strong>：{{ viewData.题目 }}</div>
          <div style="grid-column: 1 / -1;"><strong>选项</strong>：{{ viewData.选项 }}</div>
          <div><strong>答案</strong>：{{ viewData.答案 }}</div>
          <div><strong>解析</strong>：{{ viewData.解析 }}</div>
          <div><strong>难度</strong>：{{ viewData.难度 }}</div>
          <div><strong>知识点</strong>：{{ viewData.知识点 }}</div>
          <div><strong>使用频率</strong>：{{ viewData.使用频率 }}</div>
          <div><strong>出题人</strong>：{{ viewData.出题人 }}</div>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
          <button @click="viewVisible = false" class="btn-cancel">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getQuestions, addQuestion, updateQuestion, deleteQuestion } from '@/api/question';

// 题型映射
const typeMap = {
  1: '判断题',
  2: '单选题',
  3: '多选题',
  4: '填空题',
  5: '简答题',
  6: '程序论述题'
};
const getTypeName = (type) => typeMap[type] || '未知';

// ----- 数据状态 -----
const list = ref([]);
const dialogVisible = ref(false);
const dialogType = ref('add');   // 'add' 或 'edit'
const viewVisible = ref(false);
const viewData = ref({});
const editId = ref(null);

// 表单初始值（字段顺序与图示一致）
const defaultForm = {
  id: '',
  章节: '',
  题型: 2,      // 默认单选题
  序号: 0,
  题目: '',
  选项: '',
  答案: '',
  解析: '',
  难度: '',
  知识点: '',
  使用频率: '',
  出题人: ''
};
const form = ref({ ...defaultForm });

// ----- 加载数据 -----
const loadData = async () => {
  try {
    const res = await getQuestions();
    list.value = res.data;
  } catch (error) {
    alert('❌ 加载数据失败，请检查后端是否启动');
    console.error(error);
  }
};

// ----- 新增 -----
const openAddDialog = () => {
  dialogType.value = 'add';
  form.value = { ...defaultForm, id: generateId() };
  editId.value = null;
  dialogVisible.value = true;
};
// 简单生成ID（防止重复，但用户可改）
const generateId = () => {
  const maxId = list.value.reduce((max, item) => {
    const num = parseInt(item.id.replace(/\D/g,''), 10);
    return num > max ? num : max;
  }, 0);
  return `Q${String(maxId + 1).padStart(3, '0')}`;
};

// ----- 编辑 -----
const openEditDialog = (item) => {
  dialogType.value = 'edit';
  form.value = { ...item };
  editId.value = item.id;
  dialogVisible.value = true;
};

// ----- 查看详情 -----
const openViewDialog = (item) => {
  viewData.value = { ...item };
  viewVisible.value = true;
};

// ----- 提交表单（新增/编辑） -----
const submitForm = async () => {
  if (!form.value.id || !form.value.题目) {
    alert('ID 和 题目内容不能为空');
    return;
  }
  // 如果章节、序号为空，补0
  if (form.value.章节 === '' || form.value.章节 === null) form.value.章节 = 0;
  if (form.value.序号 === '' || form.value.序号 === null) form.value.序号 = 0;

  try {
    if (dialogType.value === 'add') {
      await addQuestion(form.value);
      alert('✅ 新增成功');
    } else {
      await updateQuestion(editId.value, form.value);
      alert('✅ 修改成功');
    }
    dialogVisible.value = false;
    await loadData();
  } catch (error) {
    alert('❌ 操作失败，请检查控制台错误');
    console.error(error);
  }
};

// ----- 删除 -----
const handleDelete = async (id) => {
  if (!confirm('确定要删除该题目吗？')) return;
  try {
    await deleteQuestion(id);
    alert('✅ 删除成功');
    await loadData();
  } catch (error) {
    alert('❌ 删除失败');
    console.error(error);
  }
};

// ----- 生命周期 -----
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* 全局样式 */
body { margin: 0; background: #f0f2f5; }
#app { background: #f0f2f5; min-height: 100vh; }

/* 按钮 */
.btn-primary {
  background: #409EFF;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  transition: background 0.2s;
}
.btn-primary:hover { background: #66b1ff; }

.btn-view {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
  padding: 4px 10px;
  border-radius: 4px;
  margin-right: 4px;
}
.btn-view:hover { background: #bae7ff; }

.btn-edit {
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
  padding: 4px 10px;
  border-radius: 4px;
  margin-right: 4px;
}
.btn-edit:hover { background: #ffe7ba; }

.btn-delete {
  background: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffa39e;
  padding: 4px 10px;
  border-radius: 4px;
}
.btn-delete:hover { background: #ffccc7; }

.btn-cancel {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
  padding: 8px 20px;
  border-radius: 4px;
}
.btn-cancel:hover { background: #e8e8e8; }

/* 表单 */
.input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  background: white;
}
.input:focus {
  outline: none;
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
select.input {
  appearance: auto;
  height: 38px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 12px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 13px;
  color: #606266;
}

/* 弹窗遮罩 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 30px 35px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

/* 表格响应式 */
@media (max-width: 768px) {
  .form-row { grid-template-columns: 1fr; gap: 8px; }
  .modal-content { padding: 20px; }
}
</style>