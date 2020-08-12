export default class {
  constructor(option = 'option', config = { fallbackIcon: '' }) {
    this.option = option
    this.config = config
  }
  Resolve(feed = this.option) {
    if (feed == null) {
      return {
        value: null,
        group: false,
        options: null,
        label: '',
        icon: this.fallbackIcon,
        avatar: null,
        avatarOptions: null,
        comment: null,
        groupLabel: null,
        inGroup: false,
        isFirstInGroup: false,
        isLastInGroup: false
      }
    }
    if (typeof feed == 'object') {
      return {
        group: feed.group !== undefined ? feed.group : false,
        options: feed.group !== undefined && feed.group ? feed.options : false,
        groupLabel: feed.groupLabel,
        inGroup: feed.inGroup,
        isFirstInGroup: feed.isFirstInGroup,
        isLastInGroup: feed.isLastInGroup,
        value:
          feed.value !== undefined ? feed.value : feed[Object.keys(feed)[0]],
        label:
          feed.label !== undefined ? feed.label : feed[Object.keys(feed)[0]],
        icon:
          feed.icon !== undefined && !feed.avatar
            ? feed.icon
            : this.fallbackIcon,
        avatar: feed.avatar !== undefined ? feed.avatar : null,
        avatarOptions:
          feed.avatarOptions !== undefined && feed.avatar
            ? feed.avatarOptions
            : { scale: '20px', childClasses: ['col house-keeper'] },
        comment: feed.comment !== undefined ? feed.comment : null
      }
    } else
      return {
        value: feed,
        label: feed,
        group: false,
        options: null,
        icon: this.fallbackIcon,
        avatar: null,
        avatarOptions: null,
        comment: null,
        groupLabel: null,
        inGroup: false,
        isFirstInGroup: false,
        isLastInGroup: false
      }
  }
}
