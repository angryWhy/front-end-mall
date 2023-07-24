<template>
    <div>
        <el-steps :active="active" finish-status="success">
            <el-step title="基本信息" />
            <el-step title="规格参数" />
            <el-step title="销售属性" />
            <el-step title="SKU信息" />
            <el-step title="保存完成" />
        </el-steps>
        <el-card class="box-card" v-show="active == 0">
            <el-form :model="form" ref="firstFormRef" label-width="120px">
                <el-form-item label="商品名称">
                    <el-input v-model="firstForm.name" />
                </el-form-item>
                <el-form-item label="商品描述">
                    <el-input v-model="firstForm.desc" />
                </el-form-item>
                <el-form-item label="选择分类">
                    <el-cascader v-model="firstForm.catelogId" :options="dataMenu" @change="handleNodeClick"
                        :props="defaultProps" ref="cascader" />
                </el-form-item>
                <el-form-item label="选择品牌">
                    <el-select v-model.number="firstForm.age" class="m-2" style="width:100%;">
                        <el-option v-for="item in brandOptions" :key="item" :label="item.brandName" :value="item.brandId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model.number="firstForm.age" />
                </el-form-item>
                <el-form-item label="设置积分">
                    <el-input v-model.number="firstForm.age" />
                </el-form-item>
                <el-form-item label="成长值">
                    <el-input v-model.number="firstForm.age" />
                </el-form-item>
                <el-form-item label="商品介绍">
                    <el-input v-model.number="firstForm.age" />
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="box-card" v-show="active == 1">
            <el-tabs tab-position="left" style="height: 200px">
                <template v-for="item in tabsOptions" :key="item">
                    <el-tab-pane :label="item.attrGroupName">
                        <el-form :model="form" ref="firstFormRef" label-width="120px">
                            <el-form-item label="">
                                <el-input v-model="firstForm.name" />
                            </el-form-item>
                            <el-form-item label="商品介绍">
                                <el-input v-model.number="firstForm.age" />
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </template>
            </el-tabs>
        </el-card>
        <div class="btn-group">
            <div style="width:250px;">
                <el-button type="primary" @click="handleNext()" v-if="active != 4">下一步</el-button>
                <el-button type="primary" @click="handleSubmit()" v-else>提交</el-button>
                <el-button type="primary" @click="active = active - 1" v-if="active != 0 || active != 4">上一步</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { menuList } from "@/service/productService/product/product"
import { attrGroupWithAttrs } from "@/service/productService/product/attr"
import { brandAndCatelogList } from "@/service/productService/product/brandRealtion"
export default defineComponent({
    name: 'releasesView',
    setup() {
        const active = ref(0);
        const form = ref(null);
        const dataMenu = ref();
        const cascader = ref(null);
        const firstForm = ref({
            name: "",
            desc: "",
            catelogId: "",
            age: "",
            catelogName: ""
        });
        const tabsOptions = ref([]);
        const brandOptions = ref([]);
        const defaultProps = {
            children: 'children',
            label: 'name',
            value: 'catId'
        }
        onMounted(() => {
            menuList().then(res => {
                dataMenu.value = res.data;
            })

        })
        const loadCatelogAndBrand = (id) => {
            brandAndCatelogList({
                catId: id
            }).then(res => {
                brandOptions.value = res.data;
            })
        }
        const handleSubmit = () => {
            active.value = active.value + 1;
        }
        const handleNodeClick = (value) => {
            console.log(value);
            const data = cascader.value.getCheckedNodes()[0].data;
            firstForm.value.catelogId = data.catId;
            firstForm.value.catelogName = data.name;
            loadCatelogAndBrand(data.catId);
        }
        const handleNext = () => {
            active.value = active.value + 1;
            if (active.value == 1) {
                attrGroupWithAttrs(firstForm.value.catelogId).then(res => {
                    tabsOptions.value = res.data;
                })
            }
        }
        return {
            active,
            form,
            handleSubmit,
            defaultProps,
            dataMenu,
            cascader,
            handleNodeClick,
            firstForm,
            brandOptions,
            handleNext,
            tabsOptions
        }
    }
})
</script>

<style scoped>
.box-card {
    width: 50%;
    margin-top: 100px;
    margin-left: 20%;
}

.btn-group {
    display: flex;
    justify-content: center;
    align-content: center;
    margin-top: 50px;
}
</style>