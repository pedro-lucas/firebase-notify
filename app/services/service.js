const EventEmitter = require('events');

module.exports = class Service extends EventEmitter {
  constructor() {
    super();
  }
}
