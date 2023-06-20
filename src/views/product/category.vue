<template>
    <div>
        <el-tree :data="dataMenu" :props="defaultProps" :expand-on-click-node="false" :node-key="catId">
            <template #default="{ node, data }">
                <span class="custom-tree-node">
                    <span>{{ node.label }}</span>
                    <span>
                        <el-button v-if="node.level<=2" @click="treeAdd(data)" link type="primary"> 添加 </el-button>
                        <el-button v-if="node.childNodes.length==0" @click="treeDelete(node, data)" link type="danger"> 删除 </el-button>
                    </span>
                </span>
            </template>
        </el-tree>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { menuList,menuAdd,menuDel } from "@/service/product/product"

export default defineComponent({
    name: 'categoryView',
    setup() {
        const dataMenu = ref([])
        const handleNodeClick = (data) => {
            console.log(data)
        }
        const treeAdd = (data) => {

        }
        const treeDelete = (node, data) => {
            
        }
        const defaultProps = {
            children: 'children',
            label: 'name',
        }
        onMounted(() => {
            menuList().then(res => {
                dataMenu.value = res.data;
            })
        })
        return {
            dataMenu,
            handleNodeClick,
            defaultProps,
            treeAdd,
            treeDelete
        }
    }
})
</script>

<style scoped></style>