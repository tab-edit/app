export default class CancelablePromise<T> {
    _cancelable;
    _promise:Promise<T>;
    _canceled = false;

    static from<T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
      return new CancelablePromise(new Promise(executor));
    }

    constructor(promise:Promise<T>) {
      this._promise = promise;
      this._cancelable = makeCancelable(this._promise);
    }

    cancel() {
        this._cancelable.cancel();
        this._canceled = true;
    }

    wasCanceled() {
      return this._canceled;
    }

    then(onfulfilled?:(value: T) => T | PromiseLike<T> | null | undefined, onrejected?:(value: T) => T | PromiseLike<T> | null | undefined) {
      return this._promise.then(onfulfilled, onrejected);
    }
}


//taken from https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html

const makeCancelable = (promise:Promise<any>) => {
    let hasCanceled_ = false;
  
    const wrappedPromise = new Promise((resolve, reject) => {
      promise.then((val) =>
        hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
      );
      promise.catch((error) =>
        hasCanceled_ ? reject({isCanceled: true}) : reject(error)
      );
    });
  
    return {
      promise: wrappedPromise,
      cancel() {
        hasCanceled_ = true;
      },
    };
}