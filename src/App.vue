<script  lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  setup(ctx) {
    return {
      test: "测试",
    };
  },
});
</script>

<template>
  <div class="home">{{ test }}</div>
</template>

<style scoped>
.home {
}
</style>
