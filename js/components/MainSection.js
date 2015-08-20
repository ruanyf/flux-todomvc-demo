var React = require('react');
var TodoItem = require('./TodoItem');

var MainSection = React.createClass({

  render: function() {
    if (Object.keys(this.props.data).length < 1) {
      return null;
    }

    var allTodos = this.props.data;
    var todos = [];
    for (var key in allTodos) {
      todos.push(<TodoItem key={key} todo={allTodos[key]} />);
    }
    return (
      <section id="main">
        <input
          id="toggle-all"
          type="checkbox"
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">{todos}</ul>
      </section>
    );
  },
});

module.exports = MainSection;
