<template>
    <div>
        <el-input v-model="key" placeholder="检索名称" style="width:200px;" />
        <el-button style="margin-left:20px;" type="primary" @click="handleSearch">查询</el-button>
        <el-button style="margin-left:20px;" type="primary" @click="handleAdd">新增</el-button>
        <el-table :data="tableData" style="width: 80%;margin-top:20px;">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="brandId" label="品牌id" width="180" />
            <el-table-column prop="name" label="品牌名称" width="180" />
            <el-table-column prop="descript" label="介绍" />
            <el-table-column prop="showStatus" label="显示状态" />
            <el-table-column prop="firstLetter" label="检索首字母" />
            <el-table-column prop="sort" label="排序" />
            <el-table-column fixed="right" label="操作" width="120">
                <template #default="scope">
                    <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button link type="danger" @click="handleDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:currentPage="pagination.pageIndex" background v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100, 500, 1000]" layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.totalcount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

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
import { ElMessage, ElMessageBox } from 'element-plus'
import {brandAdd,brandDel,brandList,brandLoad,brandUpdate} from "@/service/productService/product/brand"
import formView from "./Form.vue"
export default defineComponent({
    name: 'brandView',
    components: {
        formView
    },
    setup() {
        const addDialogVisible = ref(false);
        const editDialogVisible = ref(false);
        const tableData = ref([]);
        const currentChose = ref('');
        const key = ref();
        const pagination = ref({
            page: 1,
            pageSize: 20,
            totalcount: 0,
        });
        const handleSizeChange = (index) => {
            pagination.value.pageSize = index;
            loadTableData();
        };
        const handleCurrentChange = (index) => {
            pagination.value.pageIndex = index;
            loadTableData();
        };
        const loadTableData = () => {
            brandList({
                key:key.value,
                pageIndex:pagination.value.pageIndex,
                pageSize:pagination.value.pageSize
            }).then(res=>{
                tableData.value = res.page.list;
                pagination.value.pageIndex = res.page.currPage;
                pagination.value.totalcount = res.page.totalCount;

            })
        }
        const handleAdd = () => {
            addDialogVisible.value = true;

        }
        const handleEdit = (row) => {
            editDialogVisible.value = true;
            currentChose.value = row;
        }
        onMounted(()=>{
            loadTableData();
        })

        //提交数据
        const onSubmit = (data) => {
            let formRef = data.formRef;
            formRef.validate((valid) => {
                if (valid) {
                    brandAdd({
                        ...data.form
                    }).then(res => {
                        if (res.code == 0) {
                            ElMessage({
                                message: '添加成功',
                                type: 'success',
                            })
                            addDialogVisible.value = false;
                            loadTableData();
                        } else {
                            ElMessage.error('添加失败')
                        }
                    })
                }
            })
        }
        const handleSearch = () => {
            loadTableData()
        }
        const handleDel = (row) => {
            brandDel([row.brandId]).then(res=>{
                loadTableData();
            })
        }
        //编辑提交事件
        const onEdit = (data) => {
            let formRef = data.formRef;

            formRef.validate((valid) => {
                if (valid) {
                    brandUpdate({
                        brandId:currentChose.value.brandId,
                        ...data.form
                    }).then(res => {
                        if (res.code == 0) {
                            ElMessage({
                                message: '编辑成功',
                                type: 'success',
                            })
                            editDialogVisible.value = false;
                            loadTableData();
                        } else {
                            ElMessage.error('编辑失败')
                        }
                    })
                }
            })
        }
        return {
            addDialogVisible,
            editDialogVisible,
            tableData,
            handleSizeChange,
            handleCurrentChange,
            pagination,
            handleAdd,
            handleEdit,
            onSubmit,
            onEdit,
            currentChose,
            handleSearch,
            key,
            handleDel
        }
    }
})
</script>

<style scoped></style>