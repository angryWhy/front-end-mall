<template>
    <div>

        <el-form :model="form" label-width="120px" v-loading="loading2" :rules="rules" ref="formRef">
            <el-form-item label="品牌名称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="品牌logo">
                <el-upload class="avatar-uploader" 
                :action="ossPolicy==undefined?'':ossPolicy.host"
                    :show-file-list="false" 
                    :on-exceed="handleExceed" 
                    :before-upload="handleUpload"
                    :on-remove="handleRemove" 
                    :on-change="handleChange" 
                    v-model:file-list="fileList">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
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
        const handleUpload = () => {
            getPolicy().then(res => {
                console.log(res.data);
                ossPolicy.value = res.data;
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
            fileList
        }
    }
}
</script>
<style scoped></style>
  @/service/productService/product/product