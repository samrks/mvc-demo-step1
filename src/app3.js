import "./app3.css"
import $ from "jquery"

const html = `
    <section id="app3">
      <div class="square"></div>
    </section>
`
const $element = $(html).appendTo($("body>.page"))



const $square = $("#app3 .square")
const localKey = "app3.active"
/* 可能有三个值，yes、no、默认undefined */
const active = localStorage.getItem(localKey) === "yes"

// 现在根据active变量，为true 就添加类名，为false，就不添加类名
/*if (active) {
  $square.addClass("active")
} else {
  $square.removeClass("active")
}*/
// 上面代码块可以用 toggleClass 简写
$square.toggleClass("active", active)  // 表示 active 变量为 true，则添加“active”类名，false 则不添加

$square.on("click", () => {
  // $square.toggleClass("active") // toggle（切换）有则删除、无则添加
  if ($square.hasClass("active")) {
    localStorage.setItem("app3.active", "no")
    $square.removeClass("active")
  } else {
    $square.addClass("active")
    localStorage.setItem("app3.active", "yes")
  }
})