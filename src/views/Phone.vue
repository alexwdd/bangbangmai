<template>
    <div class="wrap">
        <van-nav-bar title="绑定手机" left-arrow @click-left="onClickLeft"/>
        <van-steps :active="active">
            <van-step>获取验证码</van-step>
            <van-step>绑定手机</van-step>
        </van-steps>

        <div class="content" v-show="showCode">
            <div class="phone"><span>当前手机</span>{{user.mobile}}</div>
            <van-cell-group>
                <van-field        
                center
                clearable
                label="短信验证码"
                placeholder="请输入短信验证码"
                v-model="smscode"
                >
                <van-button slot="button" size="small" :type="btnType" @click="getAuthCode">{{text}}</van-button>
                </van-field>
            </van-cell-group>

            <div style="padding: 10px;">
                <van-button class="my-btn" size="large" @click="checkSmsCode">下一步</van-button>
            </div>
        </div>

        <div class="content" v-show="showPhone">
            <van-field
                required
                clearable
                placeholder="请输入新的手机号码"
                v-model="mobile"
            /> 

            <div style="padding: 10px;">
                <van-button class="my-btn" v-show="showPhone" size="large" @click="bindMobile">绑定手机</van-button>
            </div>  
        </div> 
    </div>
</template>

<script>
export default {
    data() {
        return {
            user:[],
            text:'发送验证码',
            active:0,
            showCode:true,
            showPhone:false,
            smscode:'',//短信验证码
            mobile:'',//新手机号码
            btnType : 'primary',
            wait:60,
            sendAuthCode:true
        };
    },
    watch:{
    	$route(to,from){
		    if (to.path=='/phone') {		    	
		    	this.active = 0;
                this.showCode = true;
                this.showPhone = false;
                this.getData();
		    }
		}
    },
    created(){
        this.getData();
    },
    methods: {
        getData(){
            var that = this;
            let data = {
                token : that.$store.state.token
			};
			this.$toast.loading({mask: true,duration:0});
            that.$http.post("/account/userinfo",data).then(result => {
				this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {              
                    that.user = res.body.user; 
                } else if(res.code==9001) {
                    that.$dialog.alert({title:'错误信息',message:res.desc}).then(() => {
                        this.$router.push({path:'/login'});
                    });
                }else{
                    that.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
        },
        getAuthCode() {
            if(this.sendAuthCode){
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
                token : that.$store.state.token
			};
			this.$toast.loading({mask: true,duration:0});
            that.$http.post("/account/sendsms",data).then(result => {
				this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {              
                    this.$dialog.alert({title:'提示',message:res.desc});
                } else {
                    that.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
        },
        checkSmsCode(){
            if(this.smscode==""){
                this.$dialog.alert({title:'错误信息',message:'请输入短信验证码'});
                return false;
            }
            var that = this;
            let data = {
                token : that.$store.state.token,
                code  : that.smscode
			};
			this.$toast.loading({mask: true,duration:0});
            that.$http.post("/account/checkSmsCode",data).then(result => {
                this.$toast.clear();
                let res = result.data;
                if (res.code == 1) { 
                    clearInterval(timer);
                    this.active = 1;
                    this.showCode = false;
                    this.showPhone = true;
                }else{        
                    this.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
        },
        onClickLeft() {
            this.$router.go(-1);
        },
        bindMobile() {
            if(this.mobile==""){
                this.$dialog.alert({title:'错误信息',message:'请输入手机号码'});
                return false;
            }
            if(!this.config.checkMobile(this.mobile)){
                this.$dialog.alert({title:'错误信息',message:'手机号码格式错误'});
                return false;
            }
            if(this.smscode==""){
                this.$dialog.alert({title:'错误信息',message:'请输入短信验证码'});
                return false;
            }
            var that = this;
            let data = {
                token : that.$store.state.token,
                mobile  : that.mobile,
                code  : that.smscode
			};
			this.$toast.loading({mask: true,duration:0});
            that.$http.post("/account/bind",data).then(result => {
                this.$toast.clear();
                let res = result.data;
                if (res.code == 1) { 
                    this.$dialog.alert({title:'提示',message:res.desc}).then(() => {
                        this.mobile='';
                        this.smscode='';
                    });;
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
.disable{background: #eee;border: 1px solid #eee;}
.phone{text-align: center; font-size:20px; padding: 30px 0}
.phone span{font-size: 14px; color: #999; display: block}
</style>
