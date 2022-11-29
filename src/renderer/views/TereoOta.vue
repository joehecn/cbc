<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getJSON } from '../service/oss';
import TereoTaskTable from '../components/TereoTaskTable.vue';

const tereoTaskTable = ref(null);

const PASSWD = 'fusquare-server';
const password = ref('fusquare-server');

const active = ref(0);

// ---------------------------------------------
// Step 1
const selectPlatformOptions = [
  {
    value: '3.0 sandbox',
    label: '3.0 sandbox'
  },
  {
    value: '3.0 product',
    label: '3.0 product'
  }
];
const selectPlatformValue = ref('');

// ---------------------------------------------
// Step 2
const otaConfig = reactive({
  source: ''
});
const targetOtaConfigTag = computed(() => {
  let name = '找不到.bin文件';
  let type = 'danger';

  const link = otaConfig.source;
  if (link) {
    const index = link.lastIndexOf('/');
    name = link.slice(index + 1);
    type = 'success';
  }

  return { name, type };
});
const version = computed(() => {
  return targetOtaConfigTag.value.name;
})

const handStep2NextClick = () => {
  const link = otaConfig.source;
  const table = tereoTaskTable.value as any;
  table && table.ota && table.ota(link);
}

const router = useRouter();
const goBack = () => {
  router.push({ name: 'home' });
};

onMounted(async () => {
  const json = await getJSON('tereo');

  if (json) {
    otaConfig.source = json.source;
  }
});
</script>

<template>
  <el-container>
    <el-header>
      <el-page-header content="TEREO OTA" @back="goBack" />
    </el-header>

    <el-main v-show="password !== PASSWD">
      <div class="password">
        <div style="width: 100px; flex: none">PASSWORD:</div>
        <el-input style="max-width: 200px" v-model="password" type="password" />
      </div>
    </el-main>

    <el-main v-show="password === PASSWD">
      <el-steps :active="active" finish-status="success">
        <el-step title="Step 1" description="选择平台"></el-step>
        <el-step title="Step 2" description="选择硬件"></el-step>
      </el-steps>

      <div class="step step1" v-if="active === 0">
        <div class="select step1">
          <el-select
            style="width: 100%"
            v-model="selectPlatformValue"
            clearable
            placeholder="Select"
          >
            <el-option
              v-for="item in selectPlatformOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div class="btns step1">
          <el-button
            type="primary"
            plain
            :disabled="selectPlatformValue === ''"
            @click="active = 1"
          >
            Next<el-icon class="el-icon--right"><arrow-right /></el-icon>
          </el-button>
        </div>
      </div>

      <div class="step step2" v-if="active === 1">
        <div class="target step2">
          <div>目标平台</div>
          <div>{{ selectPlatformValue }}</div>
          <el-tag :type="targetOtaConfigTag.type">{{ targetOtaConfigTag.name }}</el-tag>
        </div>
        <div class="btns step2">
          <el-button type="primary" plain :disabled="false" @click="active = 0">
            <el-icon><arrow-left /></el-icon>Prev
          </el-button>

          <el-button type="primary" plain @click="handStep2NextClick">
            Run Tasks<el-icon><arrow-right /></el-icon>
          </el-button>
        </div>

        <TereoTaskTable
          ref="tereoTaskTable"
          :platform="selectPlatformValue"
          :version="version"
        />
      </div>
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

.step.step1 {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.select.step1 {
  padding: 12px;
  width: 100%;
}
.btns.step1 {
  padding: 12px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.btns.step2 {
  padding: 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>