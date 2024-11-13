import List from './list.js'

export default class Todo {
  constructor() {
    this.lists = [];
    this.addList(new List('All Tasks'));
    this.addList(new List('Today')); 
    this.addList(new List('This week'))
  }

  getLists() {
    return this.lists;
  }

  setLists(lists) {
    this.lists = lists;
  }

  getList(listName) {
    return this.lists.find((list) => list.getName() === listName);
  }

  addList(newList) {
    if (this.lists.find((list) => list.getName() === newList.getName())) return
    this.lists.push(newList);
  }

  contains(listName) {
    return this.lists.some((list) => list.getName() === listName);
  }

  deleteList(listName) {
    this.lists = this.lists.filter((list) => list.getName() !== listName);
  }

  updateTodayList() {
    let todayList = this.getList('Today');

    this.lists.forEach(list => {
      if(list.getName() !== 'Today') {
        const todayTasks = list.getTodayTasks();
        todayTasks.forEach(task => todayList.addTask(task))
      }
    });
  }

  updateWeekList() {
    let weekList = this.getList('Week');

    this.lists.forEach(list => {
      if(list.getName() !== 'Week') {
        const weekTasks = list.getWeekTasks();
        weekTasks.forEach(task => weekList.addTask(task))
      }
    });
  }

  updateAllTasksList() {
    let allTasksList = this.getList('All Tasks')

    this.lists.forEach(list => {
      if(list.getName() !== 'All Tasks') {    
        list.getTasks().forEach(task => allTasksList.addTask(task))
      }
    });
  }
}