<template>
    <div>
        <el-container>

            <el-main>
                <el-form :inline="true" :model="formInline">
                    <el-form-item label="分类">
                        <el-cascader v-model="formInline.catelogId" :options="dataMenu" @change="handleChange"
                            :props="defaultProps" />
                    </el-form-item>
                    <el-form-item label="品牌">
                        <el-select v-model="formInline.brandId" clearable>
                            <el-option v-for="item in brandOptions" :key="item" :label="item.name" :value="item.brandId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="价格">
                        <el-input-number v-model="formInline.min" :min="0" />-
                        <el-input-number v-model="formInline.max" :min="1" />
                    </el-form-item>
                    <el-form-item label="检索">
                        <el-input v-model="formInline.key" clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadTableData">查询</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-table :data="tableData" style="margin-top:20px;" >
                        <el-table-column type="selection" width="55" />
                        <el-table-column prop="id" label="id" width="180" />
                        <el-table-column prop="skuName" label="名称" width="180" />
                        <el-table-column prop="skuTitle" label="标题" width="180" show-overflow-tooltip/>
                        <el-table-column prop="skuSubtitle" label="子标题" width="180" show-overflow-tooltip/>
                        <el-table-column prop="skuDefaultImg" label="默认图片">
                            <template #default="scope">
                                <img :src="scope.row.skuDefaultImg" style="width:100px;height:100px;"/>
                            </template>
                        </el-table-column>
                        <el-table-column prop="catalogId" label="分类ID" />
                        <el-table-column prop="price" label="价格" />
                        <el-table-column prop="saleCount" label="销量" />
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
import { brandList } from '@/service/productService/product/brand'
import { skuList } from "@/service/productService/product/sku"
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
        const key = ref("");
        const formInline = ref({
            catelogId: '',
            brandId: '',
            min: '',
            max: '',
            key: ""
        })
        const tableData = ref([]);
        const relationDialogVisible = ref(false);
        const brandOptions = ref([]);
        const pagination = ref({
            pageIndex: 1,
            pageSize: 20,
            totalcount: 0,
        });
        const loadTableData = () => {
            skuList({
                ...formInline.value
            }, catelogId.value).then(res => {
                if (res.code == 0) {
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
            loadBrand();
        }
        const loadBrand = () => {
            brandList({
                catId: formInline.value.catelogId
            }).then(res => {
                brandOptions.value = res.page.list;
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
            formInline,
            loadBrand,
            brandOptions
        }
    }
})
</script>

<style scoped></style>@/service/productService/product/product