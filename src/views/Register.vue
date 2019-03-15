<template>
    <div class="wrap">
        <van-nav-bar title="帮助注册" left-arrow @click-left="onClickLeft" right-text="历史注册" @click-right="onClickRight"/>
        <div class="content">
            <van-cell-group>
                <van-field
                    v-model="ruleForm.mobile"
                    required
                    clearable
                    placeholder="请输入手机号码"
                />
                <van-field
                    v-model="ruleForm.name"
                    required
                    clearable
                    placeholder="真实姓名"
                />
                <van-field
                    v-model="ruleForm.wechat"
                    required
                    clearable
                    placeholder="微信号"
                />
                <van-field
                    v-model="ruleForm.password"
                    type="password"
                    clearable
                    placeholder="设置密码(6-20位数字英文或符号组合)"
                    required
                />
                <van-field
                    v-model="ruleForm.repassword"
                    type="password"
                    clearable
                    placeholder="再次输入密码"
                    required
                />
            </van-cell-group>
        </div>

        <div style="padding: 10px;">
            <van-button class="my-btn" size="large" @click="register">注册</van-button>
        </div>

        <div style="width: 100%; height: 70px;"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ruleForm:{}
        };
    },
    created() {
        this.init();
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
        onClickRight() {
            this.$router.push({ path: "/regHistory" });
        },
        init(){
            this.ruleForm = {
                token:this.$store.state.token,
                mobile: "",
                name: "",
                wechat: "",
                password: "",
                repassword: "",
            }
        },
        register() {
            if (this.ruleForm.mobile == "") {
                this.$toast('请输入手机号码');
                return false;
            }
            if(!this.config.checkMobile(this.ruleForm.mobile)){
                this.$toast('手机号码格式错误');
                return false;
            }
            if (this.ruleForm.name == "") {
                this.$toast('请输入真实姓名');
                return false;
            }
            if(!this.config.checkChinese(this.ruleForm.name)){
                this.$toast('姓名只能是中文');
                return false;
            }
            if (this.ruleForm.wechat == "") {
                this.$toast('请输入微信号');
                return false;
            }
            if (this.ruleForm.password == "") {
                this.$toast('请设置密码');
                return false;
            }
            if(!this.config.checkPassword(this.ruleForm.password)){
                this.$toast('密码长度应为6-20位之间');
                return false;
            }
            if (this.ruleForm.password != this.ruleForm.repassword) {
                this.$toast('两次密码不同');
                return false;
            }
            this.$toast.loading({mask: true,duration:0});
            this.$http.post("/account/register",this.ruleForm).then(result => {
                this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {
                    this.$dialog.alert({title:'提示',message:res.desc});
                    this.init();
                } else if(res.code==9001) {
                    this.$dialog.alert({title:'错误信息',message:res.desc}).then(() => {
                        this.$router.push({path:'/login'});
                    });
                }else{
                    this.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
        }
    }
};
</script>

<style scoped>
.my-btn{color: #fff;background-color: #1989fa;border: 1px solid #1989fa;}
</style>
