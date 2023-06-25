<template>
    <div>

        <el-form :model="form" label-width="120px" v-loading="loading2" :rules="rules" ref="formRef">
            <el-form-item label="品牌名称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
          
            <el-form-item label="介绍">
                <el-input v-model="form.descript" />
            </el-form-item>
            <el-form-item label="显示状态">
                <el-input v-model="form.showStatus" />
            </el-form-item>
            <el-form-item label="检索首字母">
                <el-input v-model="form.firstLetter" />
            </el-form-item>
            <el-form-item label="排序">
                <el-input v-model="form.sort" />
            </el-form-item>
            <el-form-item label="品牌logo">
                <el-upload :show-file-list="false" :before-upload="handleUpload" :on-remove="handleRemove" action=""
                    method="POST" class="avatar-uploader">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <slot name="ok" :form="form" :formRef="formRef"></slot>
                <slot name="cancel"></slot>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import "element-plus/theme-chalk/el-message-box.css";

import { ref, reactive } from "vue";
import { getPolicy } from "@/service/oss/oss"
import axios from "axios";
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
        const form = ref({
            name: "",
            logo: "",
            descript: "",
            showStatus: "",
            firstLetter: "",
            sort: ""
        });

        if (props.currentRow != null) {
            form.value = {
                name: props.currentRow.name,
                logo: props.currentRow.logo,
                descript: props.currentRow.descript,
                showStatus: props.currentRow.showStatus,
                firstLetter: props.currentRow.firstLetter,
                sort: props.currentRow.sort,
            }

        }
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
                console.log(UploadFile,`-------`);
                const fd = new FormData();
                fd.append('OSSAccessKeyId',res.data.accessId);
                fd.append('policy',res.data.policy);
                fd.append('Signature',res.data.signature);
                fd.append('dir',res.data.dir);
                fd.append('key',res.data.dir+UploadFile.name);
                fd.append('file',UploadFile.raw);
                
                axios.post(res.data.host, fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(r => {
                    // 上传成功，返回图片完整路径
                    imageUrl.value = "https://my-project-mall1.oss-cn-hangzhou.aliyuncs.com/"+res.data.dir+ UploadFile.name;
                    form.value.logo = "https://my-project-mall1.oss-cn-hangzhou.aliyuncs.com/"+res.data.dir+ UploadFile.name;
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
    uploadData
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
