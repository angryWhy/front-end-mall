<template>
    <div>

        <el-form :model="form" label-width="120px" v-loading="loading2" :rules="rules" ref="formRef">
            <el-form-item label="属性名称" prop="attrGroupName">
                <el-input v-model="form.attrGroupName" />
            </el-form-item>
            <el-form-item label="介绍">
                <el-input v-model="form.descript" />
            </el-form-item>
            <el-form-item label="排序">
                <el-input v-model="form.sort" />
            </el-form-item>
            <el-form-item label="分类id">
                <el-cascader v-model="form.catelogId" :options="options" @change="handleChange" :props="prop" />
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

import { ref, reactive, onMounted } from "vue";
import { getPolicy } from "@/service/oss/oss"
import axios from "axios";
import { menuList } from "@/service/productService/product/product"
import { attrLoad } from "@/service/productService/product/attr"
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
        const prop = ref({
            value: "catId",
            label: "name",
            children: "children"
        });
        const uploadData = ref(null);
        const options = ref([]);
        const form = ref({
            attrGroupName: "",
            logo: "",
            descript: "",
            catelogId: "",
            sort: ""
        });

        if (props.currentRow != null) {
            form.value = {
                attrGroupId: props.currentRow.attrGroupId,
                attrGroupName: props.currentRow.attrGroupName,
                logo: props.currentRow.logo,
                descript: props.currentRow.descript,
                catelogId: props.currentRow.catelogId,
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
        const handleChange = (value) => {
            form.value.catelogId = value[2];
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
            attrGroupName: [
                { required: true, message: '请输入家具', trigger: 'blur' }
            ]
        })
        const handleAvatarSuccess = (
            response,
            uploadFile
        ) => {
            console.log(response, uploadFile);
        }
        onMounted(() => {
            menuList().then(res => {
                options.value = res.data;
            })
            if (props.currentRow) {
                attrLoad(props.currentRow.attrGroupId).then(res => {
                    form.value.catelogId = res.pmsAttrGroup.catelogPath;
                    console.log();
                })
            }
        });

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
            options,
            prop
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
