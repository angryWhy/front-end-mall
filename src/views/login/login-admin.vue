<template>
    <div class="main_box">
        <div class="left">
            <div class="login_box_left">
                <div class="login_form">
                    <el-form label-width="100px" label-position="top" style="max-width: 460px">
                        <el-form-item label="账号">
                            <el-input />
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input />
                        </el-form-item>
                    </el-form>
                    <el-button type="danger" style="width:100%">登录</el-button>
                    <div class="switch_operate">
                        <el-switch v-model="isChecked" inline-prompt :active-icon="Check" :inactive-icon="Close"
                            class="switch_icon" />
                            <span>记住密码?</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="login_box_right"></div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
export default defineComponent({
    name: 'login-admin',
    setup() {
        const isChecked = ref(false)
        return {
            isChecked,
            Check,
            Close
        }
    }
})
</script>

<style scoped>
.main_box {
    width: 100vw;
    height: 100vh;
    display: flex;

}

.left {
    width: 50vw;
    background-color: #fff;
    position: relative;
}

.right {
    flex: 1;
    background-color: #1C3B67;
    position: relative;
}

.login_box_left {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0px;
    width: 40vw;
    height: 80vh;
    background-color: #F4F6FA;
    top: 10vh;
    transition: all 0.5s;
}

.login_box_right {
    position: absolute;
    left: 0px;
    width: 40vw;
    height: 80vh;
    top: 10vh;
    background-color: black;
    transition: all 0.5s;
}

.login_box_left:hover {
    box-shadow: 2px 2px 10px 3px #8db7e1, -2px -2px 10px 3px #8db7e1, -2px 2px 10px 3px #8db7e1;

}

.login_box_right:hover {
    box-shadow: 2px 2px 10px 6px #E6E8EA, 2px -2px 10px 6px #E6E8EA, -2px 2px 10px 6px #E6E8EA;
}

.login_form {
    background-color: #fff;
    border: 2px solid #E6E8EA;
    padding: 7vw;
}

.switch_icon {
    margin-right: 10px;
}
.switch_operate{
    margin-top: 10px;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #8db7e1;
}
</style>