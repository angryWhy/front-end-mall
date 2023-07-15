<template>
    <div>
        <el-form :model="form" label-width="120px" v-loading="loading2" :rules="rules" ref="formRef">
            <el-form-item label="新增关联" prop="name" style="width:600px;">
                <el-cascader v-model="form.catelogId" :options="dataMenu" @change="handleNodeClick" :props="defaultProps"
                    ref="cascader" />
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%;margin-top:20px;">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="attrId" label="属性id" />
            <el-table-column prop="attrName" label="属性名称" />
            <el-table-column prop="valueSelect" label="可选值" />
            <el-table-column fixed="right" label="操作" width="120">
                <template #default="scope">
                    <el-button link type="danger" @click="handleDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottom-btn">
            <el-button type="primary" @click="onSubmit(form)">添加</el-button>
            <el-button @click="handleClose">取消</el-button>
        </div>
    </div>
</template>
<script>
import "element-plus/theme-chalk/el-message-box.css";

import { ref, reactive, onMounted } from "vue";
import { getPolicy } from "@/service/oss/oss"
import axios from "axios";
import { ElMessage, ElMessageBox } from 'element-plus'
import { menuList } from "@/service/productService/product/product"
import { relationSave } from "@/service/productService/product/brandRealtion"
import { attrRelationList, attrRelationDelete } from "@/service/productService/product/attr"
export default {
    name: 'formView',
    props: ["loading", "currentRow"],
    emits: ["handleClose"],
    components: {

    },
    setup(props, ctx) {
        const imageUrl = ref('');
        const formRef = ref(null);
        const ossPolicy = ref();
        const fileList = ref([]);
        const uploadData = ref(null);
        const dataMenu = ref();
        const tableData = ref([]);
        const cascader = ref(null);
        const form = ref({
            catelogId: "",
            name: props.currentRow.name,
            brandId: props.currentRow.brandId,
            catelogName: ""
        });
        const handleNodeClick = (value) => {
            console.log(value, form.value.catelogId);
            const data = cascader.value.getCheckedNodes()[0].data;
            form.value.catelogId = data.catId;
            form.value.catelogName = data.name;
        }
        const loadTableData = () => {
            attrRelationList(props.currentRow.attrGroupId
            ).then(res => {
                if (res.code == 0) {
                    tableData.value = res.page;
                }
            })
        }
        onMounted(() => {
            menuList().then(res => {
                dataMenu.value = res.data;
            })
            loadTableData();
        })
        const handleExceed = (files, fileList) => {
            console.log(files)
            uploadRef.value.clearFiles()  //清空上传文件（限制一个，所以直接清空即可）
            const file = files[0]
            uploadRef.value.handleStart(file)  //重新上传
        }
        const handleRemove = async (file, fileList) => {
            uploadRef.value.clearFiles()  //清空上传文件
        }
        //上传成功时弹框
        const handleSuccess = (res) => {
        }
        //选择文件
        const handleChange = (file) => {
            fileList.value.push(file)
        }
        const handleUpload = (UploadFile) => {
            console.log(UploadFile);
            getPolicy().then(res => {
                ossPolicy.value = res.data;
                uploadData.value = res.data;
                console.log(UploadFile, `-------`);
                const fd = new FormData();
                fd.append('OSSAccessKeyId', res.data.accessId);
                fd.append('policy', res.data.policy);
                fd.append('Signature', res.data.signature);
                fd.append('dir', res.data.dir);
                fd.append('key', res.data.dir + UploadFile.name);
                fd.append('file', UploadFile.raw);

                axios.post(res.data.host, fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(r => {
                    // 上传成功，返回图片完整路径
                    imageUrl.value = "https://my-project-mall1.oss-cn-hangzhou.aliyuncs.com/" + res.data.dir + UploadFile.name;
                    form.value.logo = "https://my-project-mall1.oss-cn-hangzhou.aliyuncs.com/" + res.data.dir + UploadFile.name;
                })
            })
        }
        const rules = reactive({
            name: [
                { required: true, message: '请输入家具', trigger: 'blur' }
            ]
        })
        const handleAvatarSuccess = (
            response,
            uploadFile
        ) => {
            console.log(response, uploadFile);
        }
        const defaultProps = {
            children: 'children',
            label: 'name',
            value: 'catId'
        }
        const onSubmit = () => {
            relationSave({
                ...form.value
            }).then(res => {
                if (res.code == 0) {
                    ElMessage({
                        message: '关联成功',
                        type: 'success',
                    })
                    loadTableData();
                } else {
                    ElMessage.error('关联失败')
                }
            })
        }
        const handleClose = () => {
            ctx.emit("handleClose");
        }
        const handleDel = (row) => {
            attrRelationDelete([{
                attrId: row.attrId,
                attrGroupId: props.currentRow.attrGroupId
            }]).then(res => {
                if (res.code == 0) {

                    ElMessage({
                        message: '删除成功',
                        type: 'success',
                    })
                    loadTableData();
                } else {
                    ElMessage.error('删除失败')
                }
            })
            loadTableData();
        }
        return {
            form,
            rules,
            formRef,
            imageUrl,
            handleAvatarSuccess,
            handleExceed,
            handleRemove,
            handleSuccess,
            handleChange,
            handleUpload,
            ossPolicy,
            fileList,
            uploadData,
            handleNodeClick,
            dataMenu,
            defaultProps,
            tableData,
            cascader,
            loadTableData,
            onSubmit,
            handleClose,
            handleDel
        }
    }
}
</script>
<style scoped>
.avatar-uploader .avatar {
    width: 50px;
    height: 50px;
    display: block;
}

::v-deep .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
    border: 2px solid;
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    text-align: center;
}

.bottom-btn {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
