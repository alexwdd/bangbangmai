<template>
    <div class="wrap">
        <van-nav-bar title="申请升级" left-arrow @click-left="onClickLeft" right-text="申请列表" @click-right="onClickRight"/>
        
        <div v-show="postOver">
            <div class="success">{{title}}</div>
            <div class="card" v-for="item in auditingUser">
                <div class="hd">
                    <p>审核人：{{item.user.name}}</p>
                    <span>
                        <van-tag v-if="item.status==0">待审</van-tag>
                        <van-tag type="success" v-else="">已审</van-tag> 
                    </span>
                </div>
                <div class="info">
                    <li>手机：{{item.user.mobile}}</li>
                    <li>微信：{{item.user.wechat}}</li>
                </div>
                <div class="qr" v-if="item.user.qrcode !='' ">
                    <van-icon name="qr" @click="showQr(item.user.qrcode)"/>
                </div>
            </div>
            <van-popup v-model="wechatShow" position="bottom">
                <div class="qrBox"><img :src="qrcode" alt=""><div class="close" @click="closeQr"><van-icon name="cross"/></div></div>
            </van-popup>
        </div>
        
        <div v-show="!postOver">
            <div class="level">
                <label>当前等级</label>
                <p>{{user.starName}}</p>
            </div>
            <div class="level">
                <label>申请等级</label>
                <p>{{user.nextName}}</p>
            </div>

            <div class="alert" v-show="showAlert" v-text="alert"></div>
            <div style="padding:15px" v-show="!showAlert">
                <van-button size="large" class="my-btn" @click="upgrade">升级</van-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user:[],
            showAlert:false,
            alert:'',
            wechatShow:false,
            postOver:false, //提交成功
            title:'',
            auditingUser:[],
            qrcode:''
        };
    },
    watch:{
    	$route(to,from){
		    if (to.path=='/upgrade') {	  	
		    	this.getData();
		    }
		}
    },
    created() {
        this.getData();
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
        onClickRight() {
            this.$router.push({path:'/history'});
        },
        showQr(image){
            this.qrcode = image;
            this.wechatShow = true;
        },
        closeQr(){
            this.wechatShow = false;
        },
        getData(){
            var that = this;
            let data = {
                token : that.$store.state.token
            };
            this.$toast.loading({mask: true,duration:0});
            that.$http.post("/account/shenqing",data).then(result => {
                this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {
                    that.user = res.body.user;
                    if(res.body.auditing.length > 0){
                        that.postOver = true;
                        that.title = '审核中';
                        that.auditingUser = res.body.auditing;   
					}else{                        
                        that.postOver = false;                        
                        if(that.user.star==9){
                            that.alert = '您已经达到满级九星会员';
                            that.showAlert = true;
                        }else{
                            if(parseInt(that.user.par) < 100){
                                that.alert = '您还没有达到有效推荐，请满足条件后再尝试升级操作';
                                that.showAlert = true;
                            }else{
                                that.alert = '';
                                that.showAlert = false;
                            }
                        }
                    }                    
                } else if(res.code==9001) {
                    that.$dialog.alert({title:'错误信息',message:res.desc}).then(() => {
                        this.$router.push({path:'/login'});
                    });
                }else{
                    that.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
        },
        upgrade(){
            var that = this;
            let data = {
                token : that.$store.state.token
            };
            this.$toast.loading({mask: true,duration:0});
            that.$http.post("/account/upgrade",data).then(result => {
                this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {              
                    that.postOver = true;
                    that.title = '提交成功 等待审核';
                    that.auditingUser = res.body.auditing;                    
                } else {
                    this.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
        }
    }
};
</script>

<style scoped>
.level{clear: both; background: #f1f1f1; margin:15px; border-radius: 10px; height: 50px; line-height: 50px; padding: 0 15px}
.level label{display: block; float: left; font-size: 14px; color:#999; margin-right: 20px}
.alert{background: #333; color: #fff; margin: 15px; padding: 15px; border-radius: 5px}
.my-btn{color: #fff;background-color: #1989fa;border: 1px solid #1989fa;}
.card{box-shadow: 0 0 8px #ccc; border-radius: 5px; padding: 1px; overflow:hidden; margin: 10px; padding:0 10px;}
.card .hd{height: 40px; line-height: 40px; border-bottom: 1px #f1f1f1 solid}
.card .hd p{float: left;}
.card .hd span{float: right; margin-top: 5px; display: block}
.card .info{float: left;font-size: 15px;}
.card .info li{line-height: 30px; color: #999}
.card .qr{float: right;}
.card .qr i{font-size:30px; line-height: 50px; color: #999}
.qrBox{height: 100vh; width: 100%; text-align: center; position: relative;}
.qrBox .close{position:absolute;right: 10px; top: 10px; background: rgba(0,0,0,.8); color: #fff; width: 40px; height: 40px;line-height: 40px; text-align: center; border-radius:20px}
.qrBox .close i{line-height: 40px; font-size: 20px}
.qrBox img{height: 100%; display: block; margin: auto}
.success{font-size: 30px; clear: both; overflow: hidden; padding: 15px 0; text-align: center;color: rgb(7, 193, 96)}
</style>
