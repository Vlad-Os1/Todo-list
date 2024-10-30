import List from './modules/list.js';
import Task from './modules/task.js';
import Todo from './modules/todo.js';
import Storage from './modules/storage.js';

// import { isToday} from 'date-fns';

let todo = new Todo(); 

let newList = new List('List');  


let task1 = new Task('Work',  '2024-10-28');
task1.setPriority('low');
task1.setDescription('some-description HERE');

let task2 = new Task('Laundry', '2024-10-30');
task2.setPriority('high');
task2.setDescription('wash the T-shirts');

let task3 = new Task('Rest');
task3.setPriority('medium');
task3.setDescription('well, just rest...');

newList.addTask(task1);
newList.addTask(task2);
newList.addTask(task3);
console.log(newList.contains('Laundry'));



todo.addList(newList);

console.log(todo);
// console.log(todo.getList('List').getTask('Work'))


todo.updateTodayList();
todo.updateWeekList();
todo.updateAllTasksList();


Storage.saveTodoList(todo);
console.log(Storage.getTodoList())