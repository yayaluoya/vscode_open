<script  lang="ts">
import {
  computed,
  defineComponent,
  onDeactivated,
  onMounted,
  reactive,
  ref,
  watchEffect,
} from "@vue/runtime-core";
import { ConfigAC } from "./api/ConfigAC";
import { Mes } from "./mes/Mes";
import { ItemAC } from "./api/ItemAC";
import { ComAC } from "./api/ComAC";
import { ObjectUtils } from "yayaluoya-tool/dist/obj/ObjectUtils";
import { FileT } from "yayaluoya-tool/dist/web/FileT";
import { getFile } from "yayaluoya-tool/dist/web/getFile";
import { FormInstance, FormRules } from "element-plus";
import SecondConfirmation from "./components/SecondConfirmation.vue";
import defIcon from "./assets/vscodeLog.png";
import {
  Calendar,
  Search,
  CirclePlus,
  Download,
  Upload,
} from "@element-plus/icons-vue";
import { setTheme } from "./theme/index";
import { KeydownE } from "./event/KeydownE";

const formData_: ComN.IItemD & {
  pathStr: string;
} = {
  /** id */
  id: undefined,
  /** 唯一的key */
  key: "",
  /** 图标，本地文件路径 */
  icon: "",
  /** 标题 */
  title: "",
  /** 项目路径 */
  paths: [],
  pathStr: "",
  /** 项目打开次数 */
  openNumber: 0,
};

export default defineComponent({
  components: { SecondConfirmation },
  setup(ctx) {
    const show = ref<"list" | "config">("list");
    const list = ref<ComN.IItemD[]>([]);
    const config = ref<ComN.IConfig>({
      port: 80,
      openBrowser: true,
      dark: false,
    });
    const filterInput = ref("");
    const inputRef = ref<HTMLInputElement>();

    onMounted(() => {
      loadCofing();
      loadList();
      KeydownE.instance.on("keydown", ctx, (e: KeyboardEvent) => {
        if (e.ctrlKey && /^Enter$/i.test(e.key)) {
          inputRef.value?.focus();
        }
      });
    });

    onDeactivated(() => {
      KeydownE.instance.off("keydown", ctx);
    });

    function loadCofing() {
      ConfigAC.instance.get().then((data) => {
        for (let i in config.value) {
          (config.value as any)[i] = (data as any)[i];
        }
      });
    }
    function loadList() {
      ItemAC.instance.list().then((data) => {
        list.value = data.sort((a, b) => {
          return b.openNumber - a.openNumber;
        });
      });
    }

    function editConfig() {
      ConfigAC.instance.edit(config.value).catch((e) => {
        Mes.handleHttpCatch(e);
        loadCofing();
      });
    }

    function open(item: ComN.IItemD) {
      ItemAC.instance
        .open(item)
        .catch(Mes.handleHttpCatch)
        .then(() => {
          item.openNumber++;
        });
    }

    const list_ = computed(() => {
      let reg = new RegExp(filterInput.value, "i");
      return list.value.filter((_) => {
        return (
          reg.test(_.key) || reg.test(_.title) || reg.test(_.paths.join(""))
        );
      });
    });

    const formData = ref(ObjectUtils.clone2(formData_));
    const formDataRules = reactive<FormRules>({
      key: {
        required: true,
        message: "必须输入key",
        trigger: "blur",
      },
      title: {
        required: true,
        message: "必须输入标题",
        trigger: "blur",
      },
      pathStr: {
        required: true,
        message: "必须输入路径",
        trigger: "blur",
      },
    });
    const showDialog = ref(false);
    const submitLoading = ref(false);
    const formEl = ref<FormInstance | undefined>();
    const onRemove = ref(null);
    /** 添加编辑 */
    function edit(item: any) {
      showDialog.value = true;
      if (item) {
        for (let i in formData_) {
          (formData.value as any)[i] = item[i];
        }
        formData.value.pathStr = formData.value.paths.join("\n");
      } else {
        formData.value = ObjectUtils.clone2(formData_);
      }
    }
    function submit() {
      if (!formEl.value) {
        return;
      }
      formEl.value.validate().then(() => {
        let p = Promise.resolve();
        submitLoading.value = true;
        let op: ComN.IItemD = {
          id: formData.value.id,
          key: formData.value.key,
          icon: formData.value.icon,
          title: formData.value.title,
          paths: formData.value.pathStr.replace(/ +/, "").split(/[\n;]+/g),
          openNumber: formData.value.openNumber,
        };
        if (op.id) {
          p = ItemAC.instance.edit(op).then(() => {
            Mes.success("编辑成功");
          });
        } else {
          p = ItemAC.instance.add(op).then(() => {
            Mes.success("添加成功");
          });
        }
        p.then(() => {
          showDialog.value = false;
          loadList();
        })
          .catch(Mes.handleHttpCatch)
          .finally(() => {
            submitLoading.value = false;
          });
      });
    }
    function remove(item: ComN.IItemD) {
      return ItemAC.instance
        .remove(item.id!)
        .then(() => {
          Mes.success("删除成功");
          loadList();
        })
        .catch((e) => {
          Mes.handleHttpCatch(e);
          throw e;
        });
    }

    function importClick() {
      getFile().then((file) => {
        var reader = new FileReader();
        reader.onload = function (evt) {
          let list: ComN.IItemD[] = [];
          try {
            list = JSON.parse((evt.target?.result as string) || "");
          } catch {}
          ItemAC.instance
            .itemImport(list)
            .then((_) => {
              Mes.success("导入成功");
              loadList();
            })
            .catch(Mes.handleHttpCatch);
        };
        reader.readAsText(file as File);
      });
    }
    function exportClick() {
      let name = `vscodeOpenItemList@${new Date()
        .toLocaleString()
        .replace(/\//g, "-")
        .replace(/:/g, "_")
        .replace(/\s+/g, "_")}.json`;
      FileT.download(
        URL.createObjectURL(
          new File([new Blob([JSON.stringify(list.value)])], name)
        ),
        name
      );
    }

    function vscodeOpen(path: string) {
      ComAC.instance.vscode_open(path);
    }

    watchEffect(() => {
      setTheme(config.value.dark ? "dark" : "bright");
    });

    return {
      getFileUrl: ComAC.getFileUrl,
      show,
      list_,
      config,
      editConfig,
      open,
      edit,
      formData,
      showDialog,
      submitLoading,
      submit,
      formDataRules,
      formEl,
      remove,
      onRemove,
      filterInput,
      Search,
      importClick,
      exportClick,
      CirclePlus,
      Upload,
      Download,
      defIcon,
      vscodeOpen,
      inputRef,
    };
  },
});
</script>

<template>
  <div class="home">
    <div class="content">
      <div class="nav">
        <div class="left">
          <img src="./assets/vscodeLog.png" alt="" />
          <span>Open</span>
          <span
            :class="{
              on: show == 'list',
            }"
            @click="show = 'list'"
            >列表</span
          >
          <span
            :class="{
              on: show == 'config',
            }"
            @click="show = 'config'"
            >配置</span
          >
        </div>
        <div class="right">
          <el-switch
            v-model="config.dark"
            @change="editConfig()"
            active-text="黑夜"
            inactive-text="白天"
          />
        </div>
      </div>
      <div class="content">
        <template v-if="show == 'list'">
          <div class="top">
            <div class="left">
              <el-button
                style="margin-right: 20px"
                type="primary"
                @click="edit()"
                :icon="CirclePlus"
              >
                添加</el-button
              >
              <el-input
                v-model="filterInput"
                placeholder="输入筛选"
                :prefix-icon="Search"
                clearable
                ref="inputRef"
              />
            </div>
            <div class="right">
              <el-button
                style="margin-right: 20px"
                @click="importClick()"
                :icon="Download"
                >导入</el-button
              >
              <el-button style="margin: 0" @click="exportClick()" :icon="Upload"
                >导出</el-button
              >
            </div>
          </div>
          <el-table border :data="list_" style="width: 100%">
            <el-table-column
              show-overflow-tooltip
              width="120px"
              prop="key"
              label="key"
            />
            <el-table-column prop="icon" label="图标" width="60">
              <template #default="{ row }">
                <el-image
                  @click="open(row)"
                  style="width: 30px; cursor: pointer"
                  :src="row.icon ? getFileUrl(row.icon) : defIcon"
                  fit="cover"
                  :preview-src-list="row.icon ? [getFileUrl(row.icon)] : []"
                  preview-teleported
                />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题">
              <template #default="{ row }">
                <span
                  class="vscode_item"
                  @click="open(row)"
                  style="color: #0080cf"
                  >{{ row.title }}</span
                >
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="path" label="路径列表">
              <template #default="{ row }">
                <div style="display: flex; flex-direction: column">
                  <span
                    class="vscode_item text-ellipsis"
                    v-for="(item, index) in row.paths"
                    :key="index"
                    @click="vscodeOpen(item)"
                    >{{ item }}</span
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="openNumber" width="90px" label="打开次数" />
            <el-table-column fixed="right" label="操作" width="100">
              <template #default="{ row }">
                <el-button
                  style="margin-left: 5px"
                  link
                  type="primary"
                  size="small"
                  @click="edit(row)"
                  >编辑</el-button
                >
                <el-button
                  style="margin-left: 5px"
                  link
                  type="danger"
                  size="small"
                  @click="onRemove = row"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-form
          label-suffix="："
          v-if="show == 'config'"
          :model="config"
          label-width="180px"
        >
          <el-form-item label="端口号" prop="port">
            <div style="display: flex; flex-direction: column">
              <el-input-number
                v-model="config.port"
                :min="80"
                :max="65535"
                @change="editConfig()"
              />
              <span style="color: rgb(255 78 78)">重启后生效</span>
            </div>
          </el-form-item>
          <el-form-item label="启动时是否打开浏览器" prop="openBrowser">
            <div style="display: flex; flex-direction: column">
              <el-switch v-model="config.openBrowser" @change="editConfig()" />
              <span style="color: rgb(255 78 78)">重启后生效</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog v-model="showDialog" title="添加/编辑项目" width="600px">
      <el-form
        ref="formEl"
        :model="formData"
        :rules="formDataRules"
        label-width="80px"
        label-suffix="："
      >
        <el-form-item label="key" prop="key">
          <el-input v-model="formData.key" placeholder="请输入key" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="formData.icon" placeholder="请输入图标文件路径" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="路径" prop="pathStr">
          <el-input
            v-model="formData.pathStr"
            :rows="6"
            type="textarea"
            placeholder="请输入路径"
          />
          <span>多个路径用换行符或;符号分隔</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button :loading="submitLoading" @click="showDialog = false"
            >取消</el-button
          >
          <el-button :loading="submitLoading" type="primary" @click="submit()">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
    <SecondConfirmation
      comType="danger"
      v-model:data="onRemove"
      :comF="remove"
      title="是否删除该项目"
    />
  </div>
</template>

<style lang="scss">
body {
  background-color: var(--backgroundColor);
  color: var(--color);
  transition: all 0.2s;
}

.el-dialog {
  > .el-dialog__header {
    border-color: var(--borderColor) !important;
    background-color: var(--backgroundColor);
    transition: all 0.2s;

    > .el-dialog__title {
      color: var(--color);
      transition: all 0.2s;
    }
  }

  > .el-dialog__body {
    background-color: var(--backgroundColor);
  }

  > .el-dialog__footer {
    border-color: var(--borderColor) !important;
    background-color: var(--backgroundColor);
    transition: all 0.2s;
  }
}
</style>

<style scoped lang="scss">
.home {
  width: 100%;
  min-height: calc(100vh - 40px);
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;

  > .content {
    width: 1000px;
    display: flex;
    flex-direction: column;
    > .nav {
      height: 60px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #e6e9ee;
      border-color: var(--borderColor);
      padding: 0 20px;
      width: 100%;
      box-sizing: border-box;
      border-radius: 12px;
      margin-bottom: 20px;
      background-color: var(--contentBackgroundColor);
      transition: all 0.2s;
      > .left {
        display: flex;
        flex-direction: row;
        align-items: center;
        > * {
          margin-right: 20px;
        }
        > img {
          height: 30px;
          margin-right: 5px;
        }
        > span:nth-child(2) {
          font-size: 30px;
          font-weight: bold;
          color: #0086d1;
        }
        > span:nth-child(3),
        > span:nth-child(4) {
          font-size: 16px;
          line-height: 16px;
          color: gray;
          cursor: pointer;
          &:hover {
            color: #0086d1;
          }
          &.on {
            font-weight: bold;
            color: #0086d1;
            text-decoration: underline;
          }
        }
      }
      > .right {
        display: flex;
        flex-direction: row;
        align-items: center;
        > span {
          font-size: 16px;
          color: gray;
          margin-right: 5px;
          line-height: 16px;
        }
      }
    }
    > .content {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      border: 1px solid #e6e9ee;
      border-color: var(--borderColor);
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
      border-radius: 12px;
      margin-bottom: 20px;
      background-color: var(--contentBackgroundColor);
      transition: all 0.2s;
      > .top {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        width: 100%;
        > .right,
        > .left {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        > .left {
          > .el-button {
            :deep(.el-icon) {
              color: white;
            }
          }
        }
      }
    }
    .vscode_item {
      cursor: pointer;
      &:hover {
        font-weight: bold;
      }
    }
  }
}
</style>
