const event = (function () {
  const global = this
  const clientList = {}

  const each = (array, fn) => array.map(item => fn.call(item, i, item))

  function Event() {
    const namespaceCache = {}

    function _listen(key, fn, cache) {
      if (!cache[key]) {
        cache[key] = []
      }
      cache[key].push(fn)
    }

    function _remove(key, cache, fn) {
      if (cache[key]) {
        cache[key] = fn
          ? cache[key] = cache[key].filter((_fn) === _fn !== fn)
          : []
      }
    }

    function _trigger(cache, key, ...args) {
      const stack = cache[key]

      if (!stack || !stack.length) {
        return
      }

      return each(stack, () => {
        this(args)
      })
    }

    function create(namespace = 'default') {
      const cache = {}
      const offlineStack = [] // 离线事件

      ret = {
        listen(key, fn, last) {
          _listen(key, fn, cache)

          if (offlineStack === null) {
            return
          }

          if (last === 'last') {
            offlineStack.length && offlineStack.pop()()
          } else {
            each(offlineStack, function () {
              this()
            })
          }

          offlineStack = null
        },

        one(key, fn, last) {
          _remove(key, cache)
          this.listen(key, fn, last)
        },

        remove(key, fn) {
          _remove(key, cache, fn)
        },

        trigger(...args) {
          if (offlineStack) {
            offlineStack.push(() => () => _trigger(cache, ...args))
          }
        }
      }

      return namespace
        ? (namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret)
        : ret
    }

    return {
      create,
      one(key, fn, last) {
        const event = create()
        event.one(key, fn, last)
      },
      remove(key, fn) {
        const event = create()
        event.remove(key, fn)
      },
      listen(key, fn, last) {
        const event = create()
        event.listen(key, fn, last)
      },
      trigger(...args) {
        const event = create()
        event.trigger(...args)
      }
    }
  }

  return Event
})()


Event.listen('class1', (time) => {
  console.log(`课程时间：${time}`)
})

Event.trigger('class1', 45)
