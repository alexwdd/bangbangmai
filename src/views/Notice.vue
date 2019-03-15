<template>
    <div class="wrap">
        <van-nav-bar title="系统公告" left-arrow @click-left="onClickLeft"/>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell
                v-for="vo in info"
                :key="vo.id"
                :title="vo.title"
                :to="{name: 'detail', params: { id: vo.id }}"
            />
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
            that.$http.post("/article/notice",data).then(result => {
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
</style>
