<template>
    <div>

        <el-form :model="form" label-width="120px" v-loading="loading2" :rules="rules" ref="formRef">
            <el-form-item label="品牌名称" prop="name" >
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="品牌logo" >
                <el-input v-model="form.logo" />
            </el-form-item>
            <el-form-item label="介绍" >
                <el-input v-model="form.descript" />
            </el-form-item>
            <el-form-item label="显示状态" >
                <el-input v-model="form.showStatus" />
            </el-form-item>
            <el-form-item label="检索首字母" >
                <el-input v-model="form.firstLetter" />
            </el-form-item>
            <el-form-item label="排序" >
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

import { ref,  reactive } from "vue";

export default {
    name: 'formView',
    props: ["loading", "currentRow"],
    components: {

    },
    setup(props) {
        const formRef = ref(null)
        const form = ref({
            name: "",
            logo:"",
            descript:"",
            showStatus:"",
            firstLetter:"",
            sort:""
        })
        if (props.currentRow != null) {
            form.value = {
              name: props.currentRow.name,
              logo:props.currentRow.logo,
              descript:props.currentRow.descript,
              showStatus:props.currentRow.showStatus,
              firstLetter:props.currentRow.firstLetter,
              sort:props.currentRow.sort,
            }
            
        }
        const rules = reactive({
            name: [
                { required: true, message: '请输入家具', trigger: 'blur' }
            ]
        })

        return {
            form,
            rules,
            formRef
        }
    }
}
</script>
<style scoped></style>
  @/service/productService/product/product