<script lang="ts" setup>
import { computed, ref, reactive, onMounted, inject, toRaw } from 'vue';
import { useStore } from '../store';
import { useRouter } from 'vue-router';
import { getJSON } from '../service/oss';
import { Task, Msg, LIFE_ENUM, STATE_ENUM } from '../../util/config';

const PASSWD = 'fusquare-server';

const store = useStore();

const ipc: any = inject('ipc');

const password = ref('');

const active = ref(0);
// ---------------------------------------------
// Step 1
const selectPlatformOptions = [
  {
    value: '2.0 sandbox',
    label: '2.0 sandbox'
  },
  {
    value: '2.0 product',
    label: '2.0 product'
  },
  {
    value: '3.0 sandbox',
    label: '3.0 sandbox'
  },
  {
    value: '3.0 product',
    label: '3.0 product'
  }
];
const selectPlatformValues = ref([]);
const togglePlatform = ref(true);
const platform = computed(() => {
  const item0 = selectPlatformValues.value[0] || '';
  const item1 = selectPlatformValues.value[1] || '';
  if (togglePlatform.value) {
    return { source: item0, target: item1 };
  } else {
    return { source: item1, target: item0 };
  }
});

const taskList = computed(() => store.state.taskList);

// ---------------------------------------------
// step2
const otaConfig = reactive({
  '2.0 sandbox': '',
  '2.0 product': '',
  '3.0 sandbox': '',
  '3.0 product': ''
});
const targetOtaConfigTag = computed(() => {
  let name = '找不到.bin文件';
  let type = 'danger';

  const config: string = otaConfig[platform.value.target];
  if (config) {
    const index = config.lastIndexOf('/');
    name = config.slice(index + 1);
    type = 'success';
  }

  return { name, type };
});

const realDeviceID = ref('');

const _getTaskID = (key: string) => {
  const time = Date.now();
  return `${key}-${time}`;
};
const handStep2NextClick = () => {
  const key = 'send-ota-cmd-step1';
  const target = platform.value.target;
  const link = otaConfig[target];

  const task: Task = {
    taskID: _getTaskID(key),
    deviceID: realDeviceID.value,
    life: LIFE_ENUM.RUNNING,
    source: platform.value.source,
    sourceState: STATE_ENUM.UNKNOWN,
    target,
    targetState: STATE_ENUM.UNKNOWN,
    link,
    sourceOnlineMsgCount: 0
  };

  store.commit('addTaskList', { task });

  // 向源平台发送升级指令 step1
  const msg: Msg<Task> = {
    key,
    value: task
  };
  ipc.send(msg);

  realDeviceID.value = '';
};

const cancelTask = (row: any) => {
  console.log('---- cancelTask');
  const task = toRaw(row) as Task;
  // 向源平台发送取消指令
  const msg: Msg<Task> = {
    key: 'cancel-ota-cmd',
    value: task
  };
  ipc.send(msg);
};

const tableRowClassName = ({ row }: any) => {
  const task = row as Task;
  if (task.sourceState === STATE_ENUM.CANCEL) {
    return 'warning-row';
  } else if (task.targetState === STATE_ENUM.UPDATE_COMPLETE) {
    return 'success-row';
  }
  return '';
};

// const querySearchAsync = async (queryString: string, cb: (arg: any) => void) => {
//   console.log({ queryString, source: platform.value.source });
//   cb([{ value: 'aaa' }]);
// };

const router = useRouter();
const goBack = () => {
  router.push({ name: 'home' });
};

onMounted(async () => {
  const json = await getJSON('zion');

  if (json) {
    otaConfig['2.0 sandbox'] = json.s2;
    otaConfig['2.0 product'] = json.p2;
    otaConfig['3.0 sandbox'] = json.s3;
    otaConfig['3.0 product'] = json.p3;
  }
});
</script>

<template>
  <el-container>
    <el-header>
      <el-page-header content="OTA Transfer" @back="goBack" />
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
        <!-- <el-step title="Step 3" description="进行转换"></el-step> -->
      </el-steps>

      <div class="step step1" v-if="active === 0">
        <div class="select step1">
          <el-select
            style="width: 100%"
            v-model="selectPlatformValues"
            multiple
            :multiple-limit="2"
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

        <div class="platform step1">
          <div class="source step1">
            <div class="platform-title">源平台</div>
            <div class="platform-value">{{ platform.source }}</div>
          </div>
          <div class="toggle step1">
            <div class="toggle-btn" @click="togglePlatform = !togglePlatform">
              <div class="toggle-btn-title">切换</div>
              <el-icon class="toggle-btn-icon" :size="32"><icon-switch /></el-icon>
            </div>
          </div>
          <div class="target step1">
            <div class="platform-title">目标平台</div>
            <div class="platform-value">{{ platform.target }}</div>
          </div>
        </div>

        <div class="btns step1">
          <el-button
            type="primary"
            plain
            :disabled="selectPlatformValues.length < 2"
            @click="active = 1"
          >
            Next<el-icon class="el-icon--right"><arrow-right /></el-icon>
          </el-button>
        </div>
      </div>

      <div class="step step2" v-if="active === 1">
        <div class="target step2">
          <div>目标平台</div>
          <div>{{ platform.target }}</div>
          <el-tag :type="targetOtaConfigTag.type">{{ targetOtaConfigTag.name }}</el-tag>
        </div>
        <div class="source step2">
          <div>源平台</div>
          <div>{{ platform.source }}</div>
          <div>
            <!-- <el-autocomplete
              v-model="realDeviceID"
              :fetch-suggestions="querySearchAsync"
              placeholder="Please input device ID"
            /> -->
            <el-input v-model="realDeviceID" placeholder="Please input device ID" />
          </div>
        </div>
        <div class="btns step2">
          <el-button type="primary" plain :disabled="false" @click="active = 0">
            <el-icon><arrow-left /></el-icon>Prev
          </el-button>

          <el-button type="primary" plain :disabled="!realDeviceID" @click="handStep2NextClick">
            Add to Tasks<el-icon><arrow-right /></el-icon>
          </el-button>
        </div>
      </div>

      <div class="task-list">
        <div>任务列表</div>
        <el-table :data="taskList" :row-class-name="tableRowClassName" style="width: 100%">
          <el-table-column label="deviceID" width="150">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-icon v-if="!scope.row.life" class="is-loading">
                  <icon-loading />
                </el-icon>
                <span style="margin-left: 10px">{{ scope.row.deviceID }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="source" label="source" width="150" />
          <el-table-column label="sourceState" width="180">
            <template #default="scope">
              {{ STATE_ENUM[scope.row.sourceState] }}
            </template>
          </el-table-column>
          <el-table-column prop="target" label="target" width="150" />
          <el-table-column label="targetState" width="180">
            <template #default="scope">
              {{ STATE_ENUM[scope.row.targetState] }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Operations" min-width="150">
            <template #default="scope">
              <el-button v-if="!scope.row.sourceState" type="text" @click="cancelTask(scope.row)"
                >Cancel</el-button
              >
            </template>
          </el-table-column>
        </el-table>
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
.platform.step1 {
  padding: 12px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.source.step1,
.target.step1 {
  display: flex;
  flex-direction: column;
  width: 200px;
  align-items: center;
}
.platform-title {
  font-size: 14px;
  color: #999;
}
.platform-value {
  font-size: 20px;
  font-weight: 700;
}
.toggle-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--el-color-primary);
  cursor: pointer;
}
.toggle-btn:hover {
  color: var(--el-color-primary-light-2);
}
.toggle-btn-title {
  font-size: 12px;
  line-height: 12px;
  transform: translateY(6px);
}
.toggle-btn-icon {
  transform: scaleY(0.5);
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