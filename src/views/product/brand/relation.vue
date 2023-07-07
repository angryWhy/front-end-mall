<template>
    <div>
        <el-form :model="form" label-width="120px" v-loading="loading2" :rules="rules" ref="formRef">
            <el-form-item label="新增关联" prop="name" style="width:600px;">
                <el-cascader v-model="form.catelogId" :options="dataMenu" @change="handleNodeClick" :props="defaultProps" ref="cascader"/>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%;margin-top:20px;">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="attrGroupId" label="属性id" width="180" />
            <el-table-column prop="attrGroupName" label="属性名称" width="180" />
            <el-table-column prop="catelogId" label="分类id" />
            <el-table-column prop="descript" label="描述" />
            <el-table-column prop="icon" label="图标" />
            <el-table-column prop="sort" label="排序" />
            <el-table-column fixed="right" label="操作" width="120">
                <template #default="scope">
                    <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button link type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import "element-plus/theme-chalk/el-message-box.css";

import { ref, reactive, onMounted } from "vue";
import { getPolicy } from "@/service/oss/oss"
import axios from "axios";
import { menuList } from "@/service/productService/product/product"
import { relationSave } from "@/service/productService/product/brand"
export default {
    name: 'formView',
    props: ["loading", "currentRow"],
    components: {

    },
    setup(props) {
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
            name:props.currentRow.name,
            brandId:props.currentRow.brandId,
            catelogName:""
        });
        const handleNodeClick = (value) => {
            console.log(value,form.value. catelogId);
            const data = cascader.value.getCheckedNodes()[0].data;
            form.value.catelogId = data.catId;
            form.value.catelogName = data.name;
        }
        onMounted(() => {
            menuList().then(res => {
                dataMenu.value = res.data;
            })
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
            cascader
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
</style>
