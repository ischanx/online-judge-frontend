<script setup lang="ts">
import { getGlobalSubmissionList } from '@/api/problem';
import { onBeforeMount, ref } from 'vue';
import SubmitList from '@/components/SubmitList/index.vue';
const list = ref([]);
const fetchGlobalSubmitList = async() => {
  const res = await getGlobalSubmissionList();
  console.log(res);
  list.value = res;
};

onBeforeMount(()=>{
  fetchGlobalSubmitList();
});

const columns = [
  {
    title: '用户',
    dataIndex: 'uid',
    key: 'userId',
    align: 'center',
  },
  {
    title: '题目编号',
    dataIndex: 'problemId',
    key: 'problemId',
    align: 'center',
    sorter: {
      compare: (a:any, b:any) => (a?.problemId || 0) - (b?.problemId || 0),
    },
  },
  {
    title: '提交结果',
    dataIndex: 'problemId',
    key: 'message',
    align: 'center',
  },
  {
    title: '耗时',
    dataIndex: 'problemId',
    key: 'time',
    align: 'center',
    sorter: {
      compare: (a:any, b:any) => (a?.result?.time || 0) - (b?.result?.time || 0),
    },
  },
  {
    title: '内存',
    dataIndex: 'problemId',
    key: 'memory',
    align: 'center',
    sorter: {
      compare: (a:any, b:any) => (a?.result?.memory || 0) - (b?.result?.memory || 0),
    },
  },
  {
    title: '语言',
    dataIndex: 'lang',
    key: 'lang',
    align: 'center',
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    sorter: {
      compare: (a:any, b:any) => (a.createTime || 0) - (b.createTime || 0),
    },
  },
];
</script>

<template>
  <a-row type="flex" justify="center" >
    <a-col :xs="23" :sm="23" :md="20" :lg="18" :xl="18">
      <h1 class="title">Status</h1>
      <SubmitList :list="list" :columns="columns"/>
    </a-col>
  </a-row>

</template>

<style scoped lang="less">
.title {
  font-size: 30px;
  margin: 16px 0;
}
</style>
