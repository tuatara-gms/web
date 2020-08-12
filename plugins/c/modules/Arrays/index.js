import COC from '../Core'
import Logger from '../Logger'
export default class Arrays {
  constructor(arr, options = {}) {
    const defaults = { logger: 'COC Arrays' }
    const optionsCompined = { ...defaults, ...options }
    this.Logger = new Logger(optionsCompined.logger)
    if (!arr || !Array.isArray(arr)) {
      this.Logger.Warn({
        message: 'You must initialize the class with an array.',
        log: `Hint: ${arr} from the type ${typeof val} was passed.`
      })
      return
    }
    this.val = arr && arr !== null ? arr : []
  }

  // Getters
  get get() {
    return this.val
  }
  get Sorted() {
    return new Arrays(
      this.Length > 50 ? this.QuickSort(this.val) : this.SelectionSort(this.val)
    )
  }

  get Length() {
    return this.val.length
  }

  get Last() {
    return this.Length > 0 ? this.val[this.Length - 1] : undefined
  }
  // Voids

  Split(chunks = 2) {
    const t = this.val
    let i
    const temp = []
    let rem
    let pumb
    rem = this.Length
        const round = Math.max(1, parseInt(rem / chunks)); // eslint-disable-line
    for (i = 0; i < chunks; i += 1) {
      pumb = Math.min(round, rem)
      if (pumb > 0) {
        temp[i] = t.splice(0, i === chunks - 1 ? rem : pumb)
        rem -= round
      } else {
        temp[i] = []
      }
    }
    this.val = temp
  }

  Merge(array = [1, 2, 3]) {
    this.val = this.val.concat(array)
    return this
  }

  Desc() {
    this.val = this.Sort.get.reverse()
    return this
  }

  Clear() {
    this.val = []
    return this
  }

  Push(...args) {
    this.val.push(args[0])
    return this
  }

  // Methods
  GetIndex(val) {
    return COC.GetIndex(this.get, val)
  }

  Search(...args) {
    return COC.BinarySearch(this.Sorted.get, args[0])
  }

  IsMatching(array, all = false) {
    if (all) return this.IsFullyMatched(array)
    if (!this.Length || !array.length) {
      return false
    }
    let i
    for (i = 0; i < array.length; i += 1) {
      if (this.Includes(array[i])) {
        return true
      }
    }
    return false
  }

  IsFullyMatched(array) {
    if (!this.Length || !array.length) {
      return false
    }
    let i
    for (i = 0; i < array.length; i += 1) {
      if (!this.Includes(array[i])) {
        return false
      }
    }
    for (i = 0; i < this.val.length; i += 1) {
      if (array.indexOf(this.val[i]) === -1) {
        return false
      }
    }
    return true
  }

  FindAll(...args) {
    const result = []
    let i
    for (i = 0; i < this.Length; i += 1) {
      if (this.val[i] === args[0]) result.push(i)
    }
    return new COC.Arrays(result)
  }

  Includes(...args) {
    return COC.ArrayIncludes(this.val, args[0])
  }

  Pluck(...args) {
    if (!this.val) {
      return new Arrays([])
    }
    return new Arrays(COC.FilterArrayOfObjects(this.val, args[0]))
  }

  Reverse() {
    const temp = []
    const l = this.Length
    let i
    for (i = 0; i < l; i += 1) temp[i] = this.val[l - i - 1]
    this.val = temp
    return this
  }

  // SORT

  Sort() {
    this.val =
      this.Length > 50 ? this.QuickSort(this.val) : this.SelectionSort(this.val)
    return this
  }

  SelectionSort(arr = this.val) {
    let minIdx
    let temp
    const len = arr.length
    for (let i = 0; i < len; i += 1) {
      minIdx = i
      for (let j = i + 1; j < len; j += 1) {
        if (arr[j] < arr[minIdx]) {
          minIdx = j
        }
      }
      temp = arr[i]
      arr[i] = arr[minIdx]
      arr[minIdx] = temp
    }
    return arr
  }

  QuickSort(arr = this.val) {
    return this.QuickSortRec(arr, 0, this.Length - 1)
  }

  QuickSortRec(arr, left, right) {
    let pivot
    let partitionIndex
    if (left < right) {
      pivot = right
      partitionIndex = COC.Partition(arr, pivot, left, right)
      this.QuickSortRec(arr, left, partitionIndex - 1)
      this.QuickSortRec(arr, partitionIndex + 1, right)
    }
    return arr
  }

  Partition(arr, pivot, left, right) {
    const pivotValue = arr[pivot]
    let partitionIndex = left
    for (let i = left; i < right; i += 1) {
      if (arr[i] < pivotValue) {
        this.Swap(arr, i, partitionIndex)
        partitionIndex += 1
      }
    }
    this.Swap(arr, right, partitionIndex)
    return partitionIndex
  }
  SwapIndex(i, j) {
    const temp = this.val[i]
    this.val[i] = this.val[j]
    this.val[j] = temp
    return this
  }
  Swap(arrs, i, j) {
    const arr = arrs
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
    return arr
  }
}
