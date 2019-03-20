require("../locale");

const ComponentView = require('../components/component-view');

module.exports = class Controller extends ComponentView {
  constructor(container, args) {
    super(container, args);
  }
}
