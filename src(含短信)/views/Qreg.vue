<template>
    <div class="wrap">
        <van-nav-bar title="商户注册" left-arrow @click-left="onClickLeft"/>
        <div class="content">
            <van-cell-group>
                <van-field
                    type="number"
                    v-model="ruleForm.mobile"
                    required
                    clearable
                    placeholder="请输入手机号码"
                />

                <van-field 
                type="number"       
                center
                clearable
                required
                placeholder="请输入短信验证码"
                v-model="ruleForm.code"
                >
                <van-button slot="button" size="small" :type="btnType" @click="getAuthCode">{{text}}</van-button>
                </van-field>
 
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
                <van-field
                    v-model="ruleForm.fMobile"
                    type="number"
                    clearable
                    placeholder="推荐人手机"
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
            ruleForm:{},
            btnType : 'primary',
            text:'发送验证码',
            wait:60,
            sendAuthCode:true
        };
    },
    created() {
        this.init();
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
        init(){
            this.ruleForm = {
                token:this.$store.state.token,
                mobile: "",
                name: "",
                wechat: "",
                password: "",
                repassword: "",
                code:"",
                fMobile:this.$route.query.father
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
            if (this.ruleForm.code == "") {
                this.$toast('请输入短信验证码');
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
            if (this.ruleForm.fMobile == "") {
                this.$toast('请输入推荐人手机号码');
                return false;
            }
            if(!this.config.checkMobile(this.ruleForm.fMobile)){
                this.$toast('推荐人手机格式错误');
                return false;
            }
            this.$toast.loading({mask: true,duration:0});
            this.$http.post("/login/register",this.ruleForm).then(result => {
                this.$toast.clear();
                let res = result.data;        
                if (res.code == 1) {
                    //console.log(res.body.token);
                    this.$store.commit("SET_TOKEN", res.body.token);
                    this.$dialog.alert({title:'消息',message:res.desc})
                    .then(() => {
                        window.location.href = '/';
                    });
                }else{
                    this.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
        },
        getAuthCode() {
            if(this.sendAuthCode){
                if (this.ruleForm.mobile == "") {
                    this.$toast('请输入手机号码');
                    return false;
                }
                if(!this.config.checkMobile(this.ruleForm.mobile)){
                    this.$toast('手机号码格式错误');
                    return false;
                }

                this.btnType = 'default';
                this.sendAuthCode = false;
                this.wait = 60;
                this.text = this.wait+'秒后重发';
                var timer = setInterval(()=>{
                    this.wait--;  
                    this.text = this.wait+'秒后重发';                  
                    if(this.wait<=0){
                        this.text = this.wait+'秒后重发';
                        this.sendAuthCode = true;
                        this.text = '发送验证码';
                        this.btnType = 'primary';
                        clearInterval(timer);
                    }
                }, 1000);
                this.sendSms();
            }
        },
        sendSms(){
            var that = this;
            let data = {
                mobile : that.ruleForm.mobile
			};
			this.$toast.loading({mask: true,duration:0});
            that.$http.post("/login/sendsms",data).then(result => {
				this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {              
                    this.$dialog.alert({title:'提示',message:res.desc});
                } else {
                    that.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
        },
    }
};
</script>

<style scoped>
.my-btn{color: #fff;background-color: #1989fa;border: 1px solid #1989fa;}
</style>
