<template>
    <div>

        <el-form :model="form" label-width="120px" v-loading="loading2" :rules="rules" ref="formRef">
            <el-form-item label="菜单名称" prop="name">
                <el-input v-model="form.name" />
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
import { menuLoad } from '@/service/productService/product/product';
export default {
    name: 'formView',
    props: ["loading", "currentRow"],
    components: {

    },
    setup(props) {
        const formRef = ref(null)
        const form = ref({
            name: ""
        })
        if (props.currentRow != null) {
            form.value = {
              name:  props.currentRow.data.name
            }
            menuLoad(props.currentRow.data.catId).then(res=>{
               
            })
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