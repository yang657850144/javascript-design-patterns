const noop = function () {}
const description = {
  enumerable: true,
  configurable: false,
  get: noop,
  set: noop
}
/**
 * 观察者 Observer
 * @param {*} data
 */
function observer (data) {
  Object.keys(data).forEach(key => {
    defineReactive(data, key, data[key])
  })
}
/**
 * 响应式数据
 * @param {*} data 消息主体
 * @param {*} key
 * @param {*} val
 */
function defineReactive (data, key, val) {
  if (val && typeof val === 'object') {
    // 对非空子节点，且类型为 object 递归注册
    observer(val)
  }
  let dep = new Dep()
  let _privateValue = val
  description.set = function (newValue) {
    console.log('值改变了')
    _privateValue = newValue
    dep.notify()
  }
  description.get = function () {
    Dep.target && dep.register(Dep.target)
    return _privateValue
  }
  Object.defineProperty(data, key, description)
}

function Dep () {
  this.subs = [] // subscription: 订阅器
}

Dep.prototype = {
  register (sub) {
    this.subs.push(sub)
  },
  notify () {
    this.subs.forEach(sub => {
      sub.update() // 更新视图
    })
  }
}
/**
 *
 * @param {*} vm vue 实例对象
 * @param {*} exp 指令标签中的属性值
 * @param {*} cb 更新视图的 update 回调方法
 */
function Watcher (vm, exp, cb) {
  this.value = this.get(exp) // 自身实力化
}

Watcher.prototype = {
  update () {
    this.run()
  },
  run () {
    let value = this.get()
    let oldValue = this.value
    if (value !== oldValue) {
      // 数据更新
      this.value = value
      this.cb.call(this.vm, value, oldValue)
    }
  },
  get (key) {
    Dep.target = this
    let value = this.vm[key] // 触发 vm[key] 中的 setter
    Dep.target = null
    return value
  }
}

let data = {
  name: 'yang',
  origin: {
    name: 'shanxi'
  },
  children: []
}
observer(data)
data.name = 'xin' // 值改变了
data.origin.name = 'guangdong' // 值改变了
data.children.push({ // 未监听到数据变化
  name: 'xiaoxiaoxing'
})

// const Observer = (function () {
//   let _message = {}
//   return {
//     register (type, cb) {
//       if (!_message[type]) {
//         _message[type] = [cb]
//       } else {
//         _message[type].push(cb)
//       }
//     },
//     notify (type) {
//       _message[type].forEach(cb => {
//         cb()
//       })
//     }
//   }
// })()

// Observer.register('success', _ => {
//   console.log('ooook')
// })
// Observer.register('success', _ => {
//   console.log('ooono')
// })

// Observer.notify('success')
