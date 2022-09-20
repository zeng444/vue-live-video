import vueLiveVideo from "./liveVideo.vue"
const components = [vueLiveVideo]

const install = function (Vue) {
  components.map((component) => {
    Vue.component(component.name, component)
  })
}
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue)
}

export default vueLiveVideo
