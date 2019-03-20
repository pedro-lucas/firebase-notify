const $ = require('jquery');
const ComponentView = require('./component-view');
const i18n = require("i18n");

module.exports = class ToolbarView extends ComponentView {

  constructor() {
    super();
  }

  get cssClass() {
    return 'toolbar-view';
  }

  get ui() {
    return {
      'btnSend': '.send',
      'btnClean': '.clean'
    };
  }

  get templateObject() {
    return {
      name: 'toolbar',
      args: {
        sendButton: i18n.__('Send'),
        cleanButton: i18n.__('Clean config')
      }
    }
  }

}
