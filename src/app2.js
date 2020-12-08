import "./app2.css"
import $ from "jquery"

const eventBus = $(window)
const localKey = "app2.index"

const m = {
  data: {
    index: parseInt(localStorage.getItem(localKey)) || 0
  },
  create() {},
  delete() {},
  update(data) {
    Object.assign(m.data, data)  // 把参数 data 替换到 m.data
    eventBus.trigger("m:updated")
    localStorage.setItem("index", m.data.index)
  },
  get() {}
}


const v = {
  el: null,
  html: (index) => {
    return `
      <div>
        <ol class="tab-bar">
          <li class="${index === 0 ? "selected" : ""}" data-index="0"><span>1111</span></li>
          <li class="${index === 1 ? "selected" : ""}" data-index="1"><span>2222</span></li>
        </ol>
        <ol class="tab-content">
          <li class="${index === 0 ? "active" : ""}">内容1</li>
          <li class="${index === 1 ? "active" : ""}">内容2</li>
        </ol>
      </div>
    `
  },
  init(el) {
    v.el = $(el)
    v.render()
  },
  render(index) {
    if (v.el.children.length !== 0) v.el.empty()
    $(v.html(index)).appendTo(v.el)
  }
}

const c = {
  init(container) {
    v.init(container)
    v.render(m.data.index) // view = render(data) 第一次渲染
    c.autoBindEvents()
    eventBus.on("m:updated", () => {
      v.render(m.data.index)
    })
  },
  events: {
    "click .tab-bar li": "x"
  },
  x(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    m.update({index: index})
    /* const $li = $(e.currentTarget)
     $li.addClass("selected").siblings().removeClass("selected")
     const index = $li.index()
     localStorage.setItem(localKey, index)
     $tabContent.children().eq(index).addClass("active").siblings().removeClass("active")*/
  },
  autoBindEvents() {
    for (let key in c.events) {
      const func = c[c.events[key]]
      const spaceIndex = key.indexOf(" ")
      const part1 = key.slice(0, spaceIndex)
      const part2 = key.slice(spaceIndex + 1)
      // console.log(part1, "---", part2)
      v.el.on(part1, part2, func)
    }
  }
}

export default c

/*
const $tabBar = $("#app2 .tab-bar")
const $tabContent = $("#app2 .tab-content")

// 1. jq 提供的事件委托写法如下：监听 tabBar 下的所以 li 的 click 事件
// 2. 如何确定一个元素在所有同级元素中的位置：遍历。jq 内置遍历下标 index()
$tabBar.on("click", "li", (e) => {
// console.log(e.target)  // 可能获取到 span
// console.log(e.currentTarget)  // 只获取 li // 具体用哪一个，可以试一下
  const $li = $(e.currentTarget)
  
  $li.addClass("selected")
    .siblings().removeClass("selected")
  
  const index = $li.index()  // 获取当前激活的tab的下标
  localStorage.setItem(localKey, index) // 存储到 ls
// console.log(index)  // 0 或 1
  
  $tabContent.children().eq(index).addClass("active") // 匹配展示内容与tabBar标题
    .siblings().removeClass("active")
})

// 设置默认情况下，激活第 index 个 li （也可以在 html 中直接添加上激活的类名来展示默认li）
$tabBar.children().eq(index).trigger("click")
*/
