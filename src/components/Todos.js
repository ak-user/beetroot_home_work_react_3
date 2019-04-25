import React from "react";
import "../components/Todos.css";

function generateId() {
  return `${new Date().getTime()}${Math.random()}`;
}

const initialTodos = [
  {
    id: generateId(),
    createdAt: new Date("January 31 2000 12:30"),
    text: "todo1",
    isDone: false
  },
  {
    id: generateId(),
    createdAt: new Date("December 25 1900 11:30"),
    text: "todo2",
    isDone: false
  },
  {
    id: generateId(),
    createdAt: new Date("May 01 2019 9:30"),
    text: "todo3",
    isDone: true
  }
];

const FILTER_STATES = {
  ALL: "ALL",
  ACTIVE: "ACTIVE"
};

const SORT_STATES = {
  NONE: "",
  SORT_BY_CREATE_AT: "SORT_BY_CREATE_AT",
  SORT_BY_IS_DONE: "SORT_BY_IS_DONE"
}

function filterTodos(todos, filterName) {
  if (filterName === FILTER_STATES.ACTIVE) {
    return todos.filter(todo => !todo.isDone);
  }

  return todos;
}

function sortTodos(todos, sortName) {
  if (sortName === SORT_STATES.SORT_BY_CREATE_AT) {
    return todos.sort((first, second) => {
      return first.createdAt - second.createdAt;
    });
  } else if (sortName === SORT_STATES.SORT_BY_IS_DONE) {
    return todos.sort((first, second) => {
      return (first.isDone === second.isDone) ? 0 : second.isDone ? -1 : 1;
    });
  }

  return todos;
}

export default class Todos extends React.Component {
  state = {
    todos: initialTodos,
    filterName: FILTER_STATES.ALL,
    newTodoText: '',
    sortName: SORT_STATES.NONE
  };

  showFiltered = filterName => () => {
    this.setState({
      filterName: filterName
    });
  };

  showSorted = sortName => () => {
    this.setState({
      sortName: sortName
    })
  }


  changeInputHandler = event => {
    this.setState({
        newTodoText: event.target.value
    })
  }

  checkedHandler = todo => event => {
    this.setState({
      todos: this.state.todos.map(item => {
        if (item !== todo) return item;

        return {
          ...item,
          isDone: event.target.checked
        };
      })
    });
  };


  submitHandler = event => {
    event.preventDefault();

    let newTodo = {
        id: generateId(),
        createdAt: new Date(),
        text: this.state.newTodoText,
        isDone: false
    };

    this.setState({
        todos: [...initialTodos, newTodo],
        newTodoText: ""
    });
  }

  render() {
    const { todos, filterName, sortName } = this.state;

    return (
      <div>
        <button onClick={this.showFiltered(FILTER_STATES.ALL)}>All</button>
        <button onClick={this.showFiltered(FILTER_STATES.ACTIVE)}>Active</button>
        <button onClick={this.showSorted(SORT_STATES.SORT_BY_CREATE_AT)}>Sort by createAt</button>
        <button onClick={this.showSorted(SORT_STATES.SORT_BY_IS_DONE)}>Sort by isDone</button>

        <form onSubmit={this.submitHandler}>
            <input value={this.state.newTodoText} onChange={this.changeInputHandler} />
            <button>Add</button>
        </form>

        {filterTodos(sortTodos(todos, sortName), filterName).map(item => (
          <div
            key={item.id}
            className={ item.isDone ? "is-done" : "" }
          >
          <input type="checkbox" checked={item.isDone} onChange={this.checkedHandler(item)} />
            {item.text}
            <span>({item.createdAt.toISOString()})</span>
          </div>
        ))}
      </div>
    );
  }
}