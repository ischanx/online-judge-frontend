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
    title: '竞赛',
    dataIndex: 'id',
    key: 'id',
  },

  {
    title: '开始时间',
    dataIndex: 'beginTime',
    key: 'beginTime',
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
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
