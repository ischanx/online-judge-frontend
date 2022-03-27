<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { getContestById, getContestRankById } from '@/api/contest';
import { Problem } from '@/api/problem';
import { parseTime, parseTimestamp, parseRemainTime } from '@/utils/parser';

/**
 * 实时更新当前时间
 */
const nowTime = ref(0);
let timer:number;
const updateTime = () => {
  nowTime.value = Date.now();
  timer = window.setTimeout(updateTime,1000);
};
onMounted(()=>{
  updateTime();
});
onBeforeUnmount(()=>{
  clearTimeout(timer);
});

const router = useRouter();
const contestId = ref<number>(0);
const contest = ref({});
const rankList = ref({});
const fetchContest = async () => {
  const res = await getContestById(contestId.value);
  contest.value = res;
  console.log(res);
};
onBeforeMount(() => {
  contestId.value = Number(router.currentRoute.value.params.contestId);
  fetchContest();
  fetchRank();
});
const progress = computed(() => {
  const { beginTime, endTime } = contest.value as any;
  const now = nowTime.value;
  const length = endTime - beginTime;
  const done = now - beginTime;
  if (now > endTime) return 100;
  else if (now < beginTime) return 0;
  else return Math.floor(100 * done / length);
});

const fetchRank = async () => {
  const res: any = await getContestRankById(contestId.value);
  res.sort((a: any, b: any) => {
    if (a.totalSolved === b.totalSolved) {
      return a.totalTime - b.totalTime;
    } else return b.totalSolved - a.totalSolved;
  });
  // res.length && res[0].list.forEach((item,index) => {
  //   columns2[5].children.push( {
  //     title: 'Door No.',
  //     dataIndex: String(index),
  //     key: 'number',
  //   });
  // });

  rankList.value = res;
};

const columns = [
  {
    title: '题目',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '分数',
    dataIndex: 'score',
    key: 'score',
  },
];

const jumpToProblemPage = (problemNumber: number) => {
  router.push({
    name: 'ContestProblem',
    params: {
      problemNumber,
      contestId: contestId.value,
    },
  });
};
const handleTitleClick = (e: PointerEvent, item: Problem) => {
  jumpToProblemPage(contest.value.problemList.findIndex((e) => e.title === item.title) + 1);
};

const columns2 = reactive([
  {
    title: '用户',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: '时间',
    dataIndex: 'totalTime',
    key: 'totalTime',
  },
  {
    title: '分数',
    dataIndex: 'totalScore',
    key: 'totalScore',
  },
  {
    title: '已解决',
    dataIndex: 'totalSolved',
    key: 'totalSolved',
  },
  {
    title: '错误次数',
    dataIndex: 'totalWrong',
    key: 'totalWrong',
  },
  // {
  //   title: '题目',
  //   children:[],
  // },
]);
const activeKey = ref('1');

</script>

<template>
  <a-row justify="center">
    <a-col :xs="23" :sm="23" :md="20" :lg="18" :xl="18">
      <div class="contest-info">
        <div class="title">{{ '#' + contestId }} {{ contest.title }}</div>
        <p class="description">{{ contest.description }}</p>
        <a-progress :percent="progress" style="width: 100%" />
        <div class="time">
          <span>{{ parseTimestamp(contest.beginTime) }}</span>
          <span class="status" :style="{ color: parseRemainTime(contest.beginTime, contest.endTime).color }">
            {{parseRemainTime(contest.beginTime, contest.endTime).text }}
            {{ contest.endTime - nowTime > 0 ? (': 剩余' + parseTime(contest.endTime - nowTime)) : '' }}
          </span>
          <span>{{ parseTimestamp(contest.endTime) }}</span>
        </div>
      </div>

      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="1" tab="题目列表">
          <a-table :columns="columns" :data-source="contest.problemList">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'id'">
                <a-button type="link" @click="(e) => handleTitleClick(e, record)">
                  {{ record.title }}
                </a-button>
              </template>
              <template v-else-if="column.key === 'score'">
                <span>
                  {{ record.score }}
                </span>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="榜单">
          <a-table :columns="columns2" :data-source="rankList">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'userId'">
                <span>{{ record.userId }}</span>
              </template>
              <template v-else-if="column.key === 'totalTime'">
                <span>
                  {{ record.totalTime / 1000 + '秒' }}
                </span>
              </template>
              <template v-else-if="column.key === 'number'">
                <span>
                  {{ column }}
                </span>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
</template>

<style scoped lang="less">
.contest-info {
  margin: 24px 0;
  padding: 16px 32px;
  background-color: #fff;
  .title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 500;
  }

  .description {
    text-align: center;
    font-size: 14px;
  }
  .time {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .status {
      font-weight: 600;
    }
  }
}
</style>
