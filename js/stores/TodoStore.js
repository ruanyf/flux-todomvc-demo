var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var _todos = {};

var TodoStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _todos;
  },

  create: function(text){
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    _todos[id] = {
      id: id,
      complete: false,
      text: text
    };
  },

  destroy: function (id) {
    delete _todos[id];
  },

  destroyCompleted: function() {
    for (var id in _todos) {
      if (_todos[id].complete) {
        this.destroy(id);
      }
    }
  },

  update: function (id, updates) {
    _todos[id] = assign({}, _todos[id], updates);
  }
});

module.exports = TodoStore;
