<template>
    <div class="wrap">
        <van-nav-bar title="审核升级" left-arrow @click-left="onClickLeft"/>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div class="list" v-for="(vo,index) in info" :key="vo.id">
                <div class="info">
                    <li>姓名：{{vo.user.name}}</li>
                    <li>手机：{{vo.user.mobile}}</li>
                    <li>微信：{{vo.user.wechat}}</li>
                </div>
                <div class="action">
                    <van-button round type="default" size="small" class="abtn" v-if="vo.status==0" @click="doAuditing(index,vo)">等待审核</van-button>
                    <van-button round type="primary" disabled size="small" v-else="">确认通过</van-button>
                </div>                
            </div>             
        </van-list> 
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
            page:1
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
    created() {

    },
    methods: {
        onClickLeft() {
            this.$router.go(-1);
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
            that.$http.post("/account/auditing",data).then(result => {
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
        },
        doAuditing(index,value){
            var that = this;
            this.$dialog.confirm({
                title: '确认操作',
                message: '确定通过审核吗？'
            }).then(() => {
                let data = {
                    token : that.$store.state.token,
                    id : value.id
                };
                this.$toast.loading({mask: true,duration:0});
                that.$http.post("/account/doAuditing",data).then(result => {
                    this.$toast.clear();
                    let res = result.data;
                    if (res.code == 1) {
                        that.info[index]['status'] = 1;
                    } else {
                        that.$dialog.alert({title:'错误信息',message:res.desc});
                    }
                });
            })
        }
    }
};
</script>

<style scoped>
.list{box-shadow: 0 0 8px #ccc; border-radius: 5px; padding: 1px; overflow:hidden; margin: 10px; padding: 10px;}
.list .info{float: left;}
.list .info li{line-height: 24px; color: #999; font-size: 14px}
.list .action{float: right;}
.abtn{background:#666;color:#fff}
</style>
