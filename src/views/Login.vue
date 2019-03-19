<template>
    <div class="wrap">
        <div class="loginBox">
            <li>
                <van-icon class-prefix="icon" name="phone" />
                <van-field
                    v-model="ruleForm.mobile"
                    class="ipt"
                    clearable
                    placeholder="请输入手机号码"           
                />
            </li>
            <li>
                <van-icon class-prefix="icon" name="lock" />
                <van-field
                    v-model="ruleForm.password"
                    type="password"
                    placeholder="请输入密码"
                />
            </li>

            <li style="padding-top:10px;border-bottom:0">
                <van-button class="my-btn" size="large" @click="login">登录</van-button>  
            </li>
            
            <!-- <p class="reg" @click="doReg">用户注册</p>
            <p class="reg" @click="forget">忘记密码</p> -->
        </div>
        <div class="bottomBtn">
            <li><van-button plain type="primary" block size="small" @click="forget">忘记密码？</van-button></li>
            <li><van-button plain type="primary" block size="small" @click="download">APP下载</van-button></li>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            ruleForm: {
                mobile: "",
                password: ""
            }
        };
    },
    created() {},
    methods: {
        forget(){
            this.$router.push({path:"/reset"});
        },
        download(){
            this.$router.push({path:"/download"});
        },
        login() {
            if (this.ruleForm.mobile == "") {
                this.$toast('请输入手机号码');
                return false;
            }
            if(!this.config.checkMobile(this.ruleForm.mobile)){
                this.$toast('手机号码格式错误');
                return false;
            }
            if (this.ruleForm.password == "") {
                this.$toast('请输入密码');
                return false;
            }
            this.$toast.loading({mask: true,duration:0});
            this.$http.post("/login/index",this.ruleForm).then(result => {
                this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {
                    this.ruleForm.mobile = "";
                    this.ruleForm.password = "";
                    this.$store.commit("SET_TOKEN", res.body.token);
                    this.$store.commit(
                        "SET_USER",
                        JSON.stringify(res.body.userinfo)
                    );
                    this.$router.push({ path: "/" });
                } else {
                    this.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });           
        },
        doReg(){  
            this.$router.push({path:'/reg'});
        }
    }
};
</script>

<style scoped>
.wrap{width: 100%; height: 100vh; background: url(../assets/image/bg.jpg); background-size: cover;background-position: center; position: absolute; left: 0; top: 0}
.loginBox{ margin-top:60vh}
.loginBox li{width: 80%; margin: auto; margin-bottom: 10px; display: flex;border-bottom: 1px #ddd solid;}
.loginBox li i{display: block; width: 30px; color: #6bd9fd; font-size: 20px; line-height: 45px}
.my-btn{color: #fff;background-color: #6bd9fd;border: 1px solid #6bd9fd; border-radius: 25px}
.reg{clear: both; text-align: center; color: #6bd9fd;}
.bottomBtn{clear: both; overflow: hidden; padding: 0 40px}
.bottomBtn li {float: left; width: 50%; padding: 10px 20px; box-sizing: border-box}
</style>
