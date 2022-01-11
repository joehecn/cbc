<script lang="ts" setup>
import { ref, reactive, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { ElForm } from 'element-plus';
import { getJSON, putJSON } from '../service/oss';

const PASSWD = 'Connor';

const formZionRef = ref<InstanceType<typeof ElForm>>();
const notif: any = inject('notif');

const isExist = async (url: string) => {
  const res = await fetch(url, {
    method: 'HEAD'
  });
  return res?.status === 200;
};
const checkIsExist = (_: any, value: string, callback: any) => {
  const v = value.trim();
  if (!v.trim()) {
    return callback();
  }

  isExist(v).then((exist) => {
    if (exist) {
      callback();
    } else {
      callback(new Error('the file is not exist!'));
    }
  });
};

const password = ref('');
const submiting = ref(false);
const formZion = reactive({
  s2: '',
  p2: '',
  s3: '',
  p3: ''
});
const ruleZion = reactive({
  s2: [{ validator: checkIsExist, trigger: 'blur' }],
  p2: [{ validator: checkIsExist, trigger: 'blur' }],
  s3: [{ validator: checkIsExist, trigger: 'blur' }],
  p3: [{ validator: checkIsExist, trigger: 'blur' }]
});
const router = useRouter();

const onSubmit = async () => {
  if (!formZionRef) return;
  submiting.value = true;
  (formZionRef as any).value.validate(async (valid: boolean) => {
    if (valid) {
      const { s2, p2, s3, p3 } = formZion;
      const json = {
        s2: s2.trim(),
        p2: p2.trim(),
        s3: s3.trim(),
        p3: p3.trim()
      };
      const isOk = await putJSON(json, 'zion');
      if (isOk) {
        notif({
          showClose: true,
          title: '保存成功!',
          type: 'success',
          position: 'bottom-left'
        });
      } else {
        notif({
          showClose: true,
          title: '保存失败!',
          type: 'error',
          position: 'bottom-left'
        });
      }
      submiting.value = false;
    } else {
      submiting.value = false;
      return false;
    }
  });
};

const goBack = () => {
  router.push({ name: 'home' });
};

onMounted(async () => {
  const json = await getJSON('zion');
  // console.log(json);
  if (json) {
    formZion.s2 = json.s2;
    formZion.p2 = json.p2;
    formZion.s3 = json.s3;
    formZion.p3 = json.p3;
  }
});
</script>

<template>
  <el-container>
    <el-header>
      <el-page-header content="OTA Config" @back="goBack" />
    </el-header>
    <el-main>
      <div v-show="password !== PASSWD" class="password">
        <div style="width: 100px; flex: none">PASSWORD:</div>
        <el-input style="max-width: 200px" v-model="password" type="password" />
      </div>

      <el-divider content-position="left">ZION</el-divider>
      <el-form
        ref="formZionRef"
        :model="formZion"
        status-icon
        :rules="ruleZion"
        label-position="left"
        label-width="100px"
        :disabled="password !== PASSWD"
      >
        <el-form-item label="2.0 sandbox:" prop="s2">
          <el-input v-model="formZion.s2" placeholder="please input one link"></el-input>
        </el-form-item>
        <el-form-item label="2.0 product:" prop="p2">
          <el-input v-model="formZion.p2" placeholder="please input one link"></el-input>
        </el-form-item>
        <el-form-item label="3.0 sandbox:" prop="s3">
          <el-input v-model="formZion.s3" placeholder="please input one link"></el-input>
        </el-form-item>
        <el-form-item label="3.0 product:" prop="p3">
          <el-input v-model="formZion.p3" placeholder="please input one link"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submiting" @click="onSubmit">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.password {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--el-text-color-regular);
}
</style>