## Installation

#### NPM

```
npm i vue-live-video
```

#### Yarn

```
yarn add vue-live-video
```

## Use it

#### Quick start

```vue
<template>
  <live-video @on-zoom="zoomEvent" src="http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8">
</template>  

<script>
import liveVideo from 'vue-live-video'
export default {
  components: { liveVideo },
  methods: {
    zoomEvent(data) { //获取框选器放大坐标
      let postData = {
        startX: (data.startXRatio * 255).toFixed(0),
        startY: (data.startYRatio * 255).toFixed(0),
        endX: (data.endXRatio * 255).toFixed(0),
        endY: (data.endYRatio * 255).toFixed(0),
      }
    },
  }
}
</script>
```

#### Usage


```vue
<template>
    <live-video
      ref="video" 
      @on-zoom="zoomEvent"
      width="900px" 
      height="590px"
      rectStrokeColor="#fcf63c"
      rectStrokeWidth="1"
      rectFillStyle="rgba(0, 0, 0, .2)" 
      src="http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8"
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
      this.$refs.video.reset() //框选器结果重置
    },
    pause() {
      let video = this.$refs.video 
      if (video.isSelectorDisabled()) { 
        video.enableSelector() //禁用框选器
      } else {
        video.disableSelector() //启用框选器
      }
    },
    zoomEvent(data) { //获取框选器放大坐标
      console.info(data)
      this.postData = {
        startX: (data.startXRatio * 255).toFixed(0), //处理为接口需要比例参数
        startY: (data.startYRatio * 255).toFixed(0),
        endX: (data.endXRatio * 255).toFixed(0),
        endY: (data.endYRatio * 255).toFixed(0),
      }
    },
  },
  mounted() {
    let video = this.$refs.video.getVideo() //获取videoJs播放控件
    video.on('loadstart', function () {
      console.log('开始请求数据 ')
    })
    video.on('progress', function () {
      console.log('正在请求数据 ')
    })
    video.on('loadedmetadata', function () {
      console.log('获取资源长度完成 ')
    })
    video.on('canplaythrough', function () {
      console.log('视频源数据加载完成')
    })
    video.on('waiting', function () {
      console.log('等待数据')
    })
    video.on('play', function () {
      console.log('视频开始播放')
    })
  },
}
</script>
```

##### Props
 
| 参数 | 默认 | 说明 |
|------|-------|-------|
| width | 580px | 播放器宽 |
| height | 480px | 播放器高|
| rectStrokeColor | #fcf63c | 框选器边框颜色|
| rectStrokeWidth| 1 | 框选器边框粗细|
| rectFillStyle |  | 框选器填充颜色|
| src |   |  hls流播放地址，支持动态更换 |

##### Events

 
| 事件名 |  说明 |
|------|-------|
| on-zoom  | 框选器选定触发，接收选取4个坐标 |



