<template>
    <div class="login-box" id="app" >
    <el-row>
        <el-col :span="8">
            <el-input id="name" v-model="name" placeholder="请输入帐号">
                <template slot="prepend">帐号</template>
            </el-input> 
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="8">
            <el-input id="password" v-model="password" type="password" placeholder="请输入密码">
                <template slot="prepend">密码</template>
            </el-input>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="8">
            <el-button id="login" v-on:click="check" style="width:100%" type="primary">登录</el-button>
        </el-col>
    </el-row>
    </div> 
</template>

<script>
export default {
    data() { // 页面的初始数据
        return {
        ruleForm: { // 存储用户输入数据
            user: '',
            passwd: '',
        },
        rules: { // 可添加一些表单规则
        }
        }
    },
    methods: {
            submitForm() {
            this.axios.post('url', { ...this.ruleForm }).then(res => { // post请求，携带参数为展开运算符=user: '', passwd: '',
                if (res.code != 0) return false; // 后台根据前端传来的数据返回对应的状态码，0为成功，继续往下执行，非0即失败（-1为用户名或者密码错误，1为空）停止往下执行
                this.$message({ // 提示成功信息
                type: 'success',
                message: '登录成功'
                })
                this.$router.push('/home/index') //成功跳转到首页
            })
            },

        handleSubmit(event){
            console.log(event);
            this.$refs.ruleForm2.validate((valid) => {
                if(valid){
                    this.logining = true;
                    if(this.ruleForm2.username === 'admin' && 
                       this.ruleForm2.password === '123456'){
                           this.logining = false;
                           sessionStorage.setItem('user', this.ruleForm2.username);
                           this.$router.push({path: '/'});
                    }else{
                        this.logining = false;
                        this.$alert('username or password wrong!', 'info', {
                            confirmButtonText: 'ok'
                        })
                    }
                }else{
                    console.log('error submit!');
                    return false;
                }
            })
        }
    }
};
</script>

<style scoped>
.login-container {
    width: 100%;
    height: 100%;
}
.login-page {
    border-radius: 5px;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}
</style>