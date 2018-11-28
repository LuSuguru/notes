### 深入浅出Node.js

#### node的特点 
- 异步I/O 
<img src="./assets/1/异步.png" width="600" height="300" />

- 事件与回调函数
- 单线程
   1. 缺点
      - 无法利用多核CPU  
      - 错误会引起整个应用退出，应用的健壮性值得考验
      - 大量计算占用CPU，导致无法继续调用异步I/O
- 跨平台：基于libuv在Node上层模块系统与操作系统之间构建了一层平台层架构 
<img src="./assets/1/跨平台.png" width="320" height="200" />

#### 笔记
- [模块机制](./module.md)
- [异步I/O](./asyncIO.md)
