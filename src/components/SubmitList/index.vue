<script setup lang="ts">

import router from '@/router';

defineProps({
  list: Array,
  columns: Array,
});


const handleSubmissionClick = (submissionId: string) => {
  if(!router.currentRoute.value.path.includes('contest'))
    window.open(`/submission/${submissionId}`, '__blank');
};

const handleUserClick = (username: string) => {
  router.push({
    name: 'PersonPage',
    params:{
      username
    }
  });
};

const handleProblemClick = (problemId: number) => {
  router.push({ name:'Problem', params:{
    problemId
  } });
};
</script>

<template>
  <div>
    <a-table :columns="columns" :data-source="list" class="submit-list">
      <template #bodyCell="{ text, record, column }">
        <template v-if="column.key === 'userId'">
          <a @click="handleUserClick(record.username)">
            {{ record.username || '不知名的用户' }}
          </a>
        </template>
        <template v-else-if="column.key === 'message'"  >
          <a v-if="record.result.error" class="result-error" @click="handleSubmissionClick(record._id)">
            {{ record.result.error }}
          </a>
          <a v-else class="result-right" @click="handleSubmissionClick(record._id)">
            {{ record.result.message }}
          </a>
        </template>
        <template v-else-if="column.key === 'problemId'">
          <a @click="handleProblemClick(record.problemId)">
            {{ text }}
          </a>
        </template>
        <template v-else-if="column.key === 'time'">
          <span>
            {{ record.result.time !== undefined ? record.result.time : 'N/A'}}
          </span>
        </template>
        <template v-else-if="column.key === 'memory'">
          <span>
            {{ record.result.memory || 'N/A'}}
          </span>
        </template>
        <template v-else-if="column.key === 'lang'">
          <span>
            {{ record.lang || 'N/A'}}
          </span>
        </template>
        <template v-else-if="column.key === 'createTime'">
          <span>
            {{ new Date(record.createTime).toLocaleString() }}
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.result-error{
  color: red;
}
.result-right{
  color: green;
}
</style>

<style>
.submit-list .ant-table-cell{
  padding: 8px;
}
</style>