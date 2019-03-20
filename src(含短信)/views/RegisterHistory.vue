<template>
    <div class="wrap">
        <van-nav-bar title="注册历史" left-arrow @click-left="onClickLeft"/>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div class="historyList" v-for="vo in info" :key="vo.id">
                <li>姓名：{{vo.name}}</li>
                <li>手机：{{vo.mobile}}</li>
                <li>微信：{{vo.wechat}}</li>
                <li>注册日期：{{vo.time}}</li>
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
    created() {},
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
            that.$http.post("/account/history",data).then(result => {
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
.historyList{box-shadow: 0 0 8px #ccc; border-radius: 5px; padding: 1px; overflow:hidden; margin: 10px; padding: 10px}
.historyList li{line-height: 24px; color: #999; font-size: 14px}
</style>
