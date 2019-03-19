<template>
    <div class="wrap">
        <van-nav-bar title="设置" left-arrow @click-left="onClickLeft"/>
        <div class="face" @click="setFace">
            <img :src="user.face" />
            <div class="setting"><van-icon name="setting-o" /></div>
        </div>
        <div class="group">
            <van-cell title="真实姓名" is-link :value="user.name" @click="showName"/>
            <van-cell title="手机号" is-link :value="user.mobile" to="/phone"/>
            <van-cell title="微信号" is-link :value="user.wechat" @click="showWechat"/>           
            <van-cell title="二维码名片" is-link to="/qrcode"/>
        </div>

        <div class="group">
            <van-cell title="重置密码" is-link to="/password"/>
        </div>

        <div class="group" style="margin-bottom:10px">
            <van-button size="large" @click="signout">退出</van-button>
        </div>

        <van-popup v-model="nameShow" position="bottom">
            <div class="write">
            <van-field
            required
            clearable
            label='真实姓名'
            v-model="name"
            />
            </div>
            <div style="padding: 10px;">
                <van-button class="my-btn" size="large" @click="saveName">修改</van-button>
            </div>
        </van-popup>

        <van-popup v-model="wechatShow" position="bottom">
            <div class="write">
            <van-field
            required
            clearable
            label='微信号'
            v-model="wechat"
            />
            </div>
            <div style="padding: 10px;">
                <van-button class="my-btn" size="large" @click="saveWechat">修改</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user:[],
            name:'',
            wechat:'',
            nameShow: false,
            wechatShow: false,
        };
    },
    watch:{
        $route(to,from){
            if(to.path=='/setting'){
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
                    that.name = res.body.user.name;
                    that.wechat = res.body.user.wechat;
                } else if(res.code==9001) {
                    that.$dialog.alert({title:'错误信息',message:res.desc}).then(() => {
                        this.$router.push({path:'/login'});
                    });
                }else{
                    that.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
        },
        saveName(){
            var that = this;
            if(that.name!=''){   
                if(!this.config.checkChinese(that.name)){
                    this.$toast('姓名只能是中文');
                    return false;
                }
                let data = {
                    token : that.$store.state.token,
                    name : that.name
                };
                this.$toast.loading({mask: true,duration:0});
                that.$http.post("/account/setName",data).then(result => {
                    this.$toast.clear();
                    let res = result.data;
                    if (res.code == 1) {              
                        this.$dialog.alert({title:'提示',message:res.desc});
                        that.user.name = that.name;
                        that.nameShow = false;
                    } else {
                        that.$dialog.alert({title:'错误信息',message:res.desc});
                    }
                });
            }
        },
        saveWechat(){
            var that = this;
            if(that.wechat!=''){
                let data = {
                    token : that.$store.state.token,
                    wechat : that.wechat
                };
                this.$toast.loading({mask: true,duration:0});
                that.$http.post("/account/setWechat",data).then(result => {
                    this.$toast.clear();
                    let res = result.data;
                    if (res.code == 1) {              
                        this.$dialog.alert({title:'提示',message:res.desc});
                        that.user.wechat = that.wechat;
                        that.wechatShow = false;
                    } else {
                        that.$dialog.alert({title:'错误信息',message:res.desc});
                    }
                });
            }
        },
        showName(){
            this.nameShow=true
        },
        showWechat(){
            this.wechatShow=true
        },
        onClickLeft() {
            this.$router.go(-1);
        },
        setFace() {
            this.$router.push({path:'/face'});
        },
        signout(){
            this.$store.commit('SIGN_OUT');
            this.$router.push({ path:'/login'});
        }
    }
};
</script>

<style scoped>
.wrap{background: #f1f1f1; height: 100%;}
.group{ margin-top: 10px;}
.face{background: #fff;clear: both; overflow: hidden; padding: 10px}
.face img{float:left; display: block; width: 50px; height: 50px; border-radius: 50%}
.face .setting{float: right;}
.face .setting i{line-height: 50px}
.write{padding: 30px 0}
.my-btn{color: #fff;background-color: #1989fa;border: 1px solid #1989fa;}
</style>
