<template>
  <div class="submission">
    <div class="info">
      <p>用户名：{{ submission.username }}</p>
      <p>提交时间：{{ parseTimestamp(submission.createTime) }}</p>
      <p>语言：{{ submission.lang }}</p>
      <p>时间：{{ submission?.result?.time === undefined ? 'NAN' : submission?.result?.time}}</p>
      <p>空间：{{ submission?.result?.memory || 'NAN' }}</p>
    </div>
    <div id="container" />
  </div>
</template>

<script setup lang="ts">
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import * as monaco from 'monaco-editor';
import { onMounted, onUnmounted, ref } from 'vue';
import router from '@/router';
import { getSubmissionById } from '@/api/problem';
import { parseTimestamp } from '@/utils/parser';
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
const id = ref<string>('');
const submission = ref<any>({});
const getEditorLanguage = (lang:string) => {
  const map: any = {
    c: 'c',
    cpp: 'cpp',
    jsNode: 'javascript',
    js: 'javascript',
  };
  return map[lang] as string;
};
onMounted(async() => {

  id.value = router.currentRoute.value.params.id as string;
  const res = await getSubmissionById({ id:id.value });

  submission.value = res;
  console.log(res);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  editor = monaco.editor.create(document.getElementById('container'), {
    // eslint-disable-next-line max-len
    value: '// code here',
    language: getEditorLanguage(submission.value.lang),
    theme: 'vs-dark',
    lineNumbers: 'on',
    automaticLayout: true, // auto resize
    readOnly: true
  });
  editor.setValue(res.code);
});
onUnmounted(() => {
  editor.dispose();
});
</script>

<style scoped lang="less">
.submission{
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
  .info{
    margin: 32px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 70%;
  }
  #container{
    width: 80%;
    height: 500px;
  }

}

</style>