<script setup lang="ts">
import { useRouter } from 'vue-router';

import * as monaco from 'monaco-editor';
import { onMounted, onUnmounted, reactive } from 'vue';

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { getProblemById } from '@/api/problem';
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

  editor = monaco.editor.create(document.getElementById('container'), {
    value: 'function hello() {\n\talert(\'Hello world!\');\n}',
    language: 'javascript',
    theme: 'vs-dark',
    lineNumbers: 'on',
  });
  fetchProblem();
});
const setValue = () => {
  const model =monaco.editor.createModel('html{font-size: 16px;}', 'css');
  editor.setModel(model);
  editor.updateOptions({
    lineNumbers:'off'
  });
};
onUnmounted(()=>{
  editor.dispose();
});
const problem = reactive({});
const fetchProblem = async () => {
  const res = await getProblemById(Number(router.currentRoute.value.params.problemId));
  Object.assign(problem,res);
};
</script>

<template>
  <div class="problem-page">
    <div class="problem-page-left">
      <div class="title">{{  problem.id + '. '+problem.title }}</div>
      <a-divider></a-divider>
      <div class="content" @click="setValue">{{ problem.content }}</div>
    </div>
    <div class="problem-page-right">
      <div id="container" />
    </div>

  </div>
</template>

<style scoped lang="less">
.problem-page{
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  &-left{
    margin: 8px 16px;
    width: 20%;
    .title{
      text-align: center;
      padding-top: 16px;
      font-size: 16px;
      font-weight: 700;
    }
    .content{
      font-size: 13px;
    }
  }

  &-right{
    width: 80%;
    #container{
      height: 70vh;
    }
  }


}
</style>
