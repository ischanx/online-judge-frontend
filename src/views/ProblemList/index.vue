<script setup lang="ts">
import { onBeforeMount, reactive, toRaw } from 'vue';
import { getProblemList, Problem } from '@/api/problem';
import { useRouter } from 'vue-router';
const router = useRouter();
onBeforeMount(async () => {
  await fetchProblemList();
});
const list = reactive<Problem[]>([]);
const fetchProblemList = async () => {
  const res = await getProblemList();
  list.push(...res.list);
};
const difficultyText = ['简单', '中等', '困难'];
const columns = [
  {
    title: '题目',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '难度',
    dataIndex: 'difficulty',
    key: 'difficulty',
    align: 'center',
  },
  {
    title: '提交',
    dataIndex: 'totalSubmit',
    key: 'submitStatus',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    align: 'center',
  },
];
const jumpToProblemPage = (problemId: number) => {
  router.push({
    name: 'Problem',
    params: {
      problemId,
    },
  });
};
const handleTitleClick = (e: PointerEvent, item: Problem) => {
  jumpToProblemPage(item.id);
};


const cssStr = (error:number, total: number)=>{
  const percent = 100* (total - error)/total || 1; // 等于0时随便传一个非零值，否则样式不展示
  return 'background: linear-gradient(\n' +
      '                  to right,\n' +
      `                  rgba(225, 248, 227) ${percent}%,\n` +
      `                  rgba(255, 245, 245) ${percent}%,\n` +
      '                  rgba(255, 245, 245) 100%,\n' +
      '                  rgba(0, 0, 0, 0) 100%\n' +
      '                );';
};
</script>

<template>
  <a-row justify="center">
    <a-col :xs="23" :sm="23" :md="20" :lg="18" :xl="18">
      <h1 class="title">Problems</h1>
      <a-table :columns="columns" :data-source="list" row-class-name="problem-list-item">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'id'">
            <a-button type="link" @click="(e) => handleTitleClick(e, toRaw(record))">
              {{ record.id + ' . ' + record.title }}
            </a-button>
          </template>
          <template v-else-if="column.key === 'createTime'">
            <span>
              {{ new Date(record.createTime).toLocaleString() }}
            </span>
          </template>
          <template v-else-if="column.key === 'updateTime'">
            <span>
              {{ new Date(record.updateTime).toLocaleString() }}
            </span>
          </template>
          <template v-else-if="column.key === 'difficulty'">
            <span>
              {{ difficultyText[record.difficulty || 0] }}
            </span>
          </template>
          <template v-else-if="column.key === 'submitStatus'">
            <div
              v-show="record.totalSubmit"
              class="submitStatus"
              :style="cssStr(record.errorSubmit, record.totalSubmit)"
            >
              {{ record.errorSubmit || 0 }} / {{ record.totalSubmit || 0 }}
            </div>
          </template>
        </template>
      </a-table>
    </a-col>
  </a-row>
</template>

<style scoped lang="less">
.title {
  font-size: 30px;
  margin: 16px 0;
}
.problem-list-item {
  .submitStatus {
    height: 100%;
    line-height: 50px;
  }
}
</style>
<style>
.problem-list-item .ant-table-cell {
  padding: 0;
  height: 50px;
}
</style>
