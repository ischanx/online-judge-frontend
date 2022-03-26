<script setup lang="ts">

const props = defineProps({
  list: Array
});

const columns = [
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
  },
  {
    title: '内存',
    dataIndex: 'problemId',
    key: 'memory',
    align: 'center',
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
  },
];

</script>

<template>
  <div>
    <a-table :columns="columns" :data-source="list" class="submit-list">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'message'">
          <span v-if="record.result.error" class="result-error">
            {{ record.result.error }}
          </span>
          <span v-else class="result-right">
            {{ record.result.message }}
          </span>

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