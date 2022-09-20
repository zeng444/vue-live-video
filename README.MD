
### NPM

```
npm install vue-live-video --save
```

### Yarn

```
yarn add vue-live-video
```

### Use it

#### 

```vue
<template>
    <live-video
      ref="video" 
      @zoomEvent="zoomEvent" //接受选择结果
      width="900px" //播放器宽
      height="590px" //播放器高
      rectStrokeColor="#fcf63c" //选择器边框颜色
      rectStrokeWudth="1" //选择器边框粗细
      rectFillStyle="rgba(0, 0, 0, .2)" //选择器填充颜色
      src="http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8" //hls流播放地址
    >
</template>  

<script>
import liveVideo from 'vue-live-video'
export default {
  components: { liveVideo },
  data() {
    return {
      postData: {},
    }
  },
  methods: {
    reset() {
      this.$refs.video.reset()
    },
    pause() {
      let video = this.$refs.video
      if (video.isSelectorDisabled()) {
        video.enableSelector()
      } else {
        video.disableSelector() //调用接口时暂停选取功能
      }
    },
    zoomEvent(data) {
      console.info(data)
      this.postData = {
        startX: (data.startXRatio * 255).toFixed(0),
        startY: (data.startYRatio * 255).toFixed(0),
        endX: (data.endXRatio * 255).toFixed(0),
        endY: (data.endYRatio * 255).toFixed(0),
      }
    },
  },
  created() {},
}
</script>
```


