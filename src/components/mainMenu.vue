<template>
    <div>
        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="1"
            text-color="#fff" @open="handleOpen" @close="handleClose">

            <el-sub-menu index="1">
                <template #title>
                    <el-icon>
                        <Fries />
                    </el-icon>
                    <span>商品管理</span>
                </template>
                <el-menu-item index="2-1" @click="handleClick">分类维护</el-menu-item>
                <el-menu-item index="2-4-1">item one</el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>
  
<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
    name: 'goodsView',
    setup() {
        const route = useRouter();
        const handleClick = () => {
            route.push({
                path:"/category"
            })
        }
        return {
            handleClick
        }
    }
})
</script>
  
<style scoped></style>