<script setup lang="ts">
defineProps({
  result: Object,
});
</script>

<template>
  <div class="result-container">
    <div>
      <span class="title">执行结果：</span>
      <a-tag :color="result.pass ? 'green' : 'red'">{{ result.error || result.message }}</a-tag>
    </div>
    <div>
      <span class="title">通过用例：</span>
      <span>{{ result.totalCount ?(result.totalCorrect + '/' + result.totalCount)  : '' }}</span>
      <a-progress
        :percent="Number(result.totalCount || 0)?(100 * Number(result.totalCorrect || 0)) / Number(result.totalCount || 0) : 0"
        size="small"
        style="width: 150px"
      />
    </div>
    <div v-if="result.error" class="detail">
      {{ result.message }}
    </div>
  </div>
</template>
<style scoped lang="less">
.result-container {
  padding: 8px 16px;
  & > div {
    margin-bottom: 8px;
  }
  .title {
    font-size: 16px;
    font-weight: 700;
  }
  .detail {
    border: 1px solid #d7d7d7;
  }
}
</style>
