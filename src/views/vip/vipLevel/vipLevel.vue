<template>
    <div>
        <el-container>
        
            <el-main>
                <div>
                    <el-input v-model="key" placeholder="检索名称" style="width:200px;" />
                    <el-button style="margin-left:20px;" type="primary" @click="handleSearch">查询</el-button>
                    <el-button style="margin-left:20px;" type="primary" @click="handleAdd">新增</el-button>
                    <el-table :data="tableData" style="width: 80%;margin-top:20px;">
                        <el-table-column type="selection" width="55" />
                        <el-table-column prop="id" label="id"  />
                        <el-table-column prop="name" label="等级名称"  />
                        <el-table-column prop="growthPoint" label="所需成长值"  />
                        <el-table-column prop="defaultStatus" label="默认等级"  />
                        <el-table-column prop="freeFreightPoint" label="免运费标准" />
                        <el-table-column prop="commentGrowthPoint" label="评价成长值" />
                        <el-table-column prop="priviledgeFreeFreight" label="免邮特权" />
                        <el-table-column prop="priviledgeMemberPrice" label="会员价格" />
                        <el-table-column prop="priviledgeBirthday" label="生日特权" />
                        <el-table-column prop="note" label="备注" />
                        <el-table-column fixed="right" label="操作" width="120">
                            <template #default="scope">
                                <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                                <el-button link type="danger" @click="handleDelte(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination v-model:currentPage="pagination.pageIndex" background
                        v-model:page-size="pagination.pageSize" :page-sizes="[10, 20, 50, 100, 500, 1000]"
                        layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalcount"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange" />

                    <el-dialog v-model="addDialogVisible" title="添加" width="650px" center destroy-on-close="true"
                        @close="handleClose">
                        <form-view :loading="loading">
                            <template #ok="form">
                                <el-button type="primary" @click="onSubmit(form)">添加</el-button>
                            </template>
                            <template #cancel>
                                <el-button @click="handleClose">取消</el-button>
                            </template>
                        </form-view>
                    </el-dialog>
                    <el-dialog v-model="editDialogVisible" title="编辑" width="650px" center destroy-on-close="true"
                        @close="handleClose">
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
            </el-main>
        </el-container>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'

import { ElMessage, ElMessageBox } from 'element-plus'
import formView from "./Form.vue"
import { vipLevelList,vipLevelAdd,vipLevelLoad,vipLevelUpdate,vipLevelDel } from "@/service/vipService/vip/vipLevel"
export default defineComponent({
    name: 'vipLevelView',
    components: {
        formView
    },
    setup() {
        const dataMenu = ref([]);
        const currentChose = ref();
        const catelogId = ref(0);
        const addDialogVisible = ref(false);
        const editDialogVisible = ref(false);
        const key = ref("");
        const tableData = ref([]);
        const pagination = ref({
            pageIndex: 1,
            pageSize: 20,
            totalcount: 0,
        });
        const loadTableData = () => {
            vipLevelList({
                key: key.value
            }, catelogId.value).then(res => {
                if (res.code == 0 ) {
                    tableData.value = res.page.list;
                }
            })
        }
        onMounted(() => {
            loadTableData();
        })
        const defaultProps = {
            children: 'children',
            label: 'name',
        }
        const handleDelte = (row) => {
            vipLevelDel([
                row.id
            ]).then(res => {
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
        }
        const handleSizeChange = (index) => {
            pagination.value.pageSize = index;
            loadTableData();
        };
        const handleCurrentChange = (index) => {
            pagination.value.pageIndex = index;
            loadTableData();
        };
        //提交数据
        const onSubmit = (data) => {
            let formRef = data.formRef;
            formRef.validate((valid) => {
                if (valid) {
                    vipLevelAdd({
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
        const handleAdd = () => {
            addDialogVisible.value = true;
        }
        const handleSearch = () => {
            loadTableData()
        }
        const handleEdit = (row) => {
            editDialogVisible.value = true;
            currentChose.value = row;
        }
        //编辑提交事件
        const onEdit = (data) => {
            let formRef = data.formRef;
            formRef.validate((valid) => {
                if (valid) {
                    vipLevelUpdate({
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
            dataMenu,
            defaultProps,
            currentChose,
            pagination,
            handleSizeChange,
            handleCurrentChange,
            onSubmit,
            onEdit,
            tableData,
            addDialogVisible,
            editDialogVisible,
            handleAdd,
            handleEdit,
            key,
            loadTableData,
            handleSearch,
            handleDelte
        }
    }
})
</script>

<style scoped></style>@/service/productService/product/product