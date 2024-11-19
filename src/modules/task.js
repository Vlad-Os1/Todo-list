import { format, parseISO } from "date-fns";

export default class Task {
  constructor(name, dueDate = 'No due date') {
    this.name = name;
    this.dueDate = dueDate;
    this.description = null;
    this.priority = 'low';
    this.parentList = null;
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
  
  setParentList(parentListName) {
    this.parentList = parentListName;
  }

  getParentList() {
    return this.parentList;
  }

  setId() {
    this.id = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  getId() {
    return this.id
  }

  getDueDate() {
    return this.dueDate;
  }

  getFormattedDueDate() {
    if (this.dueDate && this.dueDate !== 'No due date') {
      const parsedDate = parseISO(this.dueDate);
      return format(parsedDate, 'dd/MM/yyyy');
    }
    return this.dueDate;
  }
}