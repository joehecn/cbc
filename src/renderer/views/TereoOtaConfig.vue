<script lang="ts" setup>
import { ref, reactive, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { ElForm } from 'element-plus';
import { getJSON, putJSON } from '../service/oss';

const PASSWD = 'Connor';
const password = ref('Connor');

const formTereoRef = ref<InstanceType<typeof ElForm>>();
const notif: any = inject('notif');

const isExist = async (url: string) => {
  // const res = await fetch(url, {
  //   method: 'HEAD'
  // });
  // return res?.status === 200;
  return true
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

const submiting = ref(false);

// source: http://fusquare-server.cloud-building.fun:3000/ota/tereo/TEREO_FW_1.1.2.bin
// {"link":"http://192.168.1.11:4322/ota/tereo/TEREO_FW_1.1.2.bin"}
const formTereo = reactive({
  source: ''
});
const ruleTereo = reactive({
  source: [{ validator: checkIsExist, trigger: 'blur' }]
});
const router = useRouter();

const onSubmit = async () => {
  if (!formTereoRef) return;
  submiting.value = true;
  (formTereoRef as any).value.validate(async (valid: boolean) => {
    if (valid) {
      const { source } = formTereo;
      const json = {
        source: source.trim()
      };
      const isOk = await putJSON(json, 'tereo');
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
  const json = await getJSON('tereo');

  if (json) {
    formTereo.source = json.source;
  }
});
</script>

<template>
  <el-container>
    <el-header>
      <el-page-header content="TEREO OTA Config" @back="goBack" />
    </el-header>
    <el-main>
      <div v-show="password !== PASSWD" class="password">
        <div style="width: 100px; flex: none">PASSWORD:</div>
        <el-input style="max-width: 200px" v-model="password" type="password" />
      </div>

      <el-divider content-position="left">TEREO</el-divider>

      <el-form
        ref="formTereoRef"
        :model="formTereo"
        status-icon
        :rules="ruleTereo"
        label-position="left"
        label-width="100px"
        :disabled="password !== PASSWD"
      >
        <el-form-item label="source:" prop="source">
          <el-input v-model="formTereo.source" placeholder="please input one link"></el-input>
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
