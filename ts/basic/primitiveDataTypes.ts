// 原始数据类型Primitive data types
// 布尔值、数值、字符串、null、undefined、Symbol


// 布尔值
let isDone: boolean = false;
// 使用构造函数Boolean创造的对象不是布尔值，new Boolean()返回的是一个Boolean对象：
let createdByNewBoolean: boolean = new Boolean(1);
// 直接调用Boolean也可以返回一个boolean类型：
let createdByBoolean: boolean = Boolean(1);


// 数值
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010; // es6中的二进制表示法
let octalLiteral: number = 0o744;   // es6中的八进制表示法
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
// 编译结果
// var decLiteral = 6;
// var hexLiteral = 0xf00d;
// var binaryLiteral = 10;
// var octalLiteral = 484;
// var notANumber = NaN;
// var infinityNumber = Infinity;


// 字符串
let myName: string = 'Tom';
let myAge: number = 25;
let sentence: string = `Hello, my name is ${myName}. I'll be ${myAge + 1} years old next month.`;   // 模板字符串
// 编译结果
// var myName = 'Tom';
// var myAge = 25;
// var sentence = "Hello, my name is " + myName + ".\nI'll be " + (myAge + 1) + " years old next month.";


// 空值
// JavaScript没有空值Void的概念，在TypeScript中，可以用void表示没有任何返回值的函数
function alertName(): void {
    alert('My name is Tom');
}
// 声明一个void类型的变量没有什么用，因为你只能将它赋值为undefined和null
let unusable: void = undefined;


// Null和Undefined
// 在TypeScript中，可以使用null和undefined来定义这两个原始数据类型：
let u: undefined = undefined;
let n: null = null;
// undefined类型的变量只能被赋值为undefined，null类型的变量只能被赋值为null
// 与void的区别是，undefined和null是所有类型的子类型。也就是说undefined类型的变量，可以赋值给number类型的变量；
let num: number = undefined;
let u: undefined;
let num: number = u;        // suc
// 而void类型的变量不能赋值给number类型的变量：
let u: void;
let num: number = u;        // error






