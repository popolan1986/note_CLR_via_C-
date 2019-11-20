/* Promise实现
原理：发布订阅者模式
1. 构造函数接受一个executor函数，并在new Promise时立即执行该函数
2. then时收集依赖，将回调函数收集到成功/失败队列里
3. executor函数中调用resolve/reject函数
4. resolve/reject函数被调用时会通知触发队列中的回调
*/
const isFunction = variable => typeof variable === 'function';

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        try {
            executor(this._resolve, this._resolve);
        } catch(e) {
            this._resolve(e);
        }
    }

    _status = PENDING;
    _value = undefined;
    _rejectedQueue = [];
    _fulfilledQueue = [];

    _resolve = (val) => {
        const run = () => {
            if (this._status !== PENDING) {
                return;
            }

            this._status = FULFILLED;
            const runFulfilled = value => {
                let cb;
                while ((cb = this._fulfilledQueue.shift())) {
                    cb(value);
                }
            };
            const runRejected = error => {
                let cb;
                while ((cb = this._rejectedQueue.shift())) {
                    cb(error);
                }
            };
            /*
            * 如果resolve的参数为Promise对象，
            * 则必须等待该Promise对象状态改变后当前Promsie的状态才会改变
            * 且状态取决于参数Promsie对象的状态
            */
            if (val instanceof MyPromise) {
                val.then(
                    value => {
                        this._value = value;
                        runFulfilled(value);
                    },
                    err => {
                        this._value = err;
                        runRejected(err);
                    }
                );
            } else {
                this._value = val;
                runFulfilled(val);
            }
        };

        setTimeout(run);
    };

    _reject = (err) => {
        if (this._status !== PENDING) {
            return;
        }
        const run = () => {
            this._status = REJECTED;
            this._value = err;
            let cb;
            while ((cb = this._rejectedQueue.shift())) {
                cb(err);
            }
        };
        setTimeout(run);
    };

    then(onFulfilled, onRejected) {
        const {_value, _status} = this;
        return new MyPromise((onFulfilledNext, onRejectedNext) => {
            const fulfilled = value => {
                try {
                    if (!isFunction(onFulfilled)) {
                        onFulfilledNext(value);
                    } else {
                        const result = onFulfilled(value);
                        if (result instanceof MyPromise) {
                            result.then(onFulfilledNext, onRejectedNext);
                        } else {
                            onFulfilledNext(result);
                        }
                    }
                } catch(err) {
                    onRejectedNext(err);
                }
            };

            const rejected = error => {
                try {
                    if (!isFunction(onRejected)) {
                      onRejectedNext(error);
                    } else {
                      const res = onRejected(error);
                      if (res instanceof MyPromise) {
                        // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                        res.then(onFulfilledNext, onRejectedNext);
                      } else {
                        //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                        onFulfilledNext(res);
                      }
                    }
                  } catch (err) {
                    // 如果函数执行出错，新的Promise对象的状态为失败
                    onRejectedNext(err);
                  }
            };

            switch(_status) {
                case PENDING:
                    this._fulfilledQueue.push(fulfilled);
                    this._rejectedQueue.push(rejected);
                    break;
                case FULFILLED:
                    fulfilled(_value);
                    break;
                case REJECTED:
                    rejected(_value);
                    break;        
            }
        });
    }

    catch(onRejected) {
        return this.then(undefined, onRejected);
    }

    finally(cb) {
        // always invoke cb
        return this.then(
            value => MyPromise.resolve(cb()).then(() => value),
            reason =>
              MyPromise.resolve(cb()).then(() => {
                throw reason;
              })
          );
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise(resolve => resolve(value));
    }

    static reject(reason) {
        return new MyPromise((resolve, reject) => reject(reason));
    }

    static all(list) {
        return new MyPromise((resolve, reject) => {
            let values = [];
            let count = 0;
            for (let [i, p] of list.entries()) {
                // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
            this.resolve(p).then(
                res => {
                values[i] = res;
                count++;
                // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
                if (count === list.length) resolve(values);
                },
                err => {
                // 有一个被rejected时返回的MyPromise状态就变成rejected
                reject(err);
                }
            );
            }
        });
    }

    static race(list) {
        
    }
}