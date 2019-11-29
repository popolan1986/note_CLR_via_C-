Function.prototype.myCall = function(thisArg) {
    if (typeof this !== 'function') {
        throw new TypeError('the object is not callable');
    }

    var fToBind = this;
    thisArg = thisArg || window;
    var args = Array.prototype.slice.call(arguments, 1);
    thisArg.fn = fToBind;
    // 解构数组
    var result = thisArg.fn(...args);
    delete thisArg.fn;
    return result;
}

Function.prototype.myApply = function(thisArg) {
    if (typeof this !== 'function') {
        throw new TypeError('the object is not callable');
    }

    var fToBind = this;
    thisArg = thisArg || window;
    // 注意这里的不同，因为apply第二个参数是一个array
    var args = arguments[1];
    thisArg.fn = fToBind;
    var result = thisArg.fn(...args);
    delete thisArg.fn;
    return result;
}