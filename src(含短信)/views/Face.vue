<template>
    <div class="wrap">
        <van-nav-bar title="修改头像" left-arrow @click-left="onClickLeft"/>
        
        <van-uploader
            :after-read="getBase64"
            accept="image/gif, image/jpeg, image/png"
            style="width:100%">
            <div class="face"><img :src="face" /></div>
        </van-uploader>
        <div class="btnDiv">
            <van-button class="my-btn" @click="saveFace">保存</van-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            face:'',
            imgBase64:'',
            doSet:false
        };
    },
    watch:{
    	$route(to,from){
		    if (to.path=='/face') {		    	
		    	this.getData();
		    }
		}
    }, 
    created(){	
        this.getData();
	},
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
        saveFace(){
            var that = this;
            if(that.doSet){                
                let data = {
                    token : that.$store.state.token,
                    face : that.face
                };
                this.$toast.loading({mask: true,duration:0});
                that.$http.post("/account/setFace",data).then(result => {
                    this.$toast.clear();
                    let res = result.data;
                    if (res.code == 1) {              
                        this.$dialog.alert({title:'提示',message:res.desc});
                        that.doSet = false;
                    } else {
                        that.$dialog.alert({title:'错误信息',message:res.desc});
                    }
                });
            }            
        },
        getData(){
            var that = this;
            let data = {
                token : that.$store.state.token
			};
			this.$toast.loading({mask: true,duration:0});
            that.$http.post("/account/getFace",data).then(result => {
				this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {              
                    that.face = res.body.face; 
                } else if(res.code==9001) {
                    that.$dialog.alert({title:'错误信息',message:res.desc}).then(() => {
                        this.$router.push({path:'/login'});
                    });
                }else{
                    that.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
		},
        getBase64(file) {
            var that = this;
            if(/\/(?:jpeg|png|gif)/i.test(file.file.type)&&file.file.size>1000000) {
                let res = this.compressImage(file,400,400,function(res){
                    that.imgBase64 = res;
                    that.uploadImage();                  
                }); 
            }else{
                that.imgBase64 = file.content;
                that.uploadImage();
            }            
        },
        uploadImage(){
            this.$toast.loading({mask: true,duration:0});
            let data = {
                token : this.$store.state.token,
                image : this.imgBase64
			};
            this.$http.post("/account/upload",data).then(res => {
                this.$toast.clear();
                this.face = res.data.body.face;
                this.doSet = true;
            });
        },
        compressImage(file,width,height=0,callback){
            var img = new Image();
            img.src = file.content
            img.onload = function() {
                var that = this;
                if(height>0){
                    var w = width,h = height;
                }else{
                    //生成比例
                    var w = that.width,h = that.height,scale = w / h;
                    w = width || w;
                    h = w / scale;
                }
                //生成canvas
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');      
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(that, 0, 0, w, h);
                // 生成base64            
                let base64 =  canvas.toDataURL(file.file.type, 0.8);
                callback(base64)
            };
        }
    }
};
</script>

<style scoped>
.btnDiv{text-align: center; width: 100%}
.my-btn{color: #fff;background-color: #1989fa;border: 1px solid #1989fa;}
.face{width: 150px; margin: 30px auto;}
.face img{width:150px;height: 150px; border:3px #fff solid; border-radius: 50%; box-shadow: 0 0 10px #999}
</style>
