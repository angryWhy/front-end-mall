<template>
    <div>

        <el-form :model="form" label-width="120px" v-loading="loading2" :rules="rules" ref="formRef">
            <el-form-item label="属性名">
                <el-input v-model="form.attrName" />
            </el-form-item>
            <el-form-item label="是否需要检索">
                <el-select v-model="form.searchType" class="m-2" style="width:100%;">
                    <el-option label="需要" value="1" />
                    <el-option label="不需要" value="0" />
                </el-select>
            </el-form-item>
            <el-form-item label="icon">
                <el-input v-model="form.icon" />
            </el-form-item>
            <el-form-item label="可选值">
                <el-input v-model="form.valueSelect" />
            </el-form-item>
            <el-form-item label="属性类型">
                <el-select v-model="form.attrType" class="m-2" style="width:100%;">
                    <el-option label="销售属性" value="0" />
                    <el-option label="基本属性" value="1" />
                    <el-option label="全选" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="启用状态">
                <el-select v-model="form.enable" class="m-2" style="width:100%;">
                    <el-option label="禁用" value="0" />
                    <el-option label="启用" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="所属分类" >
                <el-cascader v-model="form.catelogId" :options="dataMenu" @change="handleNodeClick" :props="defaultProps"
                    ref="cascader" style="width:100%;"/>
            </el-form-item>
            <el-form-item label="所属分组" >
                <el-select v-model="form.attrGroupId" class="m-2" style="width:100%;">              
                    <template v-for="item in category" :key="item">
                        <el-option :label="item.attrGroupName" :value="item.attrGroupId" />
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="快速展示">
                <el-select v-model="form.showDesc" class="m-2" style="width:100%;">
                    <el-option label="否" value="0" />
                    <el-option label="是" value="1" />
                </el-select>
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
import { attrLoad,attrList,attrList2 } from "@/service/productService/product/attr"
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
            attrName: "",
            searchType: "",
            icon: "",
            valueSelect: "",
            attrType: "0",
            enable: "1",
            catelogId: "",
            showDesc: "1",
            attrGroupId:""
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
                dataMenu.value = res.data;
            })
            if (props.currentRow) {
                attrLoad(props.currentRow.attrGroupId).then(res => {
                    form.value.catelogId = res.pmsAttrGroup.catelogPath;
                    console.log();
                })
            }
        });
        const handleNodeClick = (value) => {
            console.log(value, form.value.catelogId);
            const data = cascader.value.getCheckedNodes()[0].data;
            form.value.catelogId = data.catId;
            form.value.catelogName = data.name;
            attrList2(form.value.catelogId).then(res => {
                    if (res.code == 0) {
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
