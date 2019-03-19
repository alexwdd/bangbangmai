<template>
    <div class="wrap">
        <van-nav-bar title="APP下载" left-arrow @click-left="onClickLeft"/>

        <van-panel title="安卓下载">
            <div class="download">
                <div class="left"><img src="../assets/image/an.jpg"/></div>
                <div class="right">
                    <img :src="info.android">
                </div>
            </div>
        </van-panel>

        <van-panel title="IOS下载">
            <div class="download">
                <div class="left"><img src="../assets/image/ios.jpg"/></div>
                <div class="right">
                    <img :src="info.ios">
                </div>
            </div>
        </van-panel>
           
    </div>
</template>

<script>
export default {
    data() {
        return {
            info:[]
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
            this.$toast.loading({mask: true,duration:0});
            this.$http.post("/login/download").then(result => {
                this.$toast.clear();
                let res = result.data;        
                if (res.code == 1) {
                    this.info = res.body;
                }else{
                    this.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
        }
    }
};
</script>

<style scoped>
.download{clear: both; padding: 20px; overflow: hidden;}
.left{float: left; width:35%; margin-right: 5%}
.left img{width: 60%}
.right{float: left; width: 60%;}
.right img{width: 80%}
</style>
