<script setup lang="ts">
import { useRouter } from 'vue-router';

import * as monaco from 'monaco-editor';
import { onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue';

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { getProblemById, getSubmissionById, getSubmissionList, Problem, submit } from '@/api/problem';
import { CODE_LANGUAGES, PROBLEM_TABS_KEYS } from '@/const/app';
import SubmitList from '@/components/SubmitList/index.vue';
import SubmitResult from '@/components/SubmitResult/index.vue';

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
onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  editor = monaco.editor.create(document.getElementById('container'), {
    // eslint-disable-next-line max-len
    value: '// code here',
    language: 'cpp',
    theme: 'vs-dark',
    lineNumbers: 'on',
  });
  fetchProblem();
  leftTabsKey.value = PROBLEM_TABS_KEYS.CONTENT;
});

onUnmounted(() => {
  editor.dispose();
});
const problem = reactive({});
const fetchProblem = async () => {
  const res = await getProblemById(Number(router.currentRoute.value.params.problemId));
  Object.assign(problem, res);
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
  const problemId = (problem as Problem).id;
  const lang = codeLanguage.value;
  if(code === '' || !problemId) return;
  const res = await submit({
    code,
    problemId,
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
  const list: any= await getSubmissionList(Number(router.currentRoute.value.params.problemId));
  // 最晚提交放在前面
  list.sort((a: any,b:any) => b.createTime - a.createTime);
  submitList.splice(0, submitList.length);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  submitList.push(...list);
};
onBeforeMount(()=>{
  fetchSubmitHistory();
});
const fetchSubmitResult = async (id: string) => {
  const res = await getSubmissionById({ id }) as any;
  if(res.status === 'success'){
    submitRes.value = reactive(res.result);
    console.log(res.result);
    leftTabsKey.value = PROBLEM_TABS_KEYS.SUBMISSION;
    submitLoading.value = false;
    await fetchSubmitHistory();
  }else{
    setTimeout(()=>{
      fetchSubmitResult(id);
    },1000);
  }
};
</script>

<template>
  <div class="problem-page">
    <div class="problem-page-left">
      <a-tabs v-model:activeKey="leftTabsKey" centered style="height: 100%">
        <a-tab-pane :key="PROBLEM_TABS_KEYS.CONTENT" tab="题目描述">
          <div class="title">{{ problem.id + '. ' + problem.title }}</div>
          <a-divider></a-divider>
          <div class="content" @click="setValue">{{ problem.content }}</div>
        </a-tab-pane>
        <a-tab-pane :key="PROBLEM_TABS_KEYS.SUBMISSION" tab="提交记录">
          <SubmitResult v-if="Object.keys(submitRes).length" :result="submitRes"/>
          <SubmitList :list="submitList" />
        </a-tab-pane>
      </a-tabs>
    </div>
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
  </div>
</template>

<style scoped lang="less">
.problem-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  padding-bottom: 2px;
  &-left {
    padding: 0px 8px;
    width: 30%;
    height: 100%;
    overflow: hidden;
    border-right: 1px solid #c4c3c3;
    .title {
      text-align: center;
      font-size: 16px;
      font-weight: 700;
    }
    .content {
      font-size: 13px;
    }

  }

  &-right {
    display: flex;
    flex-direction: column;
    width: 70%;
    #container {
      flex: 1;
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