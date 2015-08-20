var React = require('react');
var classNames = require('classnames');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var TodoTextInput = require('./TodoTextInput');
var TodoItem = React.createClass({

  getInitialState: function() {
    return {
      isEditing: false
    };
  },

  render: function() {
    var todo = this.props.todo;

    var input;
    if (this.state.isEditing) {
      input =
        <TodoTextInput
          className="edit"
          onSave={this._onSave}
          value={todo.text}
        />;
    }

    return (
      <li
        className={classNames({
          'completed': todo.complete,
          'editing': this.state.isEditing
        })}
        key={todo.id}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.complete}
            onChange={this._onToggleComplete}
          />
          <label onDoubleClick={this._onDoubleClick}>
            {todo.text}
          </label>
          <button className="destroy" onClick={this._onDestroyClick} />
        </div>
        {input}
      </li>
    );
  },

  _onDoubleClick: function() {
    this.setState({isEditing: true});
  },

  _onToggleComplete: function() {
    var id = this.props.todo.id;
    var actionType = this.props.todo.complete ?
        'TODO_UNDO_COMPLETE' :
        'TODO_COMPLETE';
    AppDispatcher.dispatch({
      actionType: actionType,
      id: id
    });
  },

  _onSave: function(text) {
    AppDispatcher.dispatch({
      actionType: 'TODO_UPDATE_TEXT',
      id: this.props.todo.id,
      text: text
    });
    this.setState({isEditing: false});
  },

  _onDestroyClick: function() {
    AppDispatcher.dispatch({
      actionType: 'TODO_DESTROY',
      id: this.props.todo.id
    });
  }

});

module.exports = TodoItem;
