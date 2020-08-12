import COC from '../Core'
export default function (array) {
  array.__proto__.split = function(chunks = 2) {
    const t = array
    let i
    const temp = []
    let rem
    let pumb
    rem = array.length
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
    array = temp
  }

  array.__proto__.merge = function(array = [1, 2, 3]) {
    array = array.concat(array)
    return array
  }

  array.__proto__.desc = function() {
    array = array.Sort.get.reverse()
    return array
  }

  array.__proto__.clear = function() {
    array = []
    return array
  }

  // Methods
  array.__proto__.getIndex = function(val) {
    return COC.getIndex(array.get, val)
  }

  array.__proto__.search = function(...args) {
    return COC.binarySearch(array.Sorted.get, args[0])
  }

  array.__proto__.isMatching = function(array) {
    if (!array.length || !array.length) {
      return false
    }
    let i
    for (i = 0; i < array.length; i += 1) {
      if (array.includes(array[i])) {
        return true
      }
    }
    return false
  }

  array.__proto__.findAll = function (...args) {
    const result = []
    let i
    for (i = 0; i < array.length; i += 1) {
      if (array[i] === args[0]) result.push(i)
    }
    return new COC.Arrays(result)
  }

  array.__proto__.includes = function(...args) {
    return COC.ArrayIncludes(array, args[0])
  }

  array.__proto__.pluck(...args) {
    if (!array) {
      return new Arrays([])
    }
    return COC.FilterArrayOfObjects(array, args[0])
  }

  array.__proto__.reverse = function() {
    const temp = []
    const l = array.length
    let i
    for (i = 0; i < l; i += 1) temp[i] = array[l - i - 1]
    array = temp
    return array
  }

  // SORT

  array.__proto__.Sort() {
    array =
      array.length > 50 ? array.quickSort(array) : array.selectionSort(array)
    return array
  }

  array.__proto__.selectionSort= function(arr = array) {
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

  array.__proto__.quickSort = function(arr = array) {
    return array.quickSortRec(arr, 0, array.length - 1)
  }

  array.__proto__.quickSortRec = function(arr, left, right) {
    let pivot
    let partitionIndex
    if (left < right) {
      pivot = right
      partitionIndex = COC.Partition(arr, pivot, left, right)
      array.quickSortRec(arr, left, partitionIndex - 1)
      array.quickSortRec(arr, partitionIndex + 1, right)
    }
    return arr
  }

  array.__proto__.partition = function(arr, pivot, left, right) {
    const pivotValue = arr[pivot]
    let partitionIndex = left
    for (let i = left; i < right; i += 1) {
      if (arr[i] < pivotValue) {
        array.Swap(arr, i, partitionIndex)
        partitionIndex += 1
      }
    }
    array.Swap(arr, right, partitionIndex)
    return partitionIndex
  }
  array.__proto__.swapIndex = function(i, j) {
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
    return array
  }
  array.__proto__.swap = function(arrs, i, j) {
    const arr = arrs
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
    return arr
  }


  return array
}
