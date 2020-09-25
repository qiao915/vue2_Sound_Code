/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
  const el = query(id)   // 获得选择器所对应的节点   如果选择器不存在 则执行document.createElement('div') 创建节点

  return el && el.innerHTML   //返回节点中的 innerHTML
})

/*保存原来的 $mount*/
const mount = Vue.prototype.$mount

/*扩展默认的 $mount*/
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  /*
    解析用户传进来的options
  */
  const options = this.$options
  // resolve template/el and convert to render function

  /*
   var options = {
      el: "#app",     // 优先级 最低
      template: "<div>template</div>"  // 优先级 第二
      render: h => h(App)     //优先级最高
   }
   new Vue(
     options
   ).$mount()

   下面 代码可得知 优先级顺序为 render > template > el
  * */
  if (!options.render) {   // render 优先级最高    存在render情况下  下面的都不执行了
    let template = options.template
    if (template) {   // 优先级 其次为 template
      if (typeof template === 'string') {  // 如果template 为字符串
        if (template.charAt(0) === '#') {  // template 为选择器
          /* todo ？疑问：class类名也应该是可以的     query(el)获取节点是以document.querySelector(el)方式获取的 */

          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) { //线上环境 且节点不存在 则报警告
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {     // 优先级 后为 el
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue
