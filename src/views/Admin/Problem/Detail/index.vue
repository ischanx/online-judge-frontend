<script lang="ts" setup>
import { onMounted, reactive, ref, toRaw } from 'vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { Form, UploadChangeParam, message } from 'ant-design-vue';
import 'ant-design-vue/es/message/style/index.css';
import { PROBLEM_DIFFICULTY } from '@/const/app';
import { getUnzip, uploadFile } from '@/api/file';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { addProblem, getProblemById, updateProblem } from '@/api/problem';
import router from '@/router';
onMounted(() => {
  const params = router.currentRoute.value.params;
  if (params.action === 'add') {
    canEdit.value = true;
    isAdd.value = true;
  } else if (params.action === 'show') {
    canEdit.value = false;
    isAdd.value = false;
    fetchProblem(Number(params.problemId));
    showUpload.value = false;
  } else {
    canEdit.value = true;
    isAdd.value = false;
    fetchProblem(Number(params.problemId));
    showUpload.value = false;
  }
});
const fetchProblem = async (problemId: number) => {
  const res: any = await getProblemById(problemId);
  Object.assign(modelRef, res);
  await parseSamples(res.samples);
};
const canEdit = ref(false);
const isAdd = ref(true);
const useForm = Form.useForm;
const modelRef: any = reactive({
  title: '',
  content: '',
  difficulty: PROBLEM_DIFFICULTY.EASY,
  fileList: [],
  executeTime: 5000,
  executeMemory: 524288,
});
const rulesRef = reactive({
  title: [
    {
      required: true,
      message: '题目标题还未填写',
    },
  ],
  content: [
    {
      required: true,
      message: '题目内容还未填写',
    },
  ],
  difficulty: [
    {
      required: true,
      message: '题目难度还未填写',
    },
  ],
  executeTime: [
    {
      required: true,
      message: '时间限制还未填写',
    },
  ],
  executeMemory: [
    {
      required: true,
      message: '空间限制还未填写',
    },
  ],
  fileList: [
    {
      required: true,
      message: '测试用例还未填写',
    },
  ],
});
const { validate, validateInfos } = useForm(modelRef, rulesRef);
const onSubmit = () => {
  validate()
  .then(async () => {
    console.log(toRaw(modelRef));
    const res: any = await addProblem({
      title: modelRef.title,
      content: modelRef.content,
      difficulty: modelRef.difficulty,
      samplesFile: sampleFile.value,
      executeTime: modelRef.executeTime,
      executeMemory: modelRef.executeMemory,
      compileTime: 5000,
      compileMemory: 524288,
      fileSize: 102400,
    });
    message.success(`题目新建成功, 编号为[${res.id}]`);
    router.replace({ name: 'ProblemList' });
  })
  .catch((err) => {
    console.log('error', err);
  });
};

const handleProblemChange = async () => {
  await updateProblem(modelRef.id, {
    title: modelRef.title,
    content: modelRef.content,
    difficulty: modelRef.difficulty,
    samplesFile: sampleFile.value,
    executeTime: modelRef.executeTime,
    executeMemory: modelRef.executeMemory,
    compileTime: 5000,
    compileMemory: 524288,
    fileSize: 102400,
  });
  message.success(`修改题目[${modelRef.id}]成功`);
  router.replace({ name: 'ProblemList' });
};
const showSample = ref(false);
const sampleFile = ref('');
const showUpload = ref(true);
const sampleList = ref<any>([]);
const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status;
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`);
    showUpload.value = false;
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
    modelRef.fileList.pop();
    showUpload.value = true;
  }
};

const handleClearUpload = () => {
  modelRef.fileList = [];
  showUpload.value = true;
};

const handleUpload = async (evt: any) => {
  try {
    sampleList.value.length = 0;
    sampleFile.value = '';
    const res = await uploadFile(evt.file);
    sampleFile.value = res.file;
    evt.onSuccess(res);
    // const arr = sampleList.value;
    // for (let i = 0; i < res.input.length; i++) {
    //   arr.push(res.input[i]);
    //   arr.push(res.output[i]);
    // }
  } catch (e) {
    evt.onError(e);
  }
};

const showContentEditor = ref(false);
const vditor = ref<Vditor | null>(null);
const handleShowContentEditor = () => {
  showContentEditor.value = true;
  setTimeout(() => {
    vditor.value = new Vditor('editor', {
      after: () => {
        vditor.value!.setValue(modelRef.content);
        !canEdit.value && vditor.value!.disabled();
      },
      height: 'auto',
      placeholder: '请输入markdown格式的内容',
      mode: 'sv',
    });
  });
};
const handleContentOK = () => {
  modelRef.content = vditor.value!.getValue();
  showContentEditor.value = false;
};

const handleShowSample = async () => {
  showSample.value = true;
  if (modelRef.fileList.length === 0) return;
  const res = await getUnzip(sampleFile.value);
  await parseSamples(res.samples);
};
const parseSamples = async (samples: any) => {
  const list: any[] = [];
  samples.forEach((item: { input: any; output: any }) => {
    list.push(item.input, item.output);
  });

  sampleList.value.length = 0;
  sampleList.value.push(...list);
};
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <a-breadcrumb style="margin-bottom: 16px">
      <a-breadcrumb-item>管理员设置</a-breadcrumb-item>
      <a-breadcrumb-item>题目管理</a-breadcrumb-item>
      <a-breadcrumb-item>添加题目</a-breadcrumb-item>
    </a-breadcrumb>
    <div>
      <a-form>
        <a-form-item label="标题" v-bind="validateInfos.title">
          <a-input v-model:value="modelRef.title" placeholder="请输入题目标题" :disabled="!canEdit" />
        </a-form-item>
        <a-form-item label="内容" v-bind="validateInfos.content">
          <a-button @click="handleShowContentEditor">点击{{ canEdit || isAdd ? '编辑' : '查看' }}</a-button>
          <a-modal
            v-model:visible="showContentEditor"
            width="80vw"
            title="题目内容"
            :body-style="{ height: '80vh', overflow: 'auto' }"
            centered
            ok-text="确认"
            cancel-text="取消"
            @ok="handleContentOK"
          >
            <div id="editor" style="height: 100%"></div>
          </a-modal>
        </a-form-item>
        <a-form-item label="难度" v-bind="validateInfos.difficulty">
          <a-select v-model:value="modelRef.difficulty" placeholder="请选择题目难度" :disabled="!canEdit">
            <a-select-option :value="PROBLEM_DIFFICULTY.EASY">简单</a-select-option>
            <a-select-option :value="PROBLEM_DIFFICULTY.MEDUIM">中等</a-select-option>
            <a-select-option :value="PROBLEM_DIFFICULTY.HARD">困难</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="测试用例" v-bind="validateInfos.fileList">
          <a-upload-dragger
            v-if="showUpload"
            v-model:fileList="modelRef.fileList"
            name="file"
            :max-count="1"
            accept="application/zip"
            style="width: 200px"
            :custom-request="handleUpload"
            :disabled="!canEdit"
            @change="handleChange"
          >
            <div>
              <p class="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p class="ant-upload-text">点击或拖拽上传</p>
              <p class="ant-upload-hint">支持35MB内zip文件上传</p>
            </div>
          </a-upload-dragger>
          <div v-else>
            <span style="margin: 0 8px">{{ modelRef.fileList[0]?.name || modelRef.samplesFile }}</span>
            <a-button size="small" @click="handleShowSample">查看上传结果</a-button>
            <a-button danger size="small" :disabled="!canEdit" @click="handleClearUpload">删除</a-button>
            <a-modal
              v-model:visible="showSample"
              title="已上传的测试用例"
              :body-style="{ maxHeight: '70vh', overflow: 'auto' }"
              centered
              :footer="null"
            >
              <div>
                <div class="sample-list" style="font-weight: 700">
                  <span class="sample-list-name">文件名</span>
                  <span class="sample-list-size">大小</span>
                  <span class="sample-list-md5">MD5</span>
                </div>
                <div v-for="item in sampleList" :key="item.name" class="sample-list">
                  <span class="sample-list-name">{{ item.name }}</span>
                  <span class="sample-list-size">{{ item.size }}</span>
                  <span class="sample-list-md5">{{ item.md5 }}</span>
                </div>
              </div>
            </a-modal>
          </div>
        </a-form-item>
        <a-form-item label="时间限制" v-bind="validateInfos.executeTime">
          <a-input-number
            v-model:value="modelRef.executeTime"
            addon-after="ms"
            :min="1000"
            :precision="0"
            :disabled="!canEdit"
          />
        </a-form-item>
        <a-form-item label="空间限制" v-bind="validateInfos.executeMemory">
          <a-input-number
            v-model:value="modelRef.executeMemory"
            addon-after="kb"
            :min="10240"
            :precision="0"
            :disabled="!canEdit"
          />
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button v-if="isAdd" type="primary" :disabled="!sampleFile || !canEdit" @click.prevent="onSubmit"
          >新建题目</a-button
          >
          <a-button v-else-if="canEdit" style="margin-left: 10px" @click="handleProblemChange">修改题目</a-button>
        </a-form-item>
      </a-form>
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
