import Arrays from './index.js'
export default class Queue extends Arrays {
  constructor(array) {
    super(array)
  }

  get empty() {
    return this.Length ? false : true
  }

  get front() {
    return this.val[0]
  }

  get rear() {
    return this.Last
  }

  get size() {
    return this.Length
  }

  // Methods

  enqueue(val = 'foo') {
    this.val.push(val)
  }

  dequeue() {
    this.val.splice(0, 1)
  }
}
