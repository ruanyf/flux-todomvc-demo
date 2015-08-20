TodoMVC is [Flux](https://github.com/facebook/flux)'s [official example](https://github.com/facebook/flux/tree/master/examples/flux-todomvc), but still complicated for the beginners. This repo is its simplified version.

![](screenshot.png)

## How to Use

```bash
$ git clone git@github.com:ruanyf/flux-todomvc-demo.git
$ cd flux-todomvc-demo && npm install
$ npm start
```

Visit http://127.0.0.1:8080 with your browser.

If you want to get a static build, please run `npm run build`.

```javascript
$ npm run build
```

Now open `index.html` in your browser.

## Learn Flux

[Flux for stupid people](https://github.com/ruanyf/flux-for-stupid-people-demo) and its [demo](https://github.com/ruanyf/flux-for-stupid-people-demo) is a great start guide.

## TodoMVC: Step By Step

Now, we want to build a [TodoMVC](http://todomvc.com/). How to do it?

### Step 1: HTML Scaffold

`index.html` is used to load `bundle.js`.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Flux • TodoMVC</title>
    <link rel="stylesheet" href="todomvc-common/base.css">
    <link rel="stylesheet" href="css/app.css">
  </head>
  <body>
    <section id="todoapp"></section>
    <footer id="info">
      <p>Double-click to edit a todo</p>
    </footer>
    <script src="js/bundle.js"></script>
  </body>
</html>
```

Our TodoMVC lives in the #todoapp section.

### Step 2: App.js

`App.js` is the entry file.

```javascript
// js/app.js
var React = require('react');
var TodoApp = require('./components/TodoApp');

React.render(
  <TodoApp />,
  document.getElementById('todoapp')
);
```

You could find `TodoApp` is our top-level component.

### Step 3: TodoApp

```javascript
// js/components/TodoApp.js
var React = require('react');

var Footer = require('./Footer');
var Header = require('./Header');
var MainSection = require('./MainSection');

var TodoApp = React.createClass({

  render: function() {
    return (
      <div>
        <Header />
        <MainSection data={this.state} />
        <Footer data={this.state} />
      </div>
    );
  },

});

module.exports = TodoApp;
```

You could find TodoApp is composed of 3 components of `Header`, `MainSection` and `Footer`.

## Step 4: Header

```javascript
var React = require('react');
var TodoTextInput = require('./TodoTextInput');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var Header = React.createClass({

  render: function() {
    return (
      <header id="header">
        <h1>todos</h1>
        <TodoTextInput
          id="new-todo"
          placeholder="What needs to be done?"
          onSave={this._onSave}
        />
      </header>
    );
  },

  _onSave: function(text) {
    if (text.trim()){
      AppDispatcher.dispatch({
        actionType: 'TODO_CREATE',
        text: text
      });
    }
  }

});

module.exports = Header;
```

The main part of `Header` is `TodoTextInput` used to input new Todo items.

### Step 5: MainSection

`MainSection` shows a lot of `TodoItem`s.

```javascript
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
```

### Step 6: Footer

```javascript
var React = require('react');

var Footer = React.createClass({

  render: function() {

    return (
      <footer id="footer">
        <span id="todo-count">
          <strong>
            {itemsLeft}
          </strong>
          {itemsLeftPhrase}
        </span>
        {clearCompletedButton}
      </footer>
    );
  },

});

module.exports = Footer;
```

### Step 7: Initial State

When TodoApp first loaded, its state is all existing TodoItems.

```javascript
// js/component/TodoApp.js

getInitialState: function() {
  return TodoStore.getAll();
},

render: function() {
  return (
    <div>
      <Header />
      <MainSection data={this.state} />
      <Footer data={this.state} />
    </div>
  );
},
```

### Step 8: When user inputs something

User inputs a Todo item into `TodoTextInput`.

```javascript
// js/components/TodoTextInput.js
var React = require('react');

var ENTER_KEY_CODE = 13;

var TodoTextInput = React.createClass({

  getInitialState: function() {
    return {
      value: this.props.value || ''
    };
  },

  render: function() /*object*/ {
    return (
      <input
        className={this.props.className}
        id={this.props.id}
        placeholder={this.props.placeholder}
        onBlur={this._save}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        value={this.state.value}
        autoFocus={true}
      />
    );
  },

  _save: function() {
    this.props.onSave(this.state.value);
    this.setState({
      value: ''
    });
  },

  _onChange: function(/*object*/ event) {
    this.setState({
      value: event.target.value
    });
  },

  _onKeyDown: function(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._save();
    }
  }

});

module.exports = TodoTextInput;
```

You could see, when `TodoTextInput` loses the focus, or user presses down the Enter key, `this.props.onSave(this.state.value)` will be called. 

The following is its code. it uses `AppDispatcher.dispatch` to send an action `TODO_CREATE`.

```javascript
// js/components/Header.js
  _onSave: function(text) {
    if (text.trim()){
      AppDispatcher.dispatch({
        actionType: 'TODO_CREATE',
        text: text
      });
    }
  }
```

`AppDispatcher` creates a item in `TodoStore`. Then, `TodoStore` emits a `change` event.

```javascript
// js/dispatcher/AppDispatcher.js

var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();
var TodoStore = require('../stores/TodoStore');

AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case 'TODO_CREATE':
      text = action.text.trim();
      if (text !== '') {
        TodoStore.create(text);
        TodoStore.emit('change');
      }
      break;

    default:
      // no op
  }
});

module.exports = AppDispatcher;
```

On another side, `TodoApp` listens the `change` event. `this._onChange` is the callback of `change` event.

```javascript
// js/components/TodoApp.js

  componentDidMount: function() {
    TodoStore.on('change', this._onChange);
  },

  componentWillUnmount: function() {
    TodoStore.removeListener('change', this._onChange);
  },
```


`TodoApp` gets all Todo items in the store, and puts them into `TodoApp` state object. Then, make a forced re-rendering of TodoApp.

```javascript
  _onChange: function() {
    this.state = TodoStore.getAll();
    this.forceUpdate();
  }
```

Now we can see the new Todo items in the browser.

## License

MIT
