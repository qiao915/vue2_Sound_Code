/*
* todo
*  Vue构造函数定义
* */


import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

/*Vue 构造函数 */
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  /*init 初始化*/
  /*init 方法是又下面initMixin 方法给Vue添加的_init()*/
  this._init(options)

}

initMixin(Vue)  // 通过该方法给Vue添加_init方法
stateMixin(Vue) // $set,$delete,$watch
eventsMixin(Vue) // $emit,$on,$off,$once
lifecycleMixin(Vue) // _update(),$forceUpdate(),$destroy()
renderMixin(Vue)  // _render(), $nextTick

export default Vue
