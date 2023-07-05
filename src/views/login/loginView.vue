<template>
    <div class="main">
        <div class="content">
            <div class="login-left">
                <img src="../../assets//images/login-card.png" class="login-pic" />
            </div>
            <div class="login-right">
                <el-form :model="formLabelAlign" style="max-width: 20vw">
                    <el-form-item>
                        <template #label>
                            <div class="center">
                                <el-icon>
                                    <Avatar color="#347A5A" />
                                </el-icon>
                            </div>
                        </template>
                        <el-input v-model="form.user" placeholder="请输入账号..." />
                    </el-form-item>
                    <el-form-item>
                        <template #label>
                            <div class="center">
                                <el-icon>
                                    <Grid color="#347A5A" />
                                </el-icon>
                            </div>
                        </template>
                        <el-input v-model="form.password" placeholder="请输入密码..." />
                    </el-form-item>
                    <el-form-item>
                        <template #label>
                            <div class="center">
                                <el-icon>
                                    <InfoFilled color="#347A5A" />
                                </el-icon>
                            </div>
                        </template>
                        <template #default>
                            <div class="switch">
                                <el-switch v-model="form.local" />
                                <div>
                                    <el-button v-show="form.local" style="color:#347A5A;margin-left:10px;"
                                        link>免登录</el-button>
                                    <el-button v-show="!form.local" style="color:#347A5A;margin-left:10px;"
                                        link>记住密码？</el-button>
                                </div>
                            </div>
                        </template>
                    </el-form-item>
                    <div class="btn">登录</div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'



const form = reactive({
    user: '',
    password: '',
    local: false,
})

</script>

<style scoped>
.main {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../../assets//images/login-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-attachment: fixed;
}

.login-pic {
    position: absolute;
    top: 20%;
    left: 5%;
    width: 33vw;
}

.content {
    width: 65vw;
    height: 70vh;
    background-color: #fff;
    border: 6px solid #347A5A;
    border-radius: 16px;
    display: flex;
    position: relative;
}

.login-left {
    flex-grow: 2;
}

.login-right {
    flex-grow: 1;
    z-index: 2;
    margin-top: 20vh;
    margin-left: 10vw;
}

.switch {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

::v-deep .el-form-item__label {
    display: flex;
    align-items: center;
    justify-content: center;
}

::v-deep .el-input__wrapper .is-focus {
    color: #347A5A;
    border: #347A5A;
}

::v-deep .el-switch.is-checked .el-switch__core {
    background-color: #347A5A;
}

.btn {
    width: 15vw;
    height: 6vh;
    background: #347A5A;
    border-radius: 39.5px;
    margin-left: 15%;
    margin-top: 20%;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
}
.btn:hover{
    cursor: pointer;
}
</style>