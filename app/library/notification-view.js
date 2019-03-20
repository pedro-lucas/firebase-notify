const $ = require('jquery');
let notifications = [];

module.exports = class NotificationView {

  constructor(options) {
    let defaults = {
      type: 1,
      message: 'Title default',
      detail: null,
      dismissable: false,
      dismissTimeout: 2000,
      customView: null,
      container: window.document.body,
      onDidDismiss: () => {},
      onDidDisplay: () => {}
    };
    let opt = $.extend(defaults, options);
    this.type = opt.type;
    this.message = opt.message;
    this.detail = opt.detail;
    this.customView = opt.customView;
    this.dismissable = opt.dismissable;
    this.dismissTimeout = opt.dismissTimeout;
    this.container =  opt.container;
    this.onDidDismiss = opt.onDidDismiss;
    this.onDidDisplay = opt.onDidDisplay;
    this.show();
  }

  show() {

    this.notificationsView = $('notifications');

    if(!this.notificationsView.length) {
      $(this.container).append('<notifications></notifications>');
      this.notificationsView = $('notifications');
    }

    let that = this;
    let $view = $('<notification></notification>');
    let $content = $('<div class="content"></div>');
    let $contentMessage = $('<div class="item content-message"></div>');
    let $contentDetail = $('<div class="item content-detail"></div>');
    let $customView = $('<div class="item content-custom"></div>');
    let $btnClose = $('<div class="btn-close octicon octicon-x"></div>');
    let $btnCloseAll = $('<div class="btn-close-all">Close All</div>');
    let resetScroll = null;

    $content.append($contentMessage);

    if(this.detail && this.detail.length) {
      $content.append($contentDetail);
    }

    if(this.customView instanceof Object) {
      if(this.customView.position == 'top') {
        $customView.addClass('custom-view-position-top');
        $content.prepend($customView);
      }else if(this.customView.position == 'middle') {
        $customView.addClass('custom-view-position-middle');
        $contentMessage.after($customView);
      }else{
        $customView.addClass('custom-view-position-bottom');
        $content.append($customView);
      }
      $customView.append(this.customView.content);
    }

    $view.addClass(this._typeClass());
    $view.append($content);
    $view.append($btnClose);
    $view.append($btnCloseAll);

    this.notificationsView.animate({scrollTop: this.notificationsView.prop('scrollHeight')}, "fast");
    this.notificationsView.append($view);

    $contentMessage.html(this.message);

    if(this.detail && this.detail.length) {
      $contentDetail.html(this.detail);
      $view.addClass('has-detail');
    }

    if(this.dismissable) {
      $view.addClass('has-close');
    }else{
      this.timeOut = setTimeout(this.dismiss.bind(this), this.dismissTimeout);
    }

    $btnClose.on('click', this.dismiss.bind(this));
    $btnCloseAll.on('click', this.dismissAll.bind(this));

    this.view = $view;
    this.content = $content;
    this.contentMessage = $contentMessage;
    this.contentDetail = $contentDetail;
    this.btnClose = $btnClose;
    this.btnCloseAll = $btnCloseAll;

    this.scrollAction = () => {
      clearTimeout(resetScroll);
      let className = 'enable-pointer-events';
      if(!that.notificationsView.hasClass(className)) {
        that.notificationsView.addClass(className)
      }
      resetScroll = setTimeout(() => {
        that.notificationsView.remove(className);
      }, 500);
    };

    this.view.on('mousewheel', this.scrollAction);

    notifications.push(this);

  }

  dismiss() {
    let index = notifications.indexOf(this);
    if(index > -1) {
      notifications.splice(index, 1);
      this._close();
    }
  }

  _close() {
    this.view.addClass('remove');
    this.view.off('mousewheel', this.scrollAction);
    clearTimeout(this.timeOut);
    setTimeout(() => {
      this.view.remove();
    }, 1000);
  }

  dismissAll() {
    notifications.forEach(notification => {
      notification._close();
    });
    notifications = [];
  }

  _typeClass() {
    switch (this.type) {
      case NotificationView.TYPE_SUCCESS:
        return 'notify-success';
        break;
      case NotificationView.TYPE_INFO:
        return 'notify-info';
        break;
      case NotificationView.TYPE_WARNING:
        return 'notify-warning';
        break;
      default: //Error
      return 'notify-error';
    }
  }

  static error(error, options) {
    const defaults = {
      type: NotificationView.TYPE_ERROR,
      message: error,
      detail: null,
      dismissable: true
    };
    if(error instanceof Error) {
      defaults.message = error.toString();
      defaults.detail = error.stack.toString();
    }
    return new NotificationView($.extend(defaults, options));
  }

  static info(message, options) {
    const defaults = {
      type: NotificationView.TYPE_INFO,
      message: message
    };
    return new NotificationView($.extend(defaults, options));
  }

  static success(message, options) {
    let defaults = {
      type: NotificationView.TYPE_SUCCESS,
      message: message
    };
    return new NotificationView($.extend(defaults, options));
  }

  static warning(message, options) {
    const defaults = {
      type: NotificationView.TYPE_WARNING,
      message: message
    };
    return new NotificationView($.extend(defaults, options));
  }

  static retry(error, message, options) {
    const svg = '<button class="btn-retry"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M19,12H22.32L17.37,16.95L12.42,12H16.97C17,10.46 16.42,8.93 15.24,7.75C12.9,5.41 9.1,5.41 6.76,7.75C4.42,10.09 4.42,13.9 6.76,16.24C8.6,18.08 11.36,18.47 13.58,17.41L15.05,18.88C12,20.69 8,20.29 5.34,17.65C2.22,14.53 2.23,9.47 5.35,6.35C8.5,3.22 13.53,3.21 16.66,6.34C18.22,7.9 19,9.95 19,12Z"/></svg></button>';
    const content = $('<div class="content-retry-message">'+message+svg+'</div>');
    const defaults = {
      type: NotificationView.TYPE_ERROR,
      message: error,
      detail: null,
      customView: {
          content
      },
      onRetry() { },
      dismissable: true
    };
    const opt = $.extend(defaults, options);
    content.on('click', opt.onRetry);
    if(error instanceof Error) {
      defaults.message = error.toString();
      defaults.detail = error.stack.toString();
    }
    return new NotificationView(opt);
  }

  static get TYPE_SUCCESS() {
      return 1;
  }

  static get TYPE_INFO() {
    return 2;
  }

  static get TYPE_WARNING() {
    return 3;
  }

  static get TYPE_ERROR() {
    return 4;
  }

}
