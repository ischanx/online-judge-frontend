<template>
  <div class="rank">

    <div style="width: 80%">
      <h1 class="title">Rank</h1>
      <a-table :columns="columns" :data-source="data">
        <template #bodyCell="{ record, column }">
          <template v-if="column.key === 'username'">
            <a @click="handleUserClick(record.username)">
              {{ record.username || '不知名的用户' }}
            </a>
          </template>
        </template>
      </a-table>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getUserRank } from '@/api/user';
import router from '@/router';

onMounted(async()=>{
  const res = await getUserRank();
  console.log(res);

  data.value = computePercent(res.list) || [];
});

const computePercent = (arr: any[]) => {
  return arr.map((item,index) => {
    item.rank = `${index + 1}`;
    if(item.totalSubmit){
      item.percent = (100*(item.successSubmit || 0)/ item.totalSubmit).toFixed(2);
    }
    return item;
  });
};
const columns = [
  {
    title: '排名',
    dataIndex: 'rank',
    sorter: {
      compare: (a:any, b:any) => (a.rank || 0) - (b.rank || 0),
    },
    align: 'center',
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    align: 'center',
  },
  {
    title: '总提交',
    dataIndex: 'totalSubmit',
    sorter: {
      compare: (a:any, b:any) => (a.totalSubmit || 0) - (b.totalSubmit || 0),
    },
    align: 'center',
  },
  {
    title: '通过提交',
    dataIndex: 'successSubmit',
    sorter: {
      compare: (a:any, b:any) => (a.successSubmit || 0) - (b.successSubmit || 0),
    },
  },
  {
    title: '错误提交',
    dataIndex: 'errorSubmit',
    sorter: {
      compare: (a:any, b:any) => (a.errorSubmit || 0) - (b.errorSubmit || 0),
    },
    align: 'center',
  },
  {
    title: '通过率',
    dataIndex: 'percent',
    sorter: {
      compare: (a:any, b:any) => (a.percent || 0) - (b.percent || 0),
    },
    align: 'center',
  },
];

const data = ref<any[]>([]);

const handleUserClick = (username: string) => {
  router.push({
    name: 'PersonPage',
    params:{
      username
    }
  });
};
</script>

<style scoped lang="less">
.rank{
  display: flex;
  justify-content: center;
  .title{
    font-size: 30px;
    margin: 16px 0;
  }
}
</style>