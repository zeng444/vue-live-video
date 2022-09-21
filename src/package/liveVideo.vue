<template >
  <div class="liveVideo" @contextmenu.prevent :style="{ width: this.width, height: this.height }">
    <video style="width: 100%; height: 100%" ref="liveVideo" class="video-js vjs-default-skin" controls></video>
    <canvas @mouseleave.stop="leaveEvent" @mouseenter.stop="enterEvent" ref="liveVideo__mask" class="liveVideo__mask"></canvas>
  </div>
</template>
<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
export default {
  name: 'vue-live-video',
  props: {
    rectStrokeColor: {
      type: String,
      default: () => '#fcf63c',
    },
    rectFillStyle: {
      type: String,
    },
    rectStrokeWidth: {
      type: String,
      default: () => '1',
    },
    preload: {
      type: String,
      default: () => 'auto',
    },
    width: {
      type: String,
      default: () => '580px',
    },
    height: {
      type: String,
      default: () => '400px',
    },
    type: {
      type: String,
      default: () => 'application/x-mpegURL',
    },
    src: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      player: null,
      canvas: null,
      map: {
        width: 0,
        height: 0,
        startX: 0,
        endX: 0,
        startY: 0,
        endY: 0,
        event: {
          disable: false,
          mouseDowned: false,
          leaved: true,
        },
      },
    }
  },
  watch: {
    src: {
      handler(val) {
        console.info('check ' + val)
        this.setUrl(val)
      },
    },
  },
  methods: {
    disableSelector() {
      this.map.event.disable = true
    },
    isSelectorDisabled() {
      return this.map.event.disable
    },
    enableSelector() {
      this.map.event.disable = false
    },
    reset(clean) {
      this.map.startX = 0
      this.map.endX = 0
      this.map.startY = 0
      this.map.endY = 0
      clean && this.claenMap()
      this.callback()
    },
    createMap() {
      if (!this.canvas) {
        this.map.width = this.$refs.liveVideo__mask.width = this.$refs.liveVideo.offsetWidth
        this.map.height = this.$refs.liveVideo__mask.height = this.$refs.liveVideo.offsetHeight
        this.canvas = this.$refs.liveVideo__mask.getContext('2d')
      }
      return this.canvas
    },
    format(num) {
      return num.toFixed(3)
    },
    callback() {
      this.$emit('on-zoom', {
        startX: this.map.startX,
        startY: this.map.startY,
        endX: this.map.endX,
        endY: this.map.endY,
        startXRatio: this.format(this.map.startX / this.map.width),
        startYRatio: this.format(this.map.startY / this.map.height),
        endXRatio: this.format(this.map.endX / this.map.width),
        endYRatio: this.format(this.map.endY / this.map.height),
        width: this.map.width,
        height: this.map.height,
      })
    },
    claenMap() {
      this.createMap().clearRect(0, 0, this.map.width, this.map.height)
    },
    enterEvent() {
      this.map.event.leaved = false
    },
    leaveEvent() {
      this.map.event.leaved = true
      this.map.event.mouseDowned = false
      this.claenMap()
    },
    isWorked($event) {
      return $event.button === 0 && !this.map.event.leaved && !this.map.event.disable
    },
    downEvent($event) {
      $event.preventDefault() || $event.stopPropagation()
      if (!this.isWorked($event)) {
        return
      }
      this.map.startX = $event.offsetX
      this.map.startY = $event.offsetY
      this.map.event.mouseDowned = true
    },
    upEvent($event) {
      $event.preventDefault() || $event.stopPropagation()
      if (!this.isWorked($event)) {
        return
      }
      this.map.event.mouseDowned = false
      this.callback()
      setTimeout(() => {
        this.claenMap()
      }, 120)
    },
    moveEvent($event) {
      $event.preventDefault() || $event.stopPropagation()
      if (!this.isWorked($event) || !this.map.event.mouseDowned) {
        return
      }
      this.claenMap()
      let map = this.createMap()
      this.map.endX = $event.offsetX
      this.map.endY = $event.offsetY
      let width = this.map.endX - this.map.startX
      let height = this.map.endY - this.map.startY
      if (this.rectFillStyle) {
        map.fillStyle = this.rectFillStyle
        map.fillRect(this.map.startX, this.map.startY, width, height)
      }
      map.strokeStyle = this.rectStrokeColor
      map.lineWidth = Number(this.rectStrokeWidth)
      map.strokeRect(this.map.startX + 0.5, this.map.startY + 0.5, width, height)
    },
    setUrl(url) {
      if (url) {
        this.src = url
      }
      this.player.src([
        {
          src: this.src,
          type: this.type,
        },
      ])
    },
    getVideo() {
      return this.player
    },
    initVideo() {
      this.player = videojs(this.$refs.liveVideo, {
        autoplay: true, // 设置自动播放
        muted: true, // 设置了它为true，才可实现自动播放,同时视频也被静音 （Chrome66及以上版本，禁止音视频的自动播放）
        preload: this.preload, // 预加载
        controls: false, // 显示播放的控件
      })
      this.setUrl()
    },
  },
  mounted() {
    this.initVideo()
    this.createMap()
  },
  created() {
    document.addEventListener('mousedown', this.downEvent)
    document.addEventListener('mouseup', this.upEvent)
    document.addEventListener('mousemove', this.moveEvent)
  },
  beforeDestroy() {
    this.player && this.player.dispose()
    document.removeEventListener('mousedown', this.downEvent)
    document.removeEventListener('mouseup', this.upEvent)
    document.removeEventListener('mousemove', this.moveEvent)
  },
}
</script>
<style  scoped>
.liveVideo {
  position: relative;
}
.liveVideo__mask {
  position: absolute;
  left: 0;
  top: 0;
}
:deep() .video-js .vjs-big-play-button {
  display: none;
}
</style>


