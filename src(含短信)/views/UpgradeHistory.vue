<template>
    <div class="wrap">
        <van-nav-bar title="申请记录" left-arrow @click-left="onClickLeft"/>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div class="historyList" v-for="vo in info" :key="vo.id">
                <div class="hd">{{vo.from}}升级到{{vo.to}}<span>{{vo.time}}</span></div>
                <div class="card" v-for="item in vo.auditing" :key="item.id">
                    <div class="info">
                        <li>姓名：{{item.user.name}}</li>
                        <li>手机：{{item.user.mobile}}</li>
                        <li>微信：{{item.user.wechat}}</li>
                    </div>
                    <div class="rightInfo">
                        <van-tag v-if="item.status==0">待审</van-tag>
                        <van-tag type="success" v-else="">已审</van-tag> 
                        <div class="qr" v-if="item.user.qrcode !='' ">
                            <van-icon name="qr" @click="showQr(item.user.qrcode)"/>
                        </div>
                    </div>
                </div>
            </div>
        </van-list>

        <van-popup v-model="wechatShow" position="bottom">
            <div class="qrBox"><img :src="qrcode" alt=""><div class="close" @click="closeQr"><van-icon name="cross"/></div></div>
        </van-popup>
    </div>
</template>

<script>
export default {
    data() {
        return {
            info:[],
            loading: false,
            finished: false,
            canPost:true,
            page:1,
            qrcode:'',
            wechatShow:false,
        };
    },
    watch:{
    	$route(to,from){
		    if (to.path=='/auditing') {
                this.page = 1; 	
                this.info = []; 	
		    	this.onLoad();
		    }
		}
    },
    created() {},
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
        showQr(image){
            this.qrcode = image;
            this.wechatShow = true;
        },
        closeQr(){
            this.wechatShow = false;
        },
        onLoad() {
            var that = this;            
            if(!that.canPost){
                return false;
            }
            that.canPost = false;
            let data = {
                token : that.$store.state.token,
                page : that.page
            };
            this.$toast.loading({mask: true,duration:0});
            that.$http.post("/account/upgradeHistory",data).then(result => {
                this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {
                    // 加载状态结束
                    that.loading = false;
                    that.canPost = true;                 
                    that.info = that.info.concat(res.body.data); 
                    that.page++;          
                    if(res.body.next==0){
                        that.finished = true;
                    }
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
.historyList{box-shadow: 0 0 8px #ccc; border-radius: 5px; padding: 1px; overflow:hidden; margin: 10px;}
.historyList .hd{height: 40px; line-height: 40px; border-bottom: 1px #f1f1f1 solid;background-color: #f1f1f1; padding: 0 10px}
.historyList .hd span{font-size: 12px; float: right; font-size: 12px; color: #999}
.card{overflow:hidden; clear: both; margin: 10px; padding:0 5px; border-bottom: 1px #f1f1f1 solid}
.card .info{float: left;font-size: 15px;}
.card .info li{line-height: 30px; color: #999}
.card .rightInfo{float: right; text-align: right}
.card .rightInfo .qr{margin-top: 10px}
.card .rightInfo i{font-size:20px; line-height: 50px; color: #999}

.qrBox{height: 100vh; width: 100%; text-align: center; position: relative;}
.qrBox .close{position:absolute;right: 10px; top: 10px; background: rgba(0,0,0,.8); color: #fff; width: 40px; height: 40px;line-height: 40px; text-align: center; border-radius:20px}
.qrBox .close i{line-height: 40px; font-size: 20px}
.qrBox img{height: 100%; display: block; margin: auto}
.success{font-size: 30px; clear: both; overflow: hidden; padding: 15px 0; text-align: center;color: rgb(7, 193, 96)}
</style>
