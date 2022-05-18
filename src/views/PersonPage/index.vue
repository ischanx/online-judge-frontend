<template>
  <div class="profile">

    <div class="account">
      <div class="avatar">
        <a-avatar :size="72">
          {{ username }}
        </a-avatar>
      </div>
      <p class="name">{{ username }}</p>
      <p class="loginTime">上次登录时间：{{ parseTimestamp(res.loginTime)  || ''}}</p>
    </div>
    <div id="problemSubmitDay"></div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/store';
import { onMounted, ref } from 'vue';
import { getProfile } from '@/api/user';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { LabelLayout } from 'echarts/features';
import  router from '@/router';
import { parseTimestamp } from '@/utils/parser';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
  LabelLayout,
  GridComponent,
  LineChart,
]);
const globalStore = useGlobalStore();

const res = ref({});
const username = ref('');
onMounted(async()=>{
  username.value = router.currentRoute.value.params.username || globalStore.user.username;
  res.value = await getProfile(username.value);
  await getProblemSubmitDay();
});

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
  console.log(res.value);
  res.value.submissions.forEach((item) => {
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
</script>

<style scoped lang="less">
.profile{
  margin: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  .account{
    display: flex;
    flex-direction: column;
    align-items: center;
    .avatar{
      height: 72px;
      width: 72px;
      margin: 0;
    }
    .name{
      margin-top: 16px;
      font-size: 16px;
    }
    .loginTime{
      font-size: 12px;
    }
  }

  #problemSubmitDay{
    height: 300px;
    width: 80vw;
  }
}
</style>