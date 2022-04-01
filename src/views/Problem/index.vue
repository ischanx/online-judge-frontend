<script setup lang="ts">
import { useRouter } from 'vue-router';

import * as monaco from 'monaco-editor';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { getProblemById, getSubmissionById, getSubmissionList, submit } from '@/api/problem';
import { CODE_LANGUAGES, PROBLEM_TABS_KEYS } from '@/const/app';
import SubmitList from '@/components/SubmitList/index.vue';
import SubmitResult from '@/components/SubmitResult/index.vue';
import {
  getContestProblem,
  getContestSubmissionById,
  getContestSubmissionList,
  submitContestProblem,
} from '@/api/contest';
import Storage from '@/utils/storage';

/**
 * 左侧题目描述显示区
 *  Markdown-it做转换
 */
import MarkdownIt from 'markdown-it';
const problemContent = ref('');
const setProblemContent = (origin: string) => {
  const md = new MarkdownIt();
  problemContent.value = md.render(origin);
};



const router = useRouter();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new JsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new CssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new HtmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new TsWorker();
    }
    return new EditorWorker();
  },
};
let editor: monaco.editor.IStandaloneCodeEditor;
const problemId = ref(0);
const contestId = ref(0);
const problemNumber = ref(0);
onMounted(() => {
  problemId.value = Number(router.currentRoute.value.params.problemId);
  contestId.value = Number(router.currentRoute.value.params.contestId);
  problemNumber.value = Number(router.currentRoute.value.params.problemNumber);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  editor = monaco.editor.create(document.getElementById('container'), {
    // eslint-disable-next-line max-len
    value: Storage.getLocalItem(`code_${contestId.value}_${problemId.value}`) ||'// code here',
    language: 'cpp',
    theme: 'vs-dark',
    lineNumbers: 'on',
    automaticLayout: true, // auto resize
  });
  fetchProblem();
  setTimeout(()=>{
    fetchSubmitHistory();
  },1000);
  leftTabsKey.value = PROBLEM_TABS_KEYS.CONTENT;
});

onUnmounted(() => {
  Storage.setLocalItem(`code_${contestId.value}_${problemId.value}`, editor.getValue());
  editor.dispose();
});
const problem = reactive({});
const fetchProblem = async () => {
  let res = null;
  if(problemNumber.value){
    res = await getContestProblem({
      problemNumber: problemNumber.value,
      contestId: contestId.value
    }) as any;
    // todo: 功能耦合
    problemId.value = res.id;
  }else res = await getProblemById(problemId.value);
  Object.assign(problem, res);
  setProblemContent(res.content);
};

const leftTabsKey = ref(PROBLEM_TABS_KEYS.SUBMISSION);
const codeLanguage = ref(CODE_LANGUAGES.CPP);
const handleLanguageChange = (language: string) => {
  const model = monaco.editor.createModel(editor.getValue(), language);
  editor.setModel(model);
};


const submitLoading = ref(false);
const handleCodeSubmit = async () => {
  submitLoading.value = true;
  const code = editor.getValue();
  const lang = codeLanguage.value;
  if(code === '' || !problemId.value) return;
  let res: any = null;
  if(problemNumber.value){
    res = await submitContestProblem({
      code,
      problemId: problemId.value,
      lang,
      problemNumber: problemNumber.value,
      contestId: contestId.value,
    });
  }else res = await submit({
    code,
    problemId: problemId.value,
    lang
  });
  if(res.submissionId){
    setTimeout(()=>{
      fetchSubmitResult(res.submissionId);
    },0);
  }
};

const submitList = reactive([]);
const submitRes = ref({});
const fetchSubmitHistory = async () => {
  let list:any = null;
  if(problemNumber.value){
    list = await getContestSubmissionList({
      contestId: contestId.value,
      problemId: problemId.value,
    });
  }else list= await getSubmissionList(problemId.value);
  // 最晚提交放在前面
  list.sort((a: any,b:any) => b.createTime - a.createTime);
  submitList.splice(0, submitList.length);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  submitList.push(...list);
};

const fetchSubmitResult = async (id: string) => {
  let res;
  if(problemNumber.value){
    res = await getContestSubmissionById({ id });
  }else res = await getSubmissionById({ id }) as any;

  if(res.status === 'success'){
    submitRes.value = reactive(res.result);
    console.log(res.result);
    leftTabsKey.value = PROBLEM_TABS_KEYS.SUBMISSION;
    submitLoading.value = false;
    await fetchSubmitHistory();
  }else{
    setTimeout(()=>{
      fetchSubmitResult(id);
    },2000);
  }
};

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
  <div class="problem-page">
    <Splitpanes class="default-theme">
      <Pane :size="30">
        <div class="problem-page-left">
          <a-tabs v-model:activeKey="leftTabsKey" centered style="height: 100%">
            <a-tab-pane :key="PROBLEM_TABS_KEYS.CONTENT" tab="题目描述" class="container">
              <div class="title">{{ problem.id + '. ' + problem.title }}</div>
              <a-divider></a-divider>
              <div class="content" v-html="problemContent"></div>
            </a-tab-pane>
            <a-tab-pane :key="PROBLEM_TABS_KEYS.SUBMISSION" tab="提交记录" class="container">
              <SubmitResult v-if="Object.keys(submitRes).length" :result="submitRes"/>
              <SubmitList :list="submitList" :columns="columns"/>
            </a-tab-pane>
          </a-tabs>
        </div>
      </Pane>
      <Pane :size="70" style="height: 100%;min-width: 30%;">
        <div class="problem-page-right">
          <div class="tools-top">
            <a-select v-model:value="codeLanguage" size="small" style="width: 120px" @change="handleLanguageChange">
              <!--          <a-select-option :value="CODE_LANGUAGES.C">C</a-select-option>-->
              <a-select-option :value="CODE_LANGUAGES.CPP">C++</a-select-option>
            </a-select>
          </div>

          <div id="container" />
          <div class="tools-bottom">
            <a-button type="primary" :loading="submitLoading" @click="handleCodeSubmit">提交代码</a-button>
          </div>
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>


<style scoped lang="less">

.problem-page {
  //display: flex;
  //flex-direction: row;
  height: 100%;
  width: 100%;

  &-left {

    //width: 30%;
    height: 100%;
    overflow: hidden;
    border-right: 1px solid #c4c3c3;
    .container{
      padding: 0 16px 20px;
    }
    .title {
      text-align: center;
      font-size: 16px;
      font-weight: 700;
    }
    .content {
      font-size: 13px;
      ::v-deep(pre){
        white-space: pre-wrap;
        background-color: rgba(0,10,32,0.05);
        padding: 10px 15px;
        color: black;
        line-height: 1.6;
        font-size: 13px;
        border-radius: 3px;
      }
    }

  }

  &-right {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    #container {
      flex: 1;
      width: 100%;
    }
    .tools-top {
      display: flex;
      align-items: center;
      height: 32px;
      padding: 0px 20px;
    }
    .tools-bottom {
      display: flex;
      justify-content: right;
      align-items: center;
      height: 56px;
      padding: 0px 20px;
    }
  }
}
</style>

<style>
.problem-page-left .ant-tabs-content-holder,
.problem-page-left .ant-tabs-content,
.problem-page-left .ant-tabs-tabpane{
  height: 100%;
  overflow: auto;
}
</style>