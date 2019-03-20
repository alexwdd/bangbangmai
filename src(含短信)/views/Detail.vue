<template>
    <div class="wrap">
        <van-nav-bar title="文章详情" left-arrow @click-left="onClickLeft"/>
        <div class="title">{{info.title}}</div>
        <div class="date">{{info.time}}</div>
        <div class="content" v-html="info.content"></div>
    </div>
</template>

<script>
export default {
    data(){
		return {
			id:'',
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
			if (that.id>0 && that.id!=''){
                let data = {
                    token : that.$store.state.token,
                    id : that.id
                };
                that.$toast.loading({mask: true,duration:0});
				that.$http.post("/article/detail",data).then(result => {
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
    }
};
</script>

<style scoped>
.title{font-size: 18px; padding: 10px}
.date{font-size: 12px; color:#999; padding: 10px; border-bottom: 1px #dbdbdb solid}
.content{padding: 10px}
</style>
