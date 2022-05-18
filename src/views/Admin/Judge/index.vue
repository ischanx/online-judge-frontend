<template>
  <div class="admin-settings">
    <div class="judge-add">
      <a-input v-model:value="newJudgeURL" placeholder="请输入评测机地址如http://127.0.0.1:9001"></a-input>
      <a-button type="primary" @click="handleAddJudge">添加评测机</a-button>
    </div>
    <div v-if="list.length" class="judge-show">
      <div v-for="item in list" :key="item.createTime" class="judge-item">
        <p>评测版本：{{ item.judge_version }}</p>
        <p>评测地址：{{ item.judgeURL }}</p>
        <p>
          状态：<a-tag :color="item.active ? 'blue' : 'red'">{{ item.active ? '正在分配' : '停止分配' }}</a-tag>
        </p>
        <p>主机名：{{ item.hostname }}</p>
        <p>CPU：{{ item.cpu_model }} * {{ item.cpu_core }}</p>
        <p>内存：{{ (item.memory_total / 1024 / 1024).toFixed(3) }} MB</p>
        <div class="btn-groups">
          <a-button :type="!item.active ? 'primary' : ''" size="small" @click="changeStatus(item)">
            {{ !item.active ? '开始分配任务' : '停止分配任务' }}
          </a-button>
          <a-popconfirm
            title="是否确认删除该评测机？"
            ok-text="确认"
            cancel-text="取消"
            @confirm="handleRemoveJudge(item)"
          >
            <a-button type="danger" size="small">删除</a-button>
          </a-popconfirm>
        </div>
      </div>
    </div>
    <div v-else style="display: flex;flex-grow: 1;justify-content: center;align-items: center;height: 300px">
      <a-empty  description="还没有添加评测机" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { addJudge, getJudgeList, removeJudge, updateJudge } from '@/api/judge';
import { onMounted, ref } from 'vue';
import { parseTime } from '@/utils/parser';

const newJudgeURL = ref('');
const list = ref([]);
const fetchJudgeList = async () => {
  const res = await getJudgeList();
  list.value = res;
};
onMounted(() => {
  fetchJudgeList();
});

const changeStatus = async (item: any) => {
  await updateJudge(item._id, {
    active: !item.active,
  });
  await fetchJudgeList();
};

const handleAddJudge = async () => {
  const res = await addJudge(newJudgeURL.value);
  await fetchJudgeList();
};

const handleRemoveJudge = async (item: any) => {
  const res = await removeJudge(item._id);
  await fetchJudgeList();
};
</script>

<style scoped lang="less">
.admin-settings {
  .judge-add {
    width: 80%;
    display: flex;
    margin-left: 8px;
  }
  .judge-show {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    .judge-item {
      max-width: 300px;
      margin: 16px 8px;
      padding: 20px 16px;
      background-color: #fff;
      border-radius: 3px;
    }
    .btn-groups {
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>
