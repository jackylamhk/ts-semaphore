/**
 * A Semaphore implementation clone of Python's `asyncio.Semaphore`.
 *
 * A semaphore manages an internal counter which is decremented by each
 * acquire() call and incremented by each release() call. The counter
 * can never go below zero; when acquire() finds that it is zero, it blocks,
 * waiting until some other thread calls release().
 *
 * As JavaScript does not support context managers, you will need to wrap
 * your function with the `run()` method.
 *
 * ```js
 * const semaphore = new Semaphore(10)
 * async function myFunction() {
 *    // some async operation
 *    return "Done"
 *  }
 *  const result = await semaphore.run(() => myFunction())
 *  console.log(result) // prints "Done"
 *  ```
 */
export class Semaphore {
  private _value: number;
  private readonly _waiters: Array<(value?: unknown) => void>;

  constructor(value: number) {
    if (value < 0) {
      throw new Error('Semaphore initial value must be >= 0');
    }
    this._value = value;
    this._waiters = [];
  }

  /**
   * Returns `true` if semaphore cannot be acquired immediately.
   */
  locked() {
    return this._value === 0 || this._waiters.length > 0;
  }

  /**
   * Acquire a semaphore.
   *
   * If the internal counter is larger than zero on entry,
   * decrement it by one and return True immediately.  If it is
   * zero on entry, block, waiting until some other task has
   * called release() to make it larger than 0.
   */
  async acquire() {
    if (!this.locked()) {
      this._value -= 1;
      return;
    }
    await new Promise(resolve => {
      this._waiters.push(resolve);
    });
  }

  /**
   * Release a semaphore, incrementing the internal counter by one.
   *
   * When it was zero on entry and another task is waiting for it to
   * become larger than zero again, wake up that task.
   */
  release() {
    this._value += 1;
    this._wakeUpNext();
  }

  /**
   * Run a task with the semaphore.
   */
  async run<T>(task: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await task();
    } finally {
      this.release();
    }
  }

  /**
   * Wake up the first waiter that isn't done.
   */
  private _wakeUpNext() {
    const next = this._waiters.shift();
    if (!next) {
      return;
    }
    this._value -= 1;
    next();
  }
}
