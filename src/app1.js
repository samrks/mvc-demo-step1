import "./app1.css"
import $ from "jquery"

// 传一个空对象，不是为了获取元素，而是为了获取对象上的方法 on 监听事件、trigger 触发事件
// 如果在一个监听，一个触发，那这两个事件就可以认为是实现了【通信】
const eventBus = $(window)
// console.log(eventBus.on)
// console.log(eventBus.trigger)

/*
* 数据相关 都放到 M
* 视图相关 都放到 V
* 其他都放到 C
* */
const m = {
  data: {
    n: parseInt(localStorage.getItem("n")) || 100
  },
  // 增删改查
  create() {},
  delete() {},
  update(data) {
    Object.assign(m.data, data)
    // Object.assign 用于对象的合并，将 data 对象的内容 添加到 m.data 中
    // 这里实现的效果是，用参数 data 替换掉 m.data 的值
    eventBus.trigger("m:updated")
    localStorage.setItem("n", (m.data.n).toString())
  },
  get() {}
}
const v = {
  el: null,
  html: `
    <div>
      <div class="output">
        <span id="number">{{n}}</span>
      </div>
      <div>
        <button id="add1">+1</button>
        <button id="minus1">-1</button>
        <button id="mul2">×2</button>
        <button id="divide2">÷2</button>
      </div>
    </div>
  `,
  init(el) {
    v.el = $(el)
    v.render()
  },
  /************************************************************************** 主要代码 ↓ *****************/
  render(n) {
    // 如果没有初始化，就把内容插入到html中，如果初始化过，就把旧的内容清空，再把新的内容插入到html中
    if (v.el.children.length !== 0) v.el.empty()
    $(v.html.replace("{{n}}", n)).appendTo(v.el)
  }
  /************************************************************************** 主要代码 ↑ ******************/
}


const c = {
  init(container) {
    v.init(container)
    v.render(m.data.n) // view = render(data) 第一次渲染
    c.autoBindEvents()
    eventBus.on("m:updated", () => {
      v.render(m.data.n)
    })
  },
  events: {
    "click #add1": "add",
    "click #minus1": "minus",
    "click #mul2": "mul",
    "click #divide2": "div"
  },
  add() {
    // m.data.n += 1
    m.update({n: m.data.n + 1})
  },
  minus() {
    // m.data.n -= 1
    m.update({n: m.data.n - 1})
  },
  mul() {
    // m.data.n *= 1
    m.update({n: m.data.n * 2})
  },
  div() {
    // m.data.n /= 1
    m.update({n: m.data.n / 2})
  },
  autoBindEvents() {
    for (let key in c.events) {
      const func = c[c.events[key]]
      const spaceIndex = key.indexOf(" ")
      const part1 = key.slice(0, spaceIndex)
      const part2 = key.slice(spaceIndex + 1)
      // console.log(part1, "---", part2, "---", func)
      v.el.on(part1, part2, func)
    }
  }
  /*bindEvents() {
    // 事件委托
    v.el.on("click", "#add1", () => {
      m.data.n += 1
      v.render(m.data.n) // view = render(data)
    })
    v.el.on("click", "#minus1", () => {
      m.data.n -= 1
      v.render(m.data.n)
    })
    v.el.on("click", "#mul2", () => {
      m.data.n *= 2
      v.render(m.data.n)
    })
    v.el.on("click", "#divide2", () => {
      m.data.n /= 2
      v.render(m.data.n)
    })
  }*/
}

export default c