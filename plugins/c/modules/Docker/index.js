import Core from '../Core'
import Logger from '../Logger'
import _ from 'lodash'
export default class Docker {
  constructor(
    readDefaults = false,
    options = { items: [], hide: [], show: [] }
  ) {
    this.Defaults = readDefaults ? Core.App.Defaults.Docker.Items : {}
    this.Items = readDefaults ? { ..._.cloneDeep(this.Defaults) } : {}
    // Init Items
    if (options && options.items) {
      this.AddItems(options.items)
    }
    // Set Items States
    if (options && options.show) {
      this.Show(options.show)
    }
    if (options && options.hide) {
      this.Hide(options.items)
    }
    this.Logger = new Logger('COC Docker')
  }

  AddItem(
    id = 'item',
    icon = 'ivu-icon ivu-icon-ios-alert',
    callback,
    label = 'Label'
  ) {
    this.Items[id] = { icon, callback, label }
  }

  AddItemByObject(item) {
    if (!item.id || !item.icon || !item.callback || !item.label) {
      this.Logger.Warn({
        message: 'Invalid Docker Item',
        log: 'an item must have id, icon, callback, and label properties'
      })
      return
    }
    this.AddItem(item.id, item.icon, item.callback, item.label)
  }

  AddItems(items) {
    let i
    for (i = 0; i < items.length; i += 1) {
      this.AddItemByObject(items[i])
    }
  }

  Hide(...ids) {
    let i
    for (i = 0; i < ids.length; i += 1) {
      if (this.Items[ids[i]]) {
        this.Items[ids[i]].hidden = true
      }
    }
  }

  Show(...ids) {
    let i
    for (i = 0; i < ids.length; i += 1) {
      if (this.Items[ids[i]]) {
        this.Items[ids[i]].hidden = false
      }
    }
  }
}
