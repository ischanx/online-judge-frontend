<script setup lang="ts">
import { onBeforeMount, reactive, toRaw } from 'vue';
import { parseRemainTime } from '@/utils/parser';
import { getContestList, Contest } from '@/api/contest';
import { useRouter } from 'vue-router';
const router = useRouter();
onBeforeMount(async () => {
  await fetchContestList();
});
const list = reactive<Contest[]>([]);
const fetchContestList = async () => {
  const res = await getContestList();
  res.sort((a,b) => b.beginTime - a.beginTime);
  list.push(...res);
};

const columns = [
  {
    title: '比赛',
    dataIndex: 'id',
    key: 'id',
    sorter: {
      compare: (a:any, b:any) => (a.id || 0) - (b.id || 0),
    },
  },

  {
    title: '开始时间',
    dataIndex: 'beginTime',
    key: 'beginTime',
    sorter: {
      compare: (a:any, b:any) => (a.beginTime || 0) - (b.beginTime || 0),
    },
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
    sorter: {
      compare: (a:any, b:any) => (a.endTime || 0) - (b.endTime || 0),
    },
  },
  {
    title: '状态',
    dataIndex: 'endTime',
    key: 'status',
  },
];
const jumpToContestPage = (contestId: number) => {
  router.push({
    name: 'Contest',
    params: {
      contestId,
    },
  });
};
const handleTitleClick = (e: PointerEvent, item: Contest) => {
  jumpToContestPage(item.id);
};


</script>

<template>
  <a-row justify="center">
    <a-col :xs="23" :sm="23" :md="20" :lg="18" :xl="18">
      <h1 class="title">Contests</h1>
      <a-table :columns="columns" :data-source="list">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'id'">
            <a-button type="link" @click="(e) => handleTitleClick(e, toRaw(record))">
              {{ record.id + ' . ' + record.title }}
            </a-button>
          </template>
          <template v-else-if="column.key === 'beginTime'">
            <span>
              {{ new Date(record.beginTime).toLocaleString() }}
            </span>
          </template>
          <template v-else-if="column.key === 'endTime'">
            <span>
              {{ new Date(record.endTime).toLocaleString() }}
            </span>
          </template>
          <template v-else-if="column.key === 'status'">
            <span>
              <a-tag :color="parseRemainTime(record.beginTime, record.endTime).color">
                {{parseRemainTime(record.beginTime, record.endTime).text }}
              </a-tag>
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
