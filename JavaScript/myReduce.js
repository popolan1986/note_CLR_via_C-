Array.prototype.myreduce = function reduce(callback) {
    if (typeof callback !== 'function') {
        throw new TypeError('callback is not callable');
    }
    // get the array instance
    const arrayObj = this,
    length = arrayObj.length;

    let index = 0,
    accumulator = undefined,
    valueExisting = false,
    initialValue = arguments.length > 1 ? arguments[1] : undefined;

    if (length === 0 && arguments.length < 2) {
        throw new TypeError('');
    }

    if (arguments.length > 1) {
        accumulator = initialValue;
        // 当有initiaValue时，index从0开始
    } else {
        // 没有initialValue, accumulator为数组的第一个值，currentValue为index 1
        accumulator = arrayObj[index++];
    }

    // 开始迭代
    while (index < length) {
        valueExisting = arrayObj.hasOwnProperty(index);
        if (valueExisting) {
            accumulator = callback.apply(undefined, [accumulator, arrayObj[index], index, arrayObj]);
        }
        index += 1;
    }
    return accumulator;
}