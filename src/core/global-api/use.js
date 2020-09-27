/* @flow */

/*
* Vue.use() 方法
* */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {    // 有没有install 方法  有则执行install
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {    //没有 install 方法 则apply
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
