<script lang="ts" setup>
import { computed, onMounted, reactive, ref, toRaw } from 'vue';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { Form, message } from 'ant-design-vue';
import 'ant-design-vue/es/message/style/index.css';
import 'vditor/dist/index.css';
import router from '@/router';
import { parseTime } from '@/utils/parser';
import { getProblemById } from '@/api/problem';
import { contestAdd, contestUpdate, getContestById } from '@/api/contest';
import dayjs from 'dayjs';
const textMap = {
  add: '新建',
  show: '查看',
  edit: '修改',
};
const contestId = ref(0);
onMounted(() => {
  const params = router.currentRoute.value.params;
  contestId.value = Number(params.contestId);
  if (params.action === 'add') {
    canEdit.value = true;
    isAdd.value = true;
  } else if (params.action === 'show') {
    canEdit.value = false;
    isAdd.value = false;
    fetchContestById(contestId.value);
  } else {
    canEdit.value = true;
    isAdd.value = false;
    fetchContestById(contestId.value);
  }
});

const fetchContestById = async (id: number) => {
  const res = await getContestById(id);
  modelRef.title = res.title;
  modelRef.description = res.description;
  modelRef.time = [dayjs(res.beginTime), dayjs(res.endTime)];
  modelRef.problems.push(...res.problemList);
  console.log(modelRef);
};
const canEdit = ref(false);
const isAdd = ref(true);
const useForm = Form.useForm;
const modelRef = reactive({
  title: '',
  description: '',
  problems: [],
  time: null,
});
const rulesRef = reactive({
  title: [
    {
      required: true,
      message: '比赛标题还未填写',
    },
  ],
  description: [
    {
      required: true,
      message: '比赛描述还未填写',
    },
  ],
  time: [
    {
      required: true,
      message: '比赛时间还未填写',
    },
  ],
  problems: [
    {
      required: true,
      message: '比赛题目还未填写',
    },
  ],
});
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
const onSubmit = () => {
  validate()
  .then(async () => {
    console.log();
    const data: any = {};
    data.title = modelRef.title;
    data.description = modelRef.description;
    data.problemList = modelRef.problems.map((item: any) => {
      item.score = 10;
      return item;
    });
    data.beginTime = new Date(modelRef!.time[0]).getTime();
    data.endTime = new Date(modelRef!.time[1]).getTime();
    await handleContestAdd(data);
  })
  .catch((err) => {
    console.log('error', err);
  });
};

const handleContestAdd = async (data: any) => {
  const res = await contestAdd(data);
  if (res.id) {
    message.success(`创建比赛成功，编号为${res.id}`);
    router.replace({ name: 'AdminContest' });
  }
};

const handleContestUpdate = async () => {
  validate()
  .then(async () => {
    console.log();
    const data: any = {};
    data.title = modelRef.title;
    data.description = modelRef.description;
    data.problemList = modelRef.problems.map((item: any) => {
      item.score = 10;
      return item;
    });
    data.beginTime = new Date(modelRef!.time[0]).getTime();
    data.endTime = new Date(modelRef!.time[1]).getTime();
    await contestUpdate(contestId.value, data);

    message.success(`修改比赛[${contestId.value}]成功`);
    router.replace({ name: 'AdminContest' });
  })
  .catch((err) => {
    console.log('error', err);
  });
};

const newProblem = reactive({
  id: '',
  title: '',
});

const hanldeProblemAdd = async () => {
  if (newProblem.id && newProblem.title) {
    const res = await getProblemById(newProblem.id);
    if (res.id === Number(newProblem.id)) {
      modelRef.problems.push(JSON.parse(JSON.stringify(newProblem)));
      newProblem.id = '';
      newProblem.title = '';
    }
  } else {
    message.error('错误');
  }
};

const handleProblemRemove = (index: number) => {
  modelRef.problems.splice(index, 1);
};

const computeDuration = computed(() => {
  if (!modelRef.time) return '';
  const endTime = new Date(modelRef.time[1]).getTime();
  const beginTime = new Date(modelRef.time[0]).getTime();
  return parseTime(endTime - beginTime);
});

const handleRouterChange = (name: string) => {
  router.push({ name });
};
</script>

<template>
  <div>
    <div style="display: flex; flex-direction: column; width: 80%">
      <a-breadcrumb style="margin-bottom: 16px">
        <a-breadcrumb-item>管理员设置</a-breadcrumb-item>
        <a-breadcrumb-item><a @click="handleRouterChange('AdminContest')">比赛管理</a></a-breadcrumb-item>
        <a-breadcrumb-item>{{ textMap[router.currentRoute.value.params.action] }}比赛</a-breadcrumb-item>
      </a-breadcrumb>
      <div>
        <a-form>
          <a-form-item label="标题" v-bind="validateInfos.title">
            <a-input v-model:value="modelRef.title" placeholder="请输入比赛标题" :disabled="!canEdit" />
          </a-form-item>
          <a-form-item label="描述" v-bind="validateInfos.description">
            <a-input v-model:value="modelRef.description" placeholder="请输入比赛描述" :disabled="!canEdit" />
          </a-form-item>
          <a-form-item label="比赛时间" v-bind="validateInfos.time">
            <a-range-picker
              v-model:value="modelRef.time"
              :disabled="!canEdit"
              :show-time="{ format: 'HH:mm' }"
              format="YYYY-MM-DD HH:mm"
              :placeholder="['开始时间', '结束时间']"
            />
            <span style="margin-left: 8px">{{ computeDuration }}</span>
          </a-form-item>
          <a-form-item label="题目列表" v-bind="validateInfos.problems">
            <div style="display: block; min-height: 32px; line-height: 32px">
              <span v-if="modelRef.problems.length === 0">无</span>
              <div v-else>
                <div v-for="(item, index) in modelRef.problems" :key="item.id">
                  <span>编号[{{ item.id }}] - {{ item.title }}</span>
                  <MinusCircleOutlined
                    v-if="canEdit"
                    style="margin-left: 32px; cursor: pointer; color: red"
                    @click="handleProblemRemove(index)"
                  />
                </div>
              </div>
            </div>
            <div v-if="canEdit" style="display: flex; margin-top: 8px">
              <a-input v-model:value="newProblem.id" placeholder="题目编号" style="width: 200px" />
              <a-input v-model:value="newProblem.title" placeholder="题目标题" style="margin: 0 16px" />
              <a-button @click="hanldeProblemAdd">添加</a-button>
            </div>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button v-if="isAdd" type="primary" :disabled="!canEdit" block @click.prevent="onSubmit"
            >新建比赛</a-button
            >
            <a-button v-else-if="canEdit" style="margin-left: 10px" @click="handleContestUpdate">修改比赛</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.sample-list {
  display: flex;
  line-height: 36px;
  border-bottom: 1px solid #eee;
  &-name {
    width: 25%;
  }
  &-size {
    width: 15%;
  }
  &-md5 {
    width: 60%;
  }
}
</style>
