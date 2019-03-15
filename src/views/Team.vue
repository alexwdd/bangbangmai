<template>
    <div class="wrap">
        <van-nav-bar title="我的团队" left-arrow @click-left="onClickLeft" right-text="筛选" @click-right="onClickRight"/>

        <div class="count">{{total}}</div>

        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div class="list" v-for="vo in info" :key="vo.id">   
            <div class="face"><img :src="vo.face" /><span>{{vo.star}}</span></div>
            <div class="info">
                <p>姓名：{{vo.name}}</p>
                <p>手机：{{vo.mobile}}</p>
                <p>微信：{{vo.wechat}}</p>
            </div>           
        </div>
        </van-list>

        <van-popup v-model="show" position="right">
            <div class="level">
                <li v-for="vo in star" :key="vo.id" @click="selectLevel(vo.id)">{{vo.name}}</li>
            </div>
        </van-popup>

    </div>
</template>

<script>
export default {
    data() {
        return {
            show:false,
            activeLevel:'',
            star:[],
            info:[],
            total:0,
            loading: false,
            finished: false,
            canPost:true,
            page:1
        };
    },
    watch:{
    	$route(to,from){
		    if (to.path=='/team') {
                this.activeLevel='';
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
        onClickRight(){
            this.show = true;
        },
        selectLevel(val){
            this.show = false;
            this.activeLevel = val;
            this.page = 1; 	
            this.info = []; 	
            this.onLoad();
        },
        onLoad() {
            var that = this;            
            if(!that.canPost){
                return false;
            }
            that.canPost = false;
            let data = {
                token : that.$store.state.token,
                page  : that.page,
                level : that.activeLevel
            };
            this.$toast.loading({mask: true,duration:0});
            that.$http.post("/account/team",data).then(result => {
                this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {
                    // 加载状态结束
                    that.loading = false;
                    that.canPost = true;                 
                    that.info = that.info.concat(res.body.data);                    
                    that.total = res.body.total;
                    that.star = res.body.star;
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
.count{color: #fff;background-color: #1989fa;font-size: 30px; line-height: 80px; text-align: center}
.list{box-shadow: 0 0 8px #ccc; border-radius: 5px; padding: 1px; overflow:hidden; margin: 10px; padding: 10px}
.list .face{float: left; width: 70px; margin-right: 10px}
.list .face img{display: block; margin: auto; border-radius: 50%; width: 50px}
.list .face span{font-size: 12px; display: block; text-align: center; color: #1989fa; margin-top: 5px}
.list .info p{line-height: 24px; color: #999; font-size: 14px}
.level{width:150px;background: #fff; height:100vh;}
.level li{border:1px #dbdbdb solid; width: 100px; margin: auto; height: 30px; line-height: 30px; text-align: center; margin-top: 10px;}
</style>
