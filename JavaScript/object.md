## 类型
在JavaScript中一共有七种主要类型：
- string
- number
- boolean
- null
- undefined
- object
- symbol
其中的简单基本类型（simple primitive type）string, boolean, number, null和undefined不是对象。

判断一个对象上是否有某个属性时，应该用in。用属性值是否为undefined来判断不够准确。

## 创建对象
### 工厂模式
```js
function createPerson(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function() {
        console.log(this.name);
    };
    return o;
}
```

### 构造函数模式
由于工厂模式不能解决对象识别的问题，引入了这个模式。
```js
function Person(name, age, job) {
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function() {
        console.log(this.name);
    };
}

var p1 = new Person('greg', 27, 'doctor');
```
调用构造函数实际会经历以下4步：
- 创建新对象
- 将构造函数的作用域赋给新对象，this就指向了新对象
- 执行构造函数
- 返回新对象
```js
console.log(p1.constructor === Person); // true
console.log(p1 instanceof Person); // true
```

### 原型模式
每一个函数都有一个原型属性（prototype），指向一个对象。原型就是通过调用构造函数而创建的那个对象实例的原型对象。
只要创建一个函数，就会为函数创建一个prototype属性，指向函数的原型对象。

## 继承
```js
function SuperType() {
    this.colors = ['red', 'blue'];
}

function SubType() {
    // 借用基类构造函数
    SuperType.call(this);
}

SubType.prototype = new SuperType();
```
### 组合继承
原型链+借用构造函数。

### 原型式继承
```js
function object(o) {
    function F() {};
    F.prototype = o;
    return new F();
}
```
Object.create方法规范了这个模式。

### 寄生组合式继承
组合继承是常用模式，但是问题是调用了两次调用了构造函数。
寄生组合式继承的思路是：不必为了指定子类型的原型而调用超类型的构造函数，我们需要的无非就是超类型原型的副本。
```js
function inherit(subType, superType) {
    var prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

function SuperType(name) {
    this.name = name;
}

SuperType.prototype.getName = function() {
    return this.name;
}

function SubType(name, age) {
    // 只调用一次超类构造函数
    SuperType.call(this, name);
    this.age = age;
}

inherit(SubType, SuperType);

// 子类自己的方法
SubType.prototype.getAge = function() {
    return this.age;
}

```