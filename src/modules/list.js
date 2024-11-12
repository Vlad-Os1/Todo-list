import { isToday, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';

export default class List {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }
  
  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  getTasks() {
    return this.tasks;
  }

  setTasks(tasks) {
    this.tasks = tasks;
  }

  getTask(taskName) {
    return this.tasks.find((task) => task.getName() === taskName);
  }

  addTask(newTask) {
    if (this.tasks.find((task) => task.getName() === newTask.getName())) return
    this.tasks.push(newTask);
  }

  contains(taskName) {
    return this.tasks.some((task) => task.getName() === taskName);
  }

  deleteTask(taskName) {
    this.tasks = this.tasks.filter((task) => task.name !== taskName);
  }

  setTaskPriority(taskName, priority) {
    return this.getTask(taskName).setPriority(priority);
  }

  setTaskDescription(taskName, description) {
    return this.getTask(taskName).setDescription(description);
  }

  setTaskName(taskName, newTaskName) {
    return this.getTask(taskName).setName(newTaskName);
  }

  getTodayTasks() {
    return this.tasks.filter((task) => isToday(new Date(task.getDueDate())));
  }

  getWeekTasks() {
    const today = new Date();
    const weekStart = startOfWeek(today, {weekStartsOn: 1}); // returns monday of the current week
    const weekEnd = endOfWeek(today, {weekStartsOn: 1}); // returns sunday of the current week

    return this.tasks.filter((task) =>
      isWithinInterval(new Date(task.getDueDate()), { start: weekStart, end: weekEnd })
    );
  }
}

