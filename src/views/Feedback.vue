<template>
    <div class="wrap">
        <van-nav-bar title="投诉建议" left-arrow @click-left="onClickLeft"  @click-right="onClickRight">
        <van-icon name="edit" slot="right" />
        </van-nav-bar>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div class="panel" v-for="vo in info" :key="vo.id">
                <div class="hd">
                    <h1>{{vo.title}}</h1>
                    <span>{{vo.time}}</span>
                </div>
                <div class="content">{{vo.content}}</div>
                <div class="fd" v-if="vo.reply !=''">
                    <div class="reply">{{vo.reply}}</div>
                </div>
            </div>
        </van-list>        

        <van-popup v-model="boxShow" position="bottom">
            <div class="write">
            <van-field
                required
                clearable
                placeholder='请输入标题'
                v-model="formData.title"
            />
            <van-field
                v-model="formData.content"
                type="textarea"
                placeholder="请输入留言"
                rows="1"
                autosize
            />
            </div>
            <div style="padding: 10px;">
                <van-button class="my-btn" size="large" @click="saveFeedback">提交</van-button>
            </div>
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
            boxShow:false,
            formData:{title:'',content:''}
        };
    },
    created() {},
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
        onClickRight(){
            this.boxShow=true
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
            that.$http.post("/account/feedback",data).then(result => {
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
        saveFeedback(){
            var that = this;
            console.log(that.formData);
            if(that.formData.title==''){
                that.$dialog.alert({title:'错误信息',message:'请输入标题'});
                return false;
            }
            if(that.formData.content==''){
                that.$dialog.alert({title:'错误信息',message:'请输入留言内容'});
                return false;
            }
            that.formData.token = that.$store.state.token
            this.$toast.loading({mask: true,duration:0});
            that.$http.post("/account/write",that.formData).then(result => {
                this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {              
                    this.$dialog.alert({title:'提示',message:res.desc});
                    that.boxShow = false;
                } else {
                    that.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });

        }
    }
};
</script>

<style scoped>
.write{padding: 30px 0}
.my-btn{color: #fff;background-color: #1989fa;border: 1px solid #1989fa;}
.panel{margin: 10px; clear: both; overflow: hidden;border:1px #f7f7f7 solid}
.panel .hd{border-bottom: 1px #f1f1f1 solid; padding: 5px; background-color: #f7f7f7}
.panel .hd h1{font-size: 15px; font-weight: normal}
.panel .hd span{font-size: 12px; color: #999}
.content{font-size: 14px; margin: 10px; clear: both; overflow: hidden;}
.panel .fd{font-size: 14px; color: #1989fa; padding: 5px; border-top: 1px #f1f1f1 solid}
</style>
