/**
 *
 * Array.from
 * desc 从一个类似数组或可迭代对象创建一个新的，@浅拷贝 的数组实例
 * @param {arrayLike} arrayLike 类数组
 * @param {Function} mapFn 可选,回调方法，新数组中每一个元素都会执行这个回调方法
 * @param {this} thisArg 可选, 只想回调 mapFn 时的 this 对象
 * @return {Array} 一个新的数组实例
 */

// 根据描述可以知道 参数一 可以是类数组 或者一个可迭代对象 所以可以是有length属性的arguments，也可以是可迭代的Map，set。当然也包括字符串
const string = "foo";
const arr1 = Array.from(string);
console.log(arr1); // [ 'f', 'o', 'o' ]

// arguments
function argTest() {
  const arr = Array.from(arguments);
  return arr;
}
const arr2 = argTest(1, 2, 3, 4, 5);
console.log(arr2); // [1, 2, 3, 4, 5]

// set map
const set = new Set([1, 2, 3, 4]);
const arr3 = Array.from(set);
console.log(arr3); // [ 1, 2, 3, 4 ]
const map = new Map([
  [1, 2],
  [3, 4],
]);
const arr4 = Array.from(map);
console.log(arr4); // [ [ 1, 2 ], [ 3, 4 ] ]

// 回调方法
const test = [1, 2, 3, 4];
const testThis = {
  value: "test",
  number() {
    return 5;
  },
};
const arr5 = Array.from(
  test,
  (item) => {
    console.log(this);
    return item * 2;
  },
  testThis
);
// 值得注意的是，这里的回调函数如果使用箭头函数的话 this会绑定到外层也就是全局，由于箭头函数的this一经绑定不能修改，所以在使用箭头函数的时候传入第三个参数将不起作用
console.log(arr5);
