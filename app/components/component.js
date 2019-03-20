const EventEmitter = require('events');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');
const $ = require("jquery");

module.exports = class Component extends EventEmitter {

  constructor(obj, args) {
    super();
    if (!this.view) this.view = this._toView(obj, args);
    this.superComponent = null;
  }

  addComponent(component, prepend = false) {
    if (this.components.indexOf(component) !== -1) {
      component.detach();
      if (prepend)
        this.view.prepend(component.view);
      else
        this.view.append(component.view);

    } else {
      if (prepend)
        this.view.prepend(component.view);
      else
        this.view.append(component.view);
      this._append(component);
    }
  }

  addComponentBefore(component, componentBefore) {
    if (this.components.indexOf(componentBefore) === -1) return;
    if (this.components.indexOf(component) !== -1) {
      component.detach();
      component.view.insertBefore(componentBefore.view);
    } else {
      component.view.insertBefore(componentBefore.view);
      this._append(component);
    }
  }

  addComponentAfter(component, componentAfter) {
    if (this.components.indexOf(componentAfter) === -1) return;
    if (this.components.indexOf(component) !== -1) {
      component.detach();
      component.view.insertAfter(componentAfter.view);
    } else {
      component.view.insertAfter(componentAfter.view);
      this._append(component);
    }
  }

  removeComponent(component) {
    let index = this.components.indexOf(component);
    if (index !== -1) {
      this.components.splice(index, 1);
      component.superComponent = null;
      component.view.remove();
      return true;
    }
    return false;
  }

  remove() {
    let result = true;
    if (this.superComponent) {
      result = this.superComponent.removeComponent(this);
    } else {
      this.view.remove();
    }
    if (result) this.onDetach();
    return result;
  }

  render(template, args) {
    let content = fs.readFileSync(path.resolve(__dirname, '../views', template + (template.endsWith('.tpl') ? '' : '.tpl')));
    return $('<div class="component">' + _.template(content.toString())(args) + '</div>');
  }

  _append(component) {
    this.components.push(component);
    component.superComponent = this;
    component.onAttach();
  }

  _toView(template, args) {
    if (typeof template === 'string') {
      return this.render(template, args);
    } else if (this.templateObject) {
      return this.render(this.templateObject.name, this.templateObject.args);
    } else {
      return template;
    }
  }

  onAttach() {}

  onDetach() {}

  get components() {
    if (!this._components) {
      this._components = [];
    }
    return this._components;
  }

  set superComponent(val) {
    this._superComponent = val;
  }

  get superComponent() {
    return this._superComponent;
  }

}