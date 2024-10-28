export default class Task {
  constructor(name, dueDate = 'No due date') {
    this.name = name;
    this.dueDate = dueDate;
    this.description = null;
    this.priority = 'low';
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  setPriority(priority) {
    this.priority = priority;
  }

  setDescription(description) {
    this.description = description;
  }

  getDueDate() {
    return this.dueDate;
  }
}