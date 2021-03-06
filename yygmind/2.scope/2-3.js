//  闭包面试题解

// 作用域
// 变量提升
var scope = 'global';
function scopeTest() {
    console.log(scope);
    var scope = 'local';
}
scopeTest();        // undefined
// 等价于
var scope="global";
function scopeTest(){
    var scope;
    console.log(scope);
    scope = "local"  
}
scopeTest();        //undefined


// 没有块级作用域
var data = [];
for (var i = 0; i < 3; i++) {
    data[i] = function() {
        console.log(i);
    };
}
data[0]();      // 3
data[1]();      // 3
data[2]();      // 3


// 作用域链
// 每个函数都有自己的执行上下文环境，当代码在这个环境中执行时，会创建变量对象的作用域链，作用域链是一个对象列表或对象链，它保证了变量对象的有序访问。
// 作用域链的开始是当前代码执行环境的变量对象，常被称为“活跃对象”(AO)，变量的查找会从第一个链的对象开始，如果对象中包含变量属性，那么久停止查找，如果没有就会继续向上级作用域链查找，直到找到全局对象中。


// 闭包
function createClosure() {
    var name = 'jack';
    return {
        setStr: function() {
            name = 'rose';
        },
        getStr: function() {
            return name + ':hello';
        }
    }
}
var builder = new createClosure();
builder.setStr();
console.log(builder.getStr());      // rose:hello
// 上面在函数中返回了两个闭包，这两个闭包都维持着对外部作用域的引用。闭包中会将外部函数的自由对象添加到自己的作用域链中，所以可以通过内部函数访问外部函数的属性，这也是javascript模拟私有变量的一种方式。


// 闭包面试题
// 由于作用域链机制的影响，闭包只能取得内部函数的最后一个值，这引起的一个副作用就是如果内部函数在一个循环中，那么变量的值始终为最后一个值。

// 立即执行函数
for (var i = 0; i < 3; i++) {
    (function(num) {
        setTimeout(function() {
            console.log(num);
        }, 1000);
    })(i);
}
// 0
// 1
// 2

// 返回一个匿名函数赋值
var data = [];
for (var i = 0; i < 3; i++) {
    data[i] = (function (num) {
        return function(){
            console.log(num);
        }
    })(i);
}
data[0]();	// 0
data[1]();	// 1
data[2]();	// 2
// 无论是立即执行函数还是返回一个匿名函数赋值，原理上都是因为变量的按值传递，所以会将变量i的值复制给实参num，在匿名函数的内部又创建了一个用于访问num的匿名函数，这样每个函数都有了一个num的副本，互不影响了。

// 使用ES6的let
var data = [];
for (let i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}
data[0]();  // 0
data[1]();  // 1
data[2]();  // 2
// 原理
var data = [];      // 创建一个数组data
// 进入第一个循环
{
    let i = 0;      // 注意：因为使用let使得for循环为块级作用域
                    // 此次let i = 0 在这个块级作用域中，而不是在全局环境中
    data[0] = function() {
        console.log(i);
    };
}
// 循环时，let声明i，所以整个块是块级作用域，那么data[0]这个函数就成了一个闭包。这里用{}表达并不符合语法，只是希望通过它来说明let存在时，这个for循环块是块级作用域，而不是全局作用域。
// 上面的块级作用域，就像函数作用域一样，函数执行完毕，其中的变量会被销毁，但是因为这个代码块中存在一个闭包，闭包的作用域链引用着块级作用域，所以在闭包被调用之前，这个块级作用域内部的变量不会被销毁。
// 进入第二次循环
{
    let i = 1;      // 因为let i = 1 和上面的let i = 0
                    // 在不同的作用域中，所以不会相互影响
    data[1] = function() {
        console.log(i);
    };
}


// 思考题
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();         // local scope

var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
var foo = checkscope(); 
foo();                  // local scope
// 上面的两个代码中，checkscope()执行完成后，闭包f所引用的自由变量scope会被垃圾回收吗？为什么？

// 解析
// 代码1中的自由变量特定时间之后回收，代码2中自由变量不回收。
// 首先要说明的是，现在主流浏览器的垃圾回收算法是标记清除，标记清除并非是标记执行栈的进出，而是从根开始遍历，也是一个找引用关系的过程，但是因为从根开始，相互引用的情况不会被计入。
// 所以当垃圾回收开始时，从Root全局对象开始寻找这个对象的引用是否可以，如果引用链断裂，那么这个对象就会回收。
// 闭包中的作用域链中parentContext.VO是对象，被放在堆中，栈中的变量会随着执行环境近处而销毁，堆中需要垃圾回收，比包内的自由变量会被分配到堆上，所以当外部方法执行完毕后，对其的引用并没有丢。
// 每次进入函数执行时，会重新创建可执行环境和活动对象，但函数的[[Scope]]是函数定义时就已经定义好的(词法作用域规则)，不可更改。

// 对于代码1
// checkscope执行时，将checkscope对象指针压入栈中，其执行环境变量如下
checkscopeContext: {
    AO: {
        arguments:
        scope:
        f:
    },
    this,
    [[Scope]]: [AO, globalContext.VO]
}
// 执行完毕后出栈，该对象没有绑定给谁，从Root开始查找无法可打，此活动对象一段时间后会被回收

// 对于代码2
// checkscope执行后，返回的是f对象，其执行环境变量如下
fContext: {
    AO: {
        arguments:
    },
    this,
    [[Scope]]: [AO, checkscopeContext.AO, globalContext.VO]
}
// 此对象赋值给var foo = checkscope();将foo压入栈中，foo指向堆中的f活动对象，对于Root来说可达，不会被回收。
// 如果一定要回收自由变量scope，则foo = null;即可断开引用链。





