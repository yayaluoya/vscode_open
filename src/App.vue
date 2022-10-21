<script  lang="ts">
import { defineComponent, onMounted } from "@vue/runtime-core";

export default defineComponent({
  setup(ctx) {
    return {
      test: "测试",
    };
  },
});
</script>

<template>
  <div class="home">
    <el-button>Defaultddfasd</el-button>
    {{ test }}
  </div>
</template>

<style scoped>
.home {
}
</style>
