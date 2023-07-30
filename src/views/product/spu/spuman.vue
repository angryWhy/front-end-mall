<template>
    <div>
        <el-container>

            <el-main>
                <el-form :inline="true" :model="formInline">
                    <el-form-item label="分类">
                        <el-cascader v-model="formInline.catelogId" :options="dataMenu" @change="handleChange"
                            :props="defaultProps"  />
                    </el-form-item>
                    <el-form-item label="品牌">
                        <el-select v-model="formInline.region" clearable>
                            <el-option label="Zone one" value="shanghai" />
                            <el-option label="Zone two" value="beijing" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="formInline.region" clearable>
                            <el-option label="Zone one" value="shanghai" />
                            <el-option label="Zone two" value="beijing" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="检索">
                        <el-input v-model="formInline.date" clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-table :data="tableData" style="margin-top:20px;">
                        <el-table-column type="selection" width="55" />
                        <el-table-column prop="attrGroupId" label="id" width="180" />
                        <el-table-column prop="attrGroupName" label="名称" width="180" />
                        <el-table-column prop="catelogId" label="描述" />
                        <el-table-column prop="descript" label="分类ID" />
                        <el-table-column prop="icon" label="品牌" />
                        <el-table-column prop="sort" label="重量" />
                        <el-table-column prop="sort" label="上架状态">
                        </el-table-column>
                        <el-table-column prop="sort" label="创建时间" />
                        <el-table-column prop="sort" label="修改时间" />
                        <el-table-column fixed="right" label="操作" width="200">
                            <template #default="scope">
                                <el-button link type="primary" @click="handleRelated(scope.row)">上架</el-button>
                                <el-button link type="primary" @click="handleEdit(scope.row)">规格</el-button>
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
                    <el-dialog v-model="relationDialogVisible" title="关联" width="650px" center destroy-on-close="true"
                        @close="handleClose">
                        <relation :loading="loading" :currentRow="currentChose" @handleClose="handleClose" />

                    </el-dialog>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { menuList } from "@/service/productService/product/product"
import { ElMessage, ElMessageBox } from 'element-plus'
import formView from "./Form"
import relation from './relation'
import { attrList, attrAdd, attrUpdate } from "@/service/productService/product/attr"
export default defineComponent({
    name: 'categoryView',
    components: {
        formView,
        relation
    },
    setup() {
        const dataMenu = ref([]);
        const currentChose = ref();
        const catelogId = ref(0);
        const addDialogVisible = ref(false);
        const editDialogVisible = ref(false);
        const key = ref(1);
        const formInline = ref({
            catelogId: '',
            region: '',
            date: '',
        })
        const tableData = ref([]);
        const relationDialogVisible = ref(false);
        const pagination = ref({
            pageIndex: 1,
            pageSize: 20,
            totalcount: 0,
        });
        const loadTableData = () => {
            attrList({
                key: key.value
            }, catelogId.value).then(res => {
                if (res.code == 0 && res.page.list.length > 0) {
                    tableData.value = res.page.list;
                }
            })
        }
        onMounted(() => {
            menuList().then(res => {
                dataMenu.value = res.data;
            })
            loadTableData();
        })
        const defaultProps = ref({
            value: "catId",
            label: "name",
            children: "children"
        });
        const handleChange = (value) => {
            console.log(value);
            formInline.value.catelogId = value[2];
            console.log(formInline.value.catelogId);
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
                    attrAdd({
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
        const handleRelated = (row) => {
            relationDialogVisible.value = true;
            currentChose.value = row;
        }
        //编辑提交事件
        const onEdit = (data) => {
            let formRef = data.formRef;
            formRef.validate((valid) => {
                if (valid) {
                    attrUpdate({
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
        const handleClose = () => {
            addDialogVisible.value = false;
            editDialogVisible.value = false;
            relationDialogVisible.value = false;
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
            handleChange,
            tableData,
            addDialogVisible,
            editDialogVisible,
            handleAdd,
            handleEdit,
            key,
            loadTableData,
            handleSearch,
            relationDialogVisible,
            handleRelated,
            handleClose,
            formInline
        }
    }
})
</script>

<style scoped></style>@/service/productService/product/product