<template>
  <el-row :gutter="12">
    <el-col :span="8">
      <router-link to="/zion_ota_config">
        <el-card shadow="hover">ZION OTA Config</el-card>
      </router-link>
    </el-col>

    <el-col :span="8">
      <router-link to="/zion_ota_transfer">
        <el-card shadow="hover">ZION OTA Transfer</el-card>
      </router-link>
    </el-col>

    <el-col :span="8"></el-col>
  
    <el-col :span="8">
      <router-link to="/tereo_ota_config">
        <el-card shadow="hover">TEREO OTA Config</el-card>
      </router-link>
    </el-col>

    <el-col :span="8">
      <router-link to="/tereo_ota">
        <el-card shadow="hover">TEREO OTA</el-card>
      </router-link>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.el-row {
  padding: 0 12px;
}

a {
  display: block;
  margin-top: 12px;
  text-decoration: none;
}
</style>