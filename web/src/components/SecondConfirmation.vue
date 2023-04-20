<template>
  <!-- 二次确认 -->
  <el-dialog
    append-to-body
    :title="$slots.default ? title : '提示'"
    :model-value="!!data"
    :width="width"
    @close="close"
    class="removeItem"
  >
    <slot>
      <div class="alert" :class="comType">{{ title }}</div>
    </slot>
    <template #footer>
      <span class="dialog-footer">
        <el-button :loading="loading" @click="close">取 消</el-button>
        <el-button :type="comType" :loading="loading" @click="submit"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: "提示",
    },
    width: {
      type: String,
      default: "500px",
    },
    comType: {
      type: String,
      default: "primary",
    },
    data: [Object, Array, String, Number],
    //TODO 这个方法会自动绑定this
    comF: Function,
  },
  data() {
    return {
      loading: false,
    };
  },
  mounted() {},
  methods: {
    close() {
      if (this.loading) {
        return;
      }
      this.$emit("update:data", null);
    },
    submit() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.comF(this.data)
        .finally(() => {
          this.loading = false;
        })
        .then(() => {
          this.close();
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../style/element-variables.scss";
.removeItem {
  .alert {
    width: 100%;
    // font-weight: bold;
    font-size: 20px;
    text-align: center;

    &.primary {
      color: $--color-primary;
    }
    &.success {
      color: $--color-success;
    }
    &.info {
      color: $--color-info;
    }
    &.warning {
      color: $--color-warning;
    }
    &.danger {
      color: $--color-danger;
    }
  }
}
</style>