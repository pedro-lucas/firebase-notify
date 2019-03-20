const Component = require('./component');

module.exports = class ComponentView extends Component {

  constructor(template, args) {
    super(template, args);
    this._load();
  }

  _load() {
    if(this.cssClass) {
      this.view.addClass(this.cssClass);
    }
    if(typeof this.ui === 'object') {
      Object.keys(this.ui).forEach(key => {
        this[key] = this.view.find(this.ui[key]);
      })
    }
  }

}
