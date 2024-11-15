import { format, parseISO } from "date-fns";

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

  getFormattedDueDate() {
    if (this.dueDate && this.dueDate !== 'No due date') {
      const parsedDate = parseISO(this.dueDate);
      return format(parsedDate, 'dd/MM/yyyy');
    }
    return this.dueDate;
  }
}