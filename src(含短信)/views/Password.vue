<template>
    <div class="wrap">
        <van-nav-bar title="修改密码" left-arrow @click-left="onClickLeft"/>
        <div class="content">
            <van-cell-group>
                <van-field
                    v-model="ruleForm.oldpassword"
                    type="password"
                    clearable
                    placeholder="原始密码"
                    required
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
            <van-button class="my-btn" size="large" @click="password">修改密码</van-button>
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
        init(){
            this.ruleForm = {
                token:this.$store.state.token,
                oldpassword: "",
                password: "",
                repassword: "",
            }
        },
        onClickLeft() {
            this.$router.go(-1);
        },
        onClickRight() {
            this.$router.push({ path: "/regHistory" });
        },
        password() {
            if (this.ruleForm.oldpassword == "") {
                this.$toast('请输入原始密码');
                return false;
            }
            if (this.ruleForm.password == "") {
                this.$toast('请输入新密码');
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
            this.$http.post("/account/password",this.ruleForm).then(result => {
                this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {
                    this.$dialog.alert({title:'提示',message:res.desc});
                    this.init();
                } else if(res.code==9001) {
                    that.$dialog.alert({title:'错误信息',message:res.desc}).then(() => {
                        this.$router.push({path:'/login'});
                    });
                }else{
                    that.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
        }
    }
};
</script>

<style scoped>
.my-btn{color: #fff;background-color: #1989fa;border: 1px solid #1989fa;}
</style>
