# semaphore

Semaphore for TypeScript/JavaScript.

[![npmjs](https://img.shields.io/npm/v/%40jackylamhk%2Fsemaphore)](https://npmjs.org/package/@jackylamhk/semaphore)
[![Language: TypeScript](https://shields.io/badge/language-TypeScript-3178C6?logo=TypeScript&logoColor=FFF)](https://www.typescriptlang.org)
[![Prettier](https://img.shields.io/badge/formatting-prettier-1A2C34?logo=prettier)](https://www.typescriptlang.org)
[![eslint](https://img.shields.io/badge/linting-eslint-3A33D1?logo=eslint&logoColor=white)](https://www.typescriptlang.org)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

A Semaphore implementation clone of Python's `asyncio.Semaphore`.

> A semaphore manages an internal counter which is decremented by each acquire() call and incremented by each release() call. The counter can never go below zero; when acquire() finds that it is zero, it blocks, waiting until some other thread calls release().

As JavaScript does not support context managers, you will need to wrap your function with the `run()` method.

```js
const semaphore = new Semaphore(10);
async function myFunction() {
  // some async operation
  return 'Done';
}
const result = await semaphore.run(() => myFunction());
console.log(result); // prints "Done"
```
