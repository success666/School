<template>
  <!--  作业详情弹出框  -->
  <el-dialog
    :visible.sync="homeworkdialogVisible"
    width="50%"
    :before-close="handleClose"
    @open="show = true">
    <div style="padding-left: 20px;padding-right: 20px;">
      <el-row :gutter="20" style="text-align: center;font-size: 21px;" class="font-color">
        <span >{{detailLibModel.name}}</span>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3" style="font-weight: bold">练习量: </el-col>
        <el-col :span="17">{{detailLibModel.exerciseGroupNo}}&nbsp;组&nbsp;&nbsp;|&nbsp;&nbsp;每组&nbsp;{{detailLibModel.groupTime}}
          <span v-if="detailLibModel.groupTimeUnit==1">次</span>
          <span v-if="detailLibModel.groupTimeUnit==2">秒</span>
          <span v-if="detailLibModel.groupTimeUnit==3">分</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" style="font-weight: bold">适合年级: </el-col>
        <el-col :span="7">{{detailLibModel.gradeNames}}</el-col>
        <el-col :span="4" style="font-weight: bold">适合性别: </el-col>
        <el-col :span="5">{{detailLibModel.sexName}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" style="font-weight: bold">所需器材: </el-col>
        <el-col :span="7">{{detailLibModel.apparatusNames}}</el-col>
        <el-col :span="4" style="font-weight: bold">难度: </el-col>
        <el-col :span="5">{{detailLibModel.difficultyName}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" style="font-weight: bold">运动项目: </el-col>
        <el-col :span="16">{{detailLibModel.sportItemNames}}</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="5" style="font-weight: bold">动作描述: </el-col>
      </el-row>
      <el-row :gutter="24" style="margin-top: -20px;padding-left: 10px;padding-right: 10px;">
        <div style="padding-top: 20px;overflow:hidden">
          <div class="pre" v-html="detailLibModel.actionDescription" ></div>
        </div>
      </el-row>
      <el-row :gutter="24">
        <el-col style="font-weight: bold">教学视频: </el-col>
      </el-row>
      <div>
        <video-player v-if="show" class="video-player vjs-custom-skin"
                      ref="videoPlayer"
                      :playsinline="true"
                      :options="playerOptions"
        ></video-player>
      </div>
    </div>

  </el-dialog>
</template>

<script>
    export default {
      name: 'HomeworkLibDetail',
      props: ['data'],
      data() {
        return {
          // 作业详情弹窗容器
          detailLibModel: {},
          show: false,
          homeworkdialogVisible: false,
          playerOptions: {
            playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
            autoplay: false, // 如果true,浏览器准备好时开始回放。
            muted: false, // 默认情况下将会消除任何音频。
            loop: false, // 导致视频一结束就重新开始。
            preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
            language: 'zh-CN',
            aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            sources: [{
              type: '',
              src: 'http://xiaotitong-dev.oss-cn-shenzhen.aliyuncs.com/guidancePoint/1534228090345.mp4' // url地址
            }],
            poster: '', // 你的封面地址
            // width: document.documentElement.clientWidth,
            notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
            controlBar: {
              timeDivider: true,
              durationDisplay: true,
              remainingTimeDisplay: false,
              // 全屏按钮
              fullscreenToggle: true
            }
          }
        }
      },
      methods: {
        showDialog(libId) {
          this.homeworkdialogVisible = true
          // 视频源清空
          // this.$refs.videoPlayer.player.src('')
          var detailLib = {
            id: libId
          }
          var that = this
          that.detailLibModel = {}
          this.$store.dispatch('GetHomeworkLibDetail', detailLib).then(response => {
            that.detailLibModel = response.data
            // 适合年级数据组装
            var gradeNames = that.detailLibModel.gradeNames
            gradeNames = gradeNames.replace(new RegExp(',', 'g'), '、')
            that.detailLibModel.gradeNames = gradeNames
            // 难度数据组装
            var difficultyName = that.detailLibModel.difficultyName
            difficultyName = difficultyName.replace(new RegExp(',', 'g'), '、')
            that.detailLibModel.difficultyName = difficultyName
            // 运动项目数据组装
            var sportItemNames = that.detailLibModel.sportItemNames
            sportItemNames = sportItemNames.replace(new RegExp(',', 'g'), '、')
            that.detailLibModel.sportItemNames = sportItemNames
            // 器材数据组装
            var apparatusNames = that.detailLibModel.apparatusNames
            apparatusNames = apparatusNames.replace(new RegExp(',', 'g'), '、')
            that.detailLibModel.apparatusNames = apparatusNames
            // 器材数据组装
            var sexName = that.detailLibModel.sexName
            sexName = sexName.replace(new RegExp(',', 'g'), '、')
            that.detailLibModel.sexName = sexName
            // 视频源更新
            this.$refs.videoPlayer.player.pause()
            this.$refs.videoPlayer.player.src(this.detailLibModel.teachingVideoUrl)
            if (this.detailLibModel.teachingVideoUrl === '' || this.detailLibModel.teachingVideoUrl === null) {
              this.show = false
            }
          })
        },
        handleClose(done) {
            this.$refs.videoPlayer.player.pause()
          done()
        }
      }
    }
</script>

<style scoped>
  .font-color {
    color: #006CEE;
  }
</style>
