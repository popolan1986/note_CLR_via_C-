function debounce(func, wait) {
    let timeout;
    return function() {
        let context = this;
        let args = arguments;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

function throttle(funcToCall, delay) {
    var prevtime = Date.now();
    return function() {
        var curtime = Date.now();
        if (curtime - prevtime > delay) {
            funcToCall.apply(this, arguments);
            prevtime = curtime;
        }
    }
}