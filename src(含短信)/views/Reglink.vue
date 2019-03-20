<template>
    <div class="wrap">
        <van-nav-bar title="推广链接" left-arrow @click-left="onClickLeft"/>
        <div class="qrcode"><img :src="info.qrcode"></div>
        <p class="url">将二维码发送给好友，快速完成注册</p>
    </div>
</template>

<script>
export default {
    data(){
		return {
			info:{}
		}
	},
	watch:{
		// 如果路由有变化，会再次执行该方法
    	'$route':'fetchData'
	},
	created(){
		this.fetchData();
	},
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
        fetchData(){
            var that = this;
			that.id = that.$route.params.id; 
            let data = {
                token : that.$store.state.token
            };
            that.$toast.loading({mask: true,duration:0});
            that.$http.post("/account/myqrcode",data).then(result => {
                that.$toast.clear();
                let res = result.data;
                if (res.code == 1) {
                    // 加载状态结束
                    that.info = res.body;
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
.wrap{width: 100%; height: 100vh; background: url(../assets/image/reg.jpg); background-size: cover;background-position: center; position: absolute; left: 0; top: 0}
.qrcode{ margin: auto;margin-top:30vh; text-align: center; box-shadow: 0 0 10px #ccc; width: 50%;}
.qrcode img{margin: auto; width:100%;}
.url{margin:20px; background:rgba(0,0,0,0.5); text-align: center; color: #fff; border-radius: 5px; padding: 10px}
</style>
