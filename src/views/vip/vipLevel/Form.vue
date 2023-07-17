<template>
    <div>

        <el-form :model="form" label-width="120px" v-loading="loading2" :rules="rules" ref="formRef">
            <el-form-item label="等级名称">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="所需成长值">
                <el-input v-model="form.growthPoint" />
            </el-form-item>
            <el-form-item label="默认等级">
                <el-select v-model="form.defaultStatus" style="width:100%;">
                    <el-option label="不是" value="0" />
                    <el-option label="是" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="免运费标准">
                <el-input v-model="form.freeFreightPoint" />
            </el-form-item>
            <el-form-item label="评价成长值">
                <el-input v-model="form.commentGrowthPoint" />
            </el-form-item>
            <el-form-item label="免邮特权">
                <el-select v-model="form.priviledgeFreeFreight" class="m-2" style="width:100%;">
                    <el-option label="具有" value="0" />
                    <el-option label="不具有" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="会员价" >
                <el-select v-model="form.priviledgeMemberPrice" class="m-2" style="width:100%;">
                    <el-option label="具有" value="0" />
                    <el-option label="不具有" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="生日特权" >
                <el-select v-model="form.priviledgeBirthday" class="m-2" style="width:100%;">
                    <el-option label="具有" value="0" />
                    <el-option label="不具有" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.note" />
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
import { vipLevelList,vipLevelAdd,vipLevelLoad,vipLevelUpdate  } from "@/service/vipService/vip/vipLevel"
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
        const dataMenu = ref();
        const prop = ref({
            value: "catId",
            label: "name",
            children: "children"
        });
        const cascader = ref(null);
        const uploadData = ref(null);
        const options = ref([]);
        const category = ref([])
        const form = ref({
            name: "",
            growthPoint: "",
            defaultStatus: "",
            freeFreightPoint: "",
            commentGrowthPoint: "",
            priviledgeFreeFreight: "",
            priviledgeMemberPrice: "",
            priviledgeBirthday:"",
            note:""
        });

        if (props.currentRow != null) {
            form.value.name = props.currentRow.name,
            form.value.growthPoint = String(props.currentRow.growthPoint),
            form.value.defaultStatus = props.currentRow.defaultStatus,
            form.value.id = props.currentRow.id,
            form.value.freeFreightPoint = String(props.currentRow.freeFreightPoint),
            form.value.commentGrowthPoint = String(props.currentRow.commentGrowthPoint),
            form.value.priviledgeFreeFreight  = String(props.currentRow.priviledgeFreeFreight),
            form.value.priviledgeMemberPrice = props.currentRow.priviledgeMemberPrice,
            form.value.priviledgeBirthday =  String(props.currentRow.priviledgeBirthday),
            form.value.note = props.currentRow.note
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
        
        });
        const handleNodeClick = (value) => {
            console.log(value, form.value.catelogId);
            const data = cascader.value.getCheckedNodes()[0].data;
            form.value.catelogId = data.catId;
            form.value.catelogName = data.name;
            attrList2(form.value.catelogId).then(res => {
                    if (res.code == 0) {
                        form.value.attrGroupId = "";
                        category.value = res.page.list;
                    }
                })
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
            options,
            prop,
            cascader,
            handleNodeClick,
            dataMenu,
            defaultProps,
            category
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
