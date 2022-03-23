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
const columns = [
  {
    title: '题目',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
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
const handleTitleClick = (e: PointerEvent,item: Problem) => {
  jumpToProblemPage(item.id);
};
</script>

<template>
  <a-row justify="center">
    <a-col :xs="23" :sm="23" :md="20" :lg="18" :xl="18">
      <h1 class="title">Problems</h1>
      <a-table :columns="columns" :data-source="list">
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
</style>
