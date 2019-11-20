## [[Prototype]]
```js
var anotherObject = {
    a: 2
};
var myObject = Object.create(anotherObject);
console.log(myObject.a); // 2
```
Object.create会创建一个对象，并把它的[[prototype]]关联到指定的对象。
使用for..in遍历对象时原理和查找原型链类似，任何可以通过原型链访问到的属性都会被枚举。使用in操作符来检查属性在对象中存在时，也会查找对象的整个原型链（无论属性是否可枚举）。

## 构造函数调用
对一个函数进行构造函数调用（new），发生了什么事情：
- 创建一个新对象
- 将构造函数的作用域赋给新对象
- 执行构造函数中的代码
- 返回新对象

```js
function Foo(name) {
    this.name = name;
}

// example
// invoke myNew
const a = myNew(Foo, 'foo');

function myNew() {
    // create a new object
    var obj = new Object();
    // get the constructor
    var ctor = Array.prototype.shift.call(arguments);
    // build [[prototype]]
    obj.__proto__ = ctor.prototype;
    // execute the code in ctor
    var result = ctor.apply(obj, arguments);
    // return the new obj if ctor has no object returned
    return typeof result === 'object' ? result : obj;
}
```
## 原型继承
