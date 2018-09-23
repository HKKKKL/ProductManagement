<template>
    <div class="wrap"  @keyup.enter="submitForm('ruleForm')">
        <div class="logIn">
            <h1>用户登录</h1>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="账号" prop="accountName">
                    <el-input type="text" v-model="ruleForm.accountName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item style="margin-left: -100px">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {mapMutations, mapActions, mapState} from 'vuex'

    export default {
        data() {
            let validateAccount = (rule, value, callback) => {
                value = this.ruleForm.accountName;
                if (value === '') {
                    callback(new Error('请输入账号'));
                }
                callback();
            };
            let validatePassword = (rule, value, callback) => {
                value = this.ruleForm.password;
                if (value === '') {
                    callback(new Error('请输入密码'));
                }
                callback();
            };
            return {
                ruleForm: {
                    accountName: '',
                    password: ''
                },
                rules: {
                    accountName: [
                        {validator: validateAccount, trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePassword, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            ...mapMutations([
                ' ...updateAccount'
            ]),
            ...mapActions([
                'logInManagement'
            ]),
            goManagement() {
                this.$store.commit('updateAccount', this.ruleForm);
                this.logInManagement()
                    .then(() => {
                        if (this.__correctLogIn) {
                            this.$router.push({name: this.$store.state.__url})
                        } else {
                            alert("账号或密码不正确！");
                        }
                    })

            },
            submitForm(formName) {
                this.goManagement();
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
        computed: {
            ...mapState({
                    __correctLogIn: '__correctLogIn',
                }
            ),

        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .wrap {
        display: flex;
        width: 100%;
        height: 100%;
        background: url('../../static/imgs/bg1.jpg') no-repeat ;
        background-size: cover;
        justify-content: center;
        align-items: center;
    }

    .logIn {
        width: 555px;
        height: 385px;
        border-radius: 20px;
        background-color: rgba(255,255,255,.8);
    }

    h1 {
        width: 100%;
        padding: 40px 0;
        border-bottom: 1px solid #f0f0f0;
        text-align: center;
    }

    .demo-ruleForm {
        margin-top: 30px;
    }

    .el-input {
        width: 380px;
    }
    .el-input > .el-input__inner{
        background-color: rgba(255,255,255,.8);
    }
    .el-form-item:last-of-type {
        display: flex;
        justify-content: center;
    }
</style>
