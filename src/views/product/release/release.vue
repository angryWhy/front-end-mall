<template>
    <div>
        <el-steps :active="active" finish-status="success">
            <el-step title="Step 1" />
            <el-step title="Step 2" />
            <el-step title="Step 3" />
        </el-steps>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'releasesView',
    setup() {
        return {}
    }
})
</script>

<style scoped></style>