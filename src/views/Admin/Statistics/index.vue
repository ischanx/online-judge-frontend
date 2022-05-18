<script setup lang="ts">
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { PieChart, BarChart, LineChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, reactive, ref } from 'vue';
import { getGlobalSubmissionList, getProblemList } from '@/api/problem';
import 'ant-design-vue/es/message/style/index.css';
import message from 'ant-design-vue/es/message';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
  BarChart,
  GridComponent,
  LineChart,
]);

onMounted(async () => {
  getGlobalSubmission();
  getProblemSubmission();
  getProblemSubmitDay();
});

const getGlobalSubmission = async () => {
  const res = await getGlobalSubmissionList();
  let errCount = 0;
  const all = res.length;
  res.forEach((item) => {
    if (item.result.error) errCount++;
  });
  const chartDom = document.getElementById('globalSubmit');
  const myChart = echarts.init(chartDom);
  const option = reactive({
    title: {
      text: '全站提交记录',
      subtext: `共提交${all}次`,
      left: 'left',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'right',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          {
            value: errCount,
            name: '错误' + ((100 * errCount) / all).toFixed(1) + '%',
            itemStyle: { color: '#ee4f4c' },
          },
          {
            value: all - errCount,
            name: '正确' + ((100 * (all - errCount)) / all).toFixed(1) + '%',
            itemStyle: { color: '#42b583' },
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  });
  option && myChart.setOption(option);
};

const getProblemSubmission = async () => {
  const res = await getProblemList();
  const problemIds = reactive([]);
  const error = reactive([]);
  const success = reactive([]);
  res.list.reverse().forEach((item) => {
    problemIds.push(item.id);
    error.push(item.errorSubmit || 0);
    success.push((item.totalSubmit || 0) - (item.errorSubmit || 0));
  });
  const chartDom = document.getElementById('problemSubmit');
  const myChart = echarts.init(chartDom);

  const option = reactive({
    title: {
      text: '各题目提交记录',
      left: 'left',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
      },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: problemIds,
    },
    series: [
      {
        name: '错误次数',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        itemStyle: {
          color: '#ee4f4c',
        },
        data: error,
      },
      {
        name: '正确次数',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        itemStyle: {
          color: '#42b583',
        },
        data: success,
      },
    ],
  });
  option && myChart.setOption(option);
};

const getProblemSubmitDay = async (id: number) => {
  const chartDom = document.getElementById('problemSubmitDay');
  const myChart = echarts.init(chartDom);
  let option;
  const t = new Date();
  const day = 86400000;
  t.setHours(0);
  t.setMinutes(0);
  t.setSeconds(0);
  const dateArr = [];
  const timeArr = [];
  const dataArr = [0, 0, 0, 0, 0, 0, 0];
  const errArr = [0, 0, 0, 0, 0, 0, 0];
  const acArr = [0, 0, 0, 0, 0, 0, 0];
  for (let i = 6; i >= 0; i--) {
    const time = new Date(t.getTime() - i * day);
    dateArr.push(time.toLocaleDateString());
    timeArr.push(time.getTime());
  }
  const res = await getGlobalSubmissionList();
  res.forEach((item) => {
    if (id && item.problemId !== id) return;
    if (item.createTime < timeArr[0] || item.createTime > timeArr[6] + day) return;
    for (let i = 6; i >= 0; i--) {
      if (item.createTime > timeArr[i]) {
        dataArr[i]++;
        if(item.result){
          if (item.result.error) {
            errArr[i]++;
          } else acArr[i]++;
        }
        break;
      }
    }
  });
  option = {
    xAxis: {
      type: 'category',
      data: dateArr,
    },
    yAxis: {
      type: 'value',
    },
    legend: {
      orient: 'vertical',
      left: 'right',
    },
    series: [
      {
        label: {
          show: true,
        },
        name: '提交次数',
        data: dataArr,
        type: 'line',
        itemStyle: { normal: { label: { show: true } } },
      },
      {
        label: {
          show: true,
        },
        name: '错误次数',
        data: errArr,
        type: 'line',
        itemStyle: { normal: { label: { show: true }, color: '#ee4f4c' } },
      },
      {
        label: {
          show: true,
        },
        name: '正确次数',
        data: acArr,
        type: 'line',
        itemStyle: { normal: { label: { show: true }, color: '#42b583' } },
      },
    ],
  };

  option && myChart.setOption(option);
};
const searchProblemId = ref('');
const searchProblemSubmitDay = async () => {
  const id = Number(searchProblemId.value);
  if (Number.isNaN(id) || id <= 0) {
    message.error('请输入合法的题目编号');
    searchProblemId.value = '';
    return;
  }
  await getProblemSubmitDay(id);
};
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <a-breadcrumb style="margin-bottom: 16px">
      <a-breadcrumb-item>管理员设置</a-breadcrumb-item>
      <a-breadcrumb-item>数据统计</a-breadcrumb-item>
    </a-breadcrumb>
    <div id="globalSubmit" style="height: 400px; width: 400px"></div>
    <div id="problemSubmit" style="height: 400px; width: 100%; overflow: auto"></div>
    <div style="display: flex; align-items: center; margin-top: 16px">
      <span style="font-weight: 700; font-size: 18px">近一周题目提交次数(默认为全站)</span>
      <a-input-search
        v-model:value="searchProblemId"
        placeholder="输入题目编号查询"
        style="width: 200px; margin-left: 32px"
        @search="searchProblemSubmitDay"
      />
    </div>

    <div id="problemSubmitDay" style="height: 400px; width: 100%; overflow: auto"></div>
    <div id="userLoginDay" style="height: 400px; width: 100%; overflow: auto"></div>
  </div>
</template>

<style scoped></style>
