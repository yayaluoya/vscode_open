<script  lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
} from "@vue/runtime-core";
import { ConfigAC } from "./api/ConfigAC";
import { NApi } from "./_d/api";
import { Mes } from "./mes/Mes";
import { ItemAC } from "./api/ItemAC";
import { ComAC } from "./api/ComAC";
import { ObjectUtils } from "yayaluoya-tool/dist/obj/ObjectUtils";
import { FileT } from "yayaluoya-tool/dist/web/FileT";
import { getFile } from "yayaluoya-tool/dist/web/getFile";
import { FormInstance, FormRules } from "element-plus";
import SecondConfirmation from "./components/SecondConfirmation.vue";
import {
  Calendar,
  Search,
  CirclePlus,
  Download,
  Upload,
} from "@element-plus/icons-vue";

const formData_: NApi.IItemD = {
  /** id */
  id: undefined,
  /** 一个简称，可以重复 */
  key: "",
  /** 图标，本地文件路径 */
  icon: "",
  /** 标题 */
  title: "",
  /** 项目路径 */
  path: "",
  /** 项目打开次数 */
  openNumber: 0,
};

export default defineComponent({
  components: { SecondConfirmation },
  setup(ctx) {
    const show = ref<"list" | "config">("list");
    const list = ref<NApi.IItemD[]>([]);
    const config = ref<NApi.IConfig>({
      port: 80,
    });
    const filterInput = ref("");

    function editConfig() {
      ConfigAC.instance.edit(config.value).catch((e) => {
        Mes.handleHttpCatch(e);
        loadCofing();
      });
    }

    onMounted(() => {
      loadCofing();
      loadList();
    });

    function loadCofing() {
      ConfigAC.instance.get().then((data) => {
        for (let i in data) {
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

    function open(item: NApi.IItemD) {
      ItemAC.instance
        .open(item.path)
        .catch(Mes.handleHttpCatch)
        .then(() => {
          item.openNumber++;
        });
    }

    const list_ = computed(() => {
      let reg = new RegExp(filterInput.value, "i");
      return list.value.filter((_) => {
        return reg.test(_.key) || reg.test(_.title) || reg.test(_.path);
      });
    });

    const formData = ref<NApi.IItemD>(ObjectUtils.clone2(formData_));
    const formDataRules = reactive<FormRules>({
      key: {
        required: true,
        message: "必须输入key",
        trigger: "blur",
      },
      path: {
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
        if (formData.value.id) {
          p = ItemAC.instance.edit(formData.value).then(() => {
            Mes.success("编辑成功");
          });
        } else {
          p = ItemAC.instance.add(formData.value).then(() => {
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
    function remove(item: NApi.IItemD) {
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
          let list: NApi.IItemD[] = [];
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
      FileT.download(
        URL.createObjectURL(
          new File(
            [new Blob([JSON.stringify(list.value)])],
            "vscodeOpenItemList.json"
          )
        ),
        "vscodeOpenItemList.json"
      );
    }

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
    };
  },
});
</script>

<template>
  <div class="home">
    <div class="content">
      <div class="nav">
        <span>vscodeOpen</span>
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
            <el-table-column prop="key" label="key" />
            <el-table-column prop="icon" label="图标" width="100">
              <template #default="{ row }">
                <el-image
                  style="width: 75px; border-radius: 5px"
                  :src="getFileUrl(row.icon)"
                  fit="cover"
                  :preview-src-list="[getFileUrl(row.icon)]"
                  preview-teleported
                />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="path" label="路径" />
            <el-table-column prop="openNumber" width="90px" label="打开次数" />
            <el-table-column fixed="right" label="操作" width="130">
              <template #default="{ row }">
                <el-button
                  link
                  type="success"
                  size="small"
                  @click="open(row)"
                  style="font-weight: bold"
                  >打开</el-button
                >
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
        <el-form v-if="show == 'config'" :model="config" label-width="120px">
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
        </el-form>
      </div>
    </div>
    <el-dialog v-model="showDialog" title="添加/编辑项目" width="600px">
      <el-form
        ref="formEl"
        :model="formData"
        :rules="formDataRules"
        label-width="60px"
      >
        <el-form-item label="key" prop="key">
          <el-input v-model="formData.key" placeholder="请输入key" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="formData.icon" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="formData.path" placeholder="请输入路径" />
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
      border: 1px solid #e6e9ee;
      padding: 0 20px;
      width: 100%;
      box-sizing: border-box;
      border-radius: 12px;
      margin-bottom: 20px;
      background-color: white;
      > * {
        margin-right: 20px;
      }
      > span:nth-child(1) {
        font-size: 30px;
        font-weight: bold;
        color: #409eff;
      }
      > span:nth-child(2),
      > span:nth-child(3) {
        font-size: 16px;
        color: gray;
        cursor: pointer;
        &:hover {
          color: #2f495e;
        }
        &.on {
          font-weight: bold;
          color: #2f495e;
          text-decoration: underline;
        }
      }
    }
    > .content {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      border: 1px solid #e6e9ee;
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
      border-radius: 12px;
      margin-bottom: 20px;
      background-color: white;
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
      }
    }
  }
}
</style>
