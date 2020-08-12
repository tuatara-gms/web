import Queue from './queue.js'
export default class CircularQueue extends Queue {
  constructor(queue) {
    super(queue)
    this.cursor = 0
    this.shifts = 0
  }

  get cursorElement() {
    return this.val[this.cursor]
  }

  get nextIndex() {
    return this.getCursorAfter(1)
  }

  get previousIndex() {
    return this.getCursorAfter(-1)
  }

  get rounds() {
    return this.getRoundsAfter(this.shifts, 0)
  }

  next() {
    this.shifts += 1
    this.cursor = this.nextIndex
  }

  back() {
    this.shifts -= 1
    this.cursor = this.previousIndex
  }

  move(shifts = 2) {
    if (!shifts || typeof shifts !== 'number') {
      return
    }
    this.shifts += shifts
    this.cursor = this.getCursorAfter(parseInt(shifts, 10))
  }

  getCursorAfter(moves = 12, cursor = this.cursor) {
    const forwardCursor = parseInt((moves + cursor) % this.Length, 10)
    return moves >= 0 || forwardCursor >= 0
      ? forwardCursor
      : forwardCursor + this.Length
  }

  getRoundsAfter(turns = 12, cursor = this.cursor) {
    return Math.abs(parseInt((turns + cursor) / this.Length, 10))
  }
  setCursor(index = 0, reset = false) {
    if (
      !index ||
      !typeof index === 'number' ||
      index < 0 ||
      index >= this.Length
    ) {
      return
    }
    if (reset) {
      this.resetCircularQueue()
    }
    this.move(index - this.cursor)
  }
  resetCircularQueue() {
    this.cursor = 0
    this.shifts = 0
  }
}
