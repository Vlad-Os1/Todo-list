import Todo from './todo.js'
import List from './list.js'
import Task from './task.js'
import { lightFormatters } from 'date-fns';

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

  static addList(newList){
    const todoList = Storage.getTodoList();
    todoList.addList(newList);
    Storage.saveTodoList(todoList);
  }

  static deleteList(listName){
    const todoList = Storage.getTodoList();
    todoList.deleteList(listName);
    Storage.saveTodoList(todoList);
  }

  static addTask(listName, task){
    const todoList = Storage.getTodoList();
    todoList.getList(listName).addTask(task);
    Storage.saveTodoList(todoList);
  }

  static deleteTask(listName, taskName){
    const todoList = Storage.getTodoList();
    todoList.getList(listName).deleteTask(taskName);
    Storage.saveTodoList(todoList);
  }

  static updateTodayList() {
    const todoList = Storage.getTodoList();
    todoList.updateTodayList();
    Storage.saveTodoList(todoList);
  }

  static updateWeekList() {
    const todoList = Storage.getTodoList();
    todoList.updateWeekList();
    Storage.saveTodoList(todoList);
  }

  static updateAllTasksList() {
    const todoList = Storage.getTodoList();
    todoList.updateAllTasksList();
    Storage.saveTodoList(todoList);
  }

}