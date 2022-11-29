<script lang="ts" setup>
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from '../store';
import { OtaListRow, LIFE_ENUM, STATE_ENUM, Msg, MqttMsg } from '../../util/config';

const props = defineProps(['platform', 'version'])

const store = useStore();

const ipc: any = inject('ipc');
const notif: any = inject('notif');

const otaList = computed(() => store.state.otaList);
const multipleSelection = ref<OtaListRow[]>([])

const tableRowClassName = ({ row }: any) => {
  const item = row as OtaListRow;
  if (item.state === STATE_ENUM.CANCEL) {
    return 'warning-row';
  } else if (item.state === STATE_ENUM.UPDATE_COMPLETE) {
    return 'success-row';
  }
  return '';
};

const selectable = (row: OtaListRow) => {
  if (row.state === STATE_ENUM.OFFLINE) return false;
  if (`${row.version}.bin` === props.version) return false;

  return true;
};

const handleSelectionChange = (val: OtaListRow[]) => {
  multipleSelection.value = val
}

const ota = (link: string) => {
  const list = multipleSelection.value;
  const len = list.length;

  if (len === 0) {
    notif({
      showClose: true,
      title: '请选择需要升级的 item',
      type: 'warning',
      position: 'bottom-left'
    });
    return;
  }

  const payloadStr = JSON.stringify({ link })
  for (let i = 0; i < len; i++) {
    const { id } = list[i];
    console.log({ id, platform: props.platform });

    const key = 'otaclient-send-msg';
    const msg: Msg<MqttMsg> = {
      key,
      value: {
        platform: props.platform,
        topic: `${id}/ota/cmd`,
        payloadStr
      }
    };
    ipc.send(msg);
  }
}

onMounted(() => {
  // console.log('---- Tereo Task Table on mounted');
  // console.log(props.platform);

  const key = 'otaclient-init';
  const msg: Msg<string> = {
    key,
    value: props.platform
  };
  ipc.send(msg);
})

onUnmounted(() => {
  // console.log('---- Tereo Task Table on unmounted');
  // console.log(props.platform);

  const key = 'otaclient-destory';
  const msg: Msg<string> = {
    key,
    value: props.platform
  };
  ipc.send(msg);
})

defineExpose({
  ota
})
</script>

<template>
  <div class="task-list">
    <div>OTA 列表</div>
    <el-table style="width: 100%"
      :data="otaList"
      :default-sort="{ prop: 'id', order: 'ascending' }"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
    >
      <el-table-column width="55"
        type="selection"
        :selectable="selectable"
      />

      <el-table-column prop="id" label="ID" sortable width="150">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon v-if="!scope.row.life" class="is-loading">
              <icon-loading />
            </el-icon>
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="version" label="VERSION" sortable width="150" />
      
      <el-table-column prop="state" label="STATE" sortable width="180">
        <template #default="scope">
          {{ STATE_ENUM[scope.row.state] }}
        </template>
      </el-table-column>

      <el-table-column label="LIFE">
        <template #default="scope">
          {{ LIFE_ENUM[scope.row.life] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>