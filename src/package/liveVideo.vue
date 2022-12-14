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
    rectCleanDelay: {
      type: String,
      default: () => '120',
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
      timer: null,
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
      if (this.timer) {
        setTimeout(this.timer)
        this.timer = null
      }
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
      if (this.rectCleanDelay > 0) {
        this.timer = setTimeout(() => {
          this.claenMap()
        }, Number(this.rectCleanDelay))
      }
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
        autoplay: true, // ??????????????????
        muted: true, // ???????????????true???????????????????????????,???????????????????????? ???Chrome66???????????????????????????????????????????????????
        preload: this.preload, // ?????????
        controls: false, // ?????????????????????
      })
      this.setUrl()
    },
  },
  mounted() {
    this.initVideo()
    this.getVideo().on('loadstart', () => {
      this.createMap()
    })
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


