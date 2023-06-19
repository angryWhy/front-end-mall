<template>
    <div>
        <el-tree :data="dataMenu" :props="defaultProps" @node-click="handleNodeClick" />
    </div>
</template>

<script>
import { defineComponent,ref,onMounted} from 'vue'
import {menuService} from "@/service/product/product"

export default defineComponent({
    name: 'categoryView',
    setup() {
        const dataMenu = ref([])
        const handleNodeClick = (data) => {
            console.log(data)
        }
        onMounted(()=>{
            menuService().then(res=>{
                dataMenu.value = res.data;
        })
        })
        const defaultProps = {
            children: 'children',
            label: 'name',
        }
        return {
            dataMenu,
            handleNodeClick,
            defaultProps
        }
    }
})
</script>

<style scoped></style>