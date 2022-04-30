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
let timer: number;
const updateTime = () => {
  nowTime.value = Date.now();
  timer = window.setTimeout(updateTime, 1000);
};
onMounted(() => {
  updateTime();
});
onBeforeUnmount(() => {
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
  else return Math.floor((100 * done) / length);
});

const fetchRank = async () => {
  const res: any = await getContestRankById(contestId.value);
  res.sort((a: any, b: any) => {
    if (a.totalSolved === b.totalSolved) {
      return a.totalTime - b.totalTime;
    } else return b.totalSolved - a.totalSolved;
  });
  let problemNum = 0;
  res.forEach((item) => {
    const t = {};
    problemNum = Math.max(item.list.length, problemNum);
    item.list.forEach((val: any, index: any) => {
      t[index] = val;
    });
    item.list = t;
  });
  console.log(res);
  for (let i = 0; i < problemNum; i++) {
    columns2[columns2.length - 1].children.push({
      title: String(i + 1),
      key: 'problemData',
      dataIndex: String(i),
      width: 80,
      align: 'center',
    });
  }

  rankList.value = res;
};

const columns = [
  {
    title: '题目',
    dataIndex: 'id',
    key: 'id',
  },
  // {
  //   title: '分数',
  //   dataIndex: 'score',
  //   key: 'score',
  // },
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
    title: '排名',
    key: 'rank',
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'userId',
    key: 'userId',
    align: 'center',
  },
  {
    title: '用时',
    dataIndex: 'totalTime',
    key: 'totalTime',
    align: 'center',
  },
  // {
  //   title: '分数',
  //   dataIndex: 'totalScore',
  //   key: 'totalScore',
  //   align: 'center'
  // },
  {
    title: '已解决',
    dataIndex: 'totalSolved',
    key: 'totalSolved',
    align: 'center',
  },
  {
    title: '错误',
    dataIndex: 'totalWrong',
    key: 'totalWrong',
    align: 'center',
  },
  {
    title: '题目',
    dataIndex: 'list',
    children: [],
  },
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
            {{ parseRemainTime(contest.beginTime, contest.endTime).text }}
            {{ contest.endTime - nowTime > 0 ? ': 剩余' + parseTime(contest.endTime - nowTime) : '' }}
          </span>
          <span>{{ parseTimestamp(contest.endTime) }}</span>
        </div>
      </div>

      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="1" tab="题目列表">
          <a-table :columns="columns" :data-source="contest.problemList">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'id'">
                <a-button type="link" @click="(e) => handleTitleClick(e, record)">
                  {{ index + 1 }}. {{ record.title }}
                </a-button>
              </template>
              <!--              <template v-else-if="column.key === 'score'">-->
              <!--                <span>-->
              <!--                  {{ record.score }}-->
              <!--                </span>-->
              <!--              </template>-->
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="榜单">
          <a-table :columns="columns2" :data-source="rankList" bordered row-class-name="rank-row">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'rank'">
                <span>{{ index + 1 }}</span>
              </template>
              <template v-else-if="column.key === 'userId'">
                <span>{{ record.username || '某位用户' }}</span>
              </template>
              <template v-else-if="column.key === 'totalTime'">
                <span>
                  {{ parseTime(record.totalTime) }}
                </span>
              </template>
              <template v-else-if="column.key === 'number'">
                <span>
                  {{ column }}
                </span>
              </template>
              <template v-else-if="column.key === 'problemData'">
                <div
                  :class="[
                    'rank-problem',
                    record.list[column.dataIndex].pass
                      ? 'rank-problem-success'
                      : record.list[column.dataIndex].wrongCount
                        ? 'rank-problem-fail'
                        : '',
                  ]"
                >
                  <span v-if="record.list[column.dataIndex].pass" class="time">
                    {{ parseTime(record.list[column.dataIndex].solvedTime) }}
                  </span>
                  <span v-if="record.list[column.dataIndex].wrongCount" class="wrong">
                    (-{{ record.list[column.dataIndex].wrongCount }})
                  </span>
                </div>
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

.rank-problem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  height: 100%;
  .wrong {
    font-size: 10px;
  }
  .time {
    font-size: 12px;
    font-weight: 700;
  }
}
.rank-problem-success {
  background-color: #06a11d;
  color: white;
}
.rank-problem-fail {
  background-color: #ffdddd;
}
</style>
<style>
.rank-row .ant-table-cell {
  padding: 0 !important;
  height: 60px;
}
</style>
