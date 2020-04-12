// 任务二 实现bind的polify
// 首先我们应该先了解bind方法的功能
/**
 * 1. 创建一个函数
 * 2. 在bind被调用的时候，新函数的this被指定为bind的第一个参数
 * 3. 其余的参数将作为新函数的参数，供调用时使用
 */

// Function.prototype.bind = function (context) {
//   let me = this;
//   let args = Array.prototype.slice.call(arguments);
//   return function () {
//     return me.apply(context, args.slice(1));
//   };
// };

// 这样其实看起来没有问题了，返回了一个函数，改变了this 剩余的参数也给到了新函数

// 但是请看 下面这个例子就会发现问题了
// 我们用MDN上的一个例子来验证一下预设参数问题
function test() {
  console.log(this); // { string: '我是一个test' }
  return Array.prototype.slice.call(arguments);
}

const a = {
  string: "我是一个test",
};

let test1 = test.bind(a, 1, 2, 3);
console.log(test1(555, 777)); // [ 1, 2, 3 ]

// 很明显 这里打印了 [1,2,3],而我们想要的结果是 [1,2,3,555,777] // 并没有把新函数的参数应用上。

// 所以继续改进
// Function.prototype.bind = function (context) {
//   const me = this;
//   const args = Array.prototype.slice.call(arguments, 1);
//   return function () {
//     const innerArgs = Array.prototype.slice.call(arguments);
//     const finalArgs = args.concat(innerArgs);
//     return me.apply(context, finalArgs);
//   };
// };
// 再次测试 通过
console.log(test1(555, 777)); // [ 1, 2, 3, 555, 777 ]

// 实现成这样就实现了 bind的所有基本功能。但是要继续向下深究还有没有实现的部分，这部分是MDN上的polyfill也没有实现

/*
 * 绑定函数自动适应于使用 new 操作符去构造一个由目标函数创建的新实例。
 * 当一个绑定函数是用来构建一个值的，原来提供的 this 就会被忽略。
 * 不过提供的参数列表仍然会插入到构造函数调用时的参数列表之前。
 */

// 这是MDN上的一段话，第一遍读的时候，我的想法是：每个字我都认识怎么放一块我就不认识了？？？ 小朋友？？？
// 还是少bb多敲代码吧

// 同步上面的概念 Point 是目标函数
function Point(x, y) {
  this.x = x;
  this.y = y;
}
Point.prototype.toString = function () {
  return this.x + "," + this.y;
};

const obj = { aa: "123" };
// BindPoint 应该就是绑定函数
const BindPoint = Point.bind(obj, 2);

// 这样的话 第一句话就是 可以用new BindPoint 去构造一个 Point 的实例 哎我擦 我真是太厉害了。
// console.log(new BindPoint(3)); // {} 上面写的bind方法肯定不行了 原生的就OK Point { x: 2, y: 3 }

// 这样看来第二句话的意思就是，即使传递了第一个参数绑定this，如上例中绑定了obj 但是会被忽略，因为返回的是Point的实例
// 第三句话就是原意了 没啥特殊的

// 所以接下来看该如何实现这个功能了
// 原有的逻辑应该不需要改变
Function.prototype.bind = function (context) {
  const me = this;
  const args = Array.prototype.slice.call(arguments, 1);
  const F = function () {}; // 只是相当于一个中转函数
  F.prototype = this.prototype; // 这步是为了拿到 Point 原型上的属性和方法
  const bound = function () {
    const innerArgs = Array.prototype.slice.call(arguments);
    const finalArgs = args.concat(innerArgs);
    console.log(123, this);
    // 判断 this 是否是 F 的实例 如果是说明 是用new 调用的 BindPoint 这个时候 的this 就已经指向了 Point 所以返回 this即可
    return me.apply(this instanceof F ? this : context || this, finalArgs);
  };
  bound.prototype = new F(); // F 的prototype是 this (Point) 也就是说bound就相当于继承了 Point 可以访问 Point上的属性，也可以访问Point原型上的属性
  return bound;
};

function Point1(x, y) {
  this.x = x;
  this.y = y;
}
Point1.prototype.toString = function () {
  return this.x + "," + this.y;
};

const obj1 = { aa: "123" };
// BindPoint 应该就是绑定函数
const BindPoint1 = Point1.bind(obj1, 2);
let instance = new BindPoint1(3);
console.log(instance);
// 由于F.prototype = this.prototype 所以 new出来的实例 直接就是Point的实例 同时也是 BindPoint的实例
console.log(instance instanceof Point1, instance instanceof BindPoint1);
