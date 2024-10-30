import Todo from './todo.js'
import List from './list.js'
import Task from './task.js'

export default class Storage {
  static saveTodoList(data) {
    localStorage.setItem('todoList', JSON.stringify(data));
  }
  
  static getTodoList() {
    const todoList = Object.assign( new Todo(), JSON.parse(localStorage.getItem('todoList')));
    
    todoList.setLists(
      todoList.getLists().map((list) => Object.assign(new List(), list))
    )

    todoList.getLists().forEach(
      (list) => list.setTasks(list.getTasks().map((task) => Object.assign(new Task(), task)))
    )

    return todoList
  }
}