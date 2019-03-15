<template>
	<div class="wrap">   
		<div class="header">
			<div class="baseInfo">
				<h1>{{user.name}}</h1>
				<div class="base">
					<p><van-icon name="medel-o" size="20px" /> <span>{{user.starName}}</span></p>
				</div>
			</div>
			<div class="faceBox">
				<router-link to="/setting">
				<div class="setting">设置</div>
				<div class="face"><img :src="user.face" /></div>
				</router-link>
			</div>
		</div>

		<van-progress
		class="par"		
		:percentage="par"
		:pivot-text="user.par+'%'"
		pivot-color="#1989fa"
		color="linear-gradient(to right, #90c7ff, #1989fa)"
		/>
		<van-notice-bar
		:text="notice.title"		
		@click="showNotice"
		left-icon="volume-o"
		/>
		
		<div class="menu">
			<li v-if="user.star > 0">
				<router-link to="/register">
				<div class="item color1">
					<van-icon name="user-o"/>
					<span>帮助注册</span>
				</div>
				</router-link>
			</li>

			<li v-if="user.star > 0">
				<router-link to="/auditing">
				<div class="item color2">
					<van-icon name="todo-list-o" />
					<span>审核升级</span>
				</div>
				</router-link>
			</li>

			<li>
				<router-link to="/upgrade">
				<div class="item color3">
					<van-icon name="upgrade" />
					<span>升级申请</span>
				</div>
				</router-link>
			</li>

			<li v-if="user.star > 0">
				<router-link to="/team">
				<div class="item color4">
					<van-icon name="cluster-o" />
					<span>我的团队</span>
				</div>
				</router-link>
			</li>

			<li>
				<router-link to="/notice">
				<div class="item color5">
					<van-icon name="volume-o" />
					<span>系统公告</span>
				</div>
				</router-link>
			</li>
			
			<li>
				<router-link to="/help">
				<div class="item color6">
					<van-icon name="question-o" />
					<span>新人指导</span>
				</div>
				</router-link>
			</li>
		</div>
		<div style="padding:0 14px;">
            <van-button class="my-btn" size="large" @click="feedback"><van-icon name="edit" /> 意见反馈</van-button>
        </div>

		<div class="kefu">
			<p v-if="kefu.kefu != ''"><van-icon name="service-o" /><span>客服：{{kefu.kefu}}</span></p>
			<p v-if="kefu.weixin != ''"><van-icon name="chat-o" /><span>微信：{{kefu.weixin}}</span></p>
			<p v-if="kefu.qq != ''"><van-icon name="friends-o" /><span>QQ：{{kefu.qq}}</span></p>
		</div>
	</div>
</template>

<script>
export default {
    data() {
        return {
			user:[],
			notice:[],
			par:0,
			kefu:[]
        };
	},
	watch:{
    	$route(to,from){
		    if (to.path=='/') {		    	
		    	this.getData();
		    }
		}
    },
    created(){	
        this.getData();
	},
    methods: {
		feedback(){
			this.$router.push({path:'/feedback'});
		},
		showNotice(){
			this.$router.push({name: 'detail', params: { id: this.notice.id }});
		},
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
					that.notice = res.body.notice; 
					that.kefu = res.body.kefu; 
					that.par = that.user.par;					
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
.header{height:110px; width: 100%; display: flex; padding:0 10px; box-sizing: border-box;background: url(../assets/image/header.jpg);background-size:cover;color: #fff}
.header .faceBox{width: 80px; text-align: right}
.header .faceBox .setting{font-size: 12px; line-height: 30px; color: #fff}
.header .faceBox img{width: 60px; border:3px #fff solid; border-radius: 50%}
.header .baseInfo{flex:1}
.header .baseInfo h1{font-size: 20px; margin-top: 40px; margin-bottom: 10px}
.header .baseInfo .base{color: #fff; font-size: 14px; line-height: 20px}
.header .baseInfo .base i{color:#ffff00; float: left;}
.header .baseInfo .base span{display: block}

.par{margin-bottom:20px}
.menu{padding-top: 40px; clear: both;overflow: hidden; padding-right: 15px;}
.menu li{float: left; width: 50%; padding-left: 15px; box-sizing: border-box; margin-bottom:15px}
.menu li .item{box-shadow: 0 0 8px #ccc; border-radius: 5px; padding: 20px 0; overflow:hidden;}
.menu li .item i{background:#1989fa; height: 50px; width: 50px; border-radius: 50%; text-align: center; line-height: 50px;color: #fff; font-size:20px; margin-left: 20px; display: block; float: left; margin-right: 10px}
.menu li .color1 i{background: #e14546}
.menu li .color2 i{background: #1fc9c0}
.menu li .color3 i{background: #ffba38}
.menu li .color4 i{background: #00b1dd}
.menu li .color5 i{background: #00b1dd}
.menu li .color6 i{background: #ff7e3d}
.menu li .item span{display: block; line-height: 50px;}
.menu li a{color: #666}
.menu li.disable span{color: #ccc}
.menu li.disable i{background: #9fcfff}
.my-btn{color: #fff;background-color: #29d7ee;border: 1px solid #29d7ee;}
.kefu{clear: both; text-align: center; overflow: hidden; background-color: #f1f1f1; margin-top: 20px; padding: 10px 0}
.kefu p{margin: 5px 0;clear: both;}
.kefu p i{color: #e14546; font-size:20px; display: block; width: 30%; text-align: right; float: left;}
.kefu p span{display: block; float: left; padding-left: 10px; font-size: 14px}
</style>
