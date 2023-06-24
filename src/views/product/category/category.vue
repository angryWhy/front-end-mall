<template>
    <div>
        <el-tree :data="dataMenu" :props="defaultProps" :expand-on-click-node="false" :node-key="catId">
            <template #default="{ node, data }">
                <span class="custom-tree-node">
                    <span>{{ node.label }}</span>
                    <span>
                        <el-button v-if="node.level <= 2" @click="handleOpen(data)" link type="primary"> 添加 </el-button>
                        <el-button v-if="node.childNodes.length == 0 && node.level != 2" @click="treeDelete(node, data)"
                            link type="danger"> 删除
                        </el-button>
                        <el-button @click="handleEdit(node, data)" link type="info"> 编辑
                        </el-button>
                    </span>
                </span>
            </template>
        </el-tree>
        <el-dialog v-model="addDialogVisible" title="添加" width="650px" center destroy-on-close="true" @close="handleClose">
            <form-view :loading="loading">
                <template #ok="form">
                    <el-button type="primary" @click="onSubmit(form)">添加</el-button>
                </template>
                <template #cancel>
                    <el-button @click="handleClose">取消</el-button>
                </template>
            </form-view>
        </el-dialog>
        <el-dialog v-model="editDialogVisible" title="编辑" width="650px" center destroy-on-close="true" @close="handleClose">
            <form-view :loading="loading" :currentRow="currentChose">
                <template #ok="form">
                    <el-button type="primary" @click="onEdit(form)">提交</el-button>
                </template>
                <template #cancel>
                    <el-button @click="handleClose">取消</el-button>
                </template>
            </form-view>
        </el-dialog>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { menuList, menuAdd, menuDel,menuUpdate } from "@/service/productService/product/product"
import { ElMessage, ElMessageBox } from 'element-plus'
import formView from "../category/Form.vue"
export default defineComponent({
    name: 'categoryView',
    components: {
        formView
    },
    setup() {
        const addDialogVisible = ref(false);
        const editDialogVisible = ref(false);
        const dataMenu = ref([]);
        const currentChose = ref();
        const handleNodeClick = (data) => {
            console.log(data)
        }
        const treeAdd = () => {

        }
        onMounted(() => {
            menuList().then(res => {
                dataMenu.value = res.data;
            })
        })
        const handleClose = () => {
            addDialogVisible.value = false;
            editDialogVisible.value = false;
        }
        const handleOpen = (data) => {
            addDialogVisible.value = true;
            currentChose.value = data;
            console.log(currentChose.value);
        }
        const handleEdit = (data) => {
            editDialogVisible.value = true;
            currentChose.value = data;
            console.log(currentChose.value);
        }
        const treeDelete = (data) => {
            ElMessageBox.confirm(
                `是否确定删除${data.data.name}菜单?`,
                '提示信息',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
                .then(() => {
                    menuDel([data.data.catId]).then(res => {
                        if (res.code == 0) {
                            ElMessage({
                                type: 'success',
                                message: '删除成功',
                            })
                            menuList().then(res => {
                                dataMenu.value = res.data;
                            })
                        } else {
                            ElMessage({
                                type: 'error',
                                message: '删除失败',
                            })
                        }
                    })

                })
                .catch(() => {
                    ElMessage({
                        type: 'info',
                        message: '删除失败',
                    })
                })
        }
        const defaultProps = {
            children: 'children',
            label: 'name',
        }

        //提交数据
        const onSubmit = (data) => {
            let formRef = data.formRef;
            formRef.validate((valid) => {
                if (valid) {
                    menuAdd({
                        parentCid: currentChose.value.catId,
                        catLevel: currentChose.value.catLevel * 1 + 1,
                        showStatus: 1,
                        sort: 0,
                        ...data.form
                    }).then(res => {
                        if (res.code == 0) {
                            ElMessage({
                                message: '添加成功',
                                type: 'success',
                            })
                            addDialogVisible.value = false;
                            menuList().then(res => {
                                dataMenu.value = res.data;
                            })
                        } else {
                            ElMessage.error('添加失败')
                        }
                    })
                }
            })
        }
        //编辑提交事件
        const onEdit = (data) => {
            let formRef = data.formRef;

            formRef.validate((valid) => {
                if (valid) {
                    menuUpdate({
                        catId:currentChose.value.data.catId,
                        ...data.form
                    }).then(res => {
                        if (res.code == 0) {
                            ElMessage({
                                message: '编辑成功',
                                type: 'success',
                            })
                            editDialogVisible.value = false;
                            menuList().then(res => {
                                dataMenu.value = res.data;
                            })
                        } else {
                            ElMessage.error('编辑失败')
                        }
                    })
                }
            })
        }
        return {
            dataMenu,
            handleNodeClick,
            defaultProps,
            treeAdd,
            treeDelete,
            onSubmit,
            addDialogVisible,
            editDialogVisible,
            handleClose,
            handleOpen,
            handleEdit,
            onEdit,
            currentChose
        }
    }
})
</script>

<style scoped></style>@/service/productService/product/product