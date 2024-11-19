import { format } from 'date-fns'
import Storage from './storage.js'
import Modal from './modal.js'
import List from './list.js';
import Task from './task.js';



export default class UI {

  static loadHomepage() {
    document.querySelector('.left-panel').classList.add('active');
    UI.loadDropdown();
    UI.loadMenu();
    UI.toggleTheme();

    UI.loadLists(); 
    UI.highlightSelectedList();
    
    UI.loadTasks(); 
    UI.initializeEventListeners();
  }

  // Loading methods
  static loadLists() {
    UI.clearUserLists();
    Storage.getTodoList().getLists().forEach((list) => {
      if (
        list.name !== 'All Tasks' &&
        list.name !== 'Today' &&
        list.name !== 'This week'
      ) {
        UI.createList(list.name);        
      }
    })
  }

  static createList(listName) {
    const listContainer = document.querySelector('.user-lists');
    listContainer.innerHTML += 
    `
    <button class="user-list">
      <span>${listName}</span>
      <i class="delete-list"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"></path></svg></i>
    </button>
    `
  }

  static loadTasks() {
    const todoList = Storage.getTodoList();
    const selectedListName = Storage.getSelectedList();
    const selectedList = todoList.getList(selectedListName);
    const listTitle = document.querySelector('.list-title');
    listTitle.textContent = selectedListName;

    if (!selectedList) {
      console.error("Selected list not found:", selectedListName);
      return;
    }

    UI.clearListTasks();
    UI.clearListAddTaskButton();

    let tasks = selectedList.getTasks();
    if (selectedListName === 'This week') {
      tasks = tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
  
    tasks.forEach((task) => {
      UI.createTask(task.name, task.getFormattedDueDate(), task.getId());
    });

    if (selectedListName !== 'All Tasks' && selectedListName !== 'Today' && selectedListName !== 'This week'){  
      UI.initAddTaskButton();
      Modal.init();
    };
  }

  static createTask(taskName, taskDueDate, taskId) {
    const taskContainer = document.querySelector('.list-content');
    taskContainer.innerHTML += 
    `
    <div class="list-task" data-task-id="${taskId}">
      <div class="task-left-panel">
        <i class="task-check-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"></path></svg></i>
        <p>${taskName}</p>
      </div>
      <div class="task-right-panel">
        <p class="due-date">${taskDueDate}</p>
        <i class="close-task-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"></path></svg></i>
      </div>
    </div>
    `
  }

  static loadDropdown(){
    let dropdownButtons = document.querySelectorAll('.dropdown');
    dropdownButtons.forEach((dropdown) => {
      dropdown.addEventListener('click', () => {
        const dropdownContent = dropdown.nextElementSibling;
        if (dropdownContent && dropdownContent.classList.contains('dropdown-content')) {
          UI.toggleDropdown(dropdownContent);
          dropdown.classList.toggle('active');
        }
      })
    })
  }
  
  static loadMenu(){
    const menuToggleButton = document.querySelector('.menu-toggle');
    menuToggleButton.addEventListener('click', () => {
      const menu = document.querySelector('.left-panel');   
      menu.style.overflow = 'hidden';
      UI.toggleMenu(menu);
    })   
  }

  // Methods for events
  
  static initializeEventListeners() {
    // Add list event
    document.querySelector('#add-list-form').addEventListener('submit', UI.handleAddListEvent);
    // Delete list event
    document.querySelector('.user-lists').addEventListener('click', (event) => {
      const deleteButton = event.target.closest('.delete-list');
      if (deleteButton) {
        UI.handleDeleteListEvent(event);
      }
    });  
    
    // Select list events
    document.querySelector('.user-lists').addEventListener('click', (event) => {
      if (event.target && event.target.classList.contains('user-list')) {
        UI.handleSelectListEvent(event);
      }
    });
    document.querySelector('.main-lists-section').addEventListener('click', (event) => {
      if (event.target && event.target.classList.contains('main-list')) {
        UI.handleSelectListEvent(event);
      }
    });
    // Add task event
    document.querySelector('#add-task-form').addEventListener('submit', UI.handleAddTaskEvent)
    // Delete task event
    document.querySelector('.list-content').addEventListener('click', (event) => {
      const deleteTaskButton = event.target.closest('.close-task-btn');
      if (deleteTaskButton) {
        UI.handleDeleteTaskEvent(event);
      }
    });
  }

  static handleAddListEvent(event) {
    event.preventDefault();
    const modal = document.querySelector('#add-list-modal');
    const inputElement = event.target.elements['new-list-title'];
    const inputValue = inputElement.value.trim();
    const newList = new List(inputValue);

    if(!Storage.getTodoList().contains(newList.name)){
      Storage.addList(newList)
      UI.closeAddListErrorMsg();
      UI.loadLists();
      Modal.closeModal(modal);
      UI.setSelectedList(newList.name);
      UI.loadTasks();

      inputElement.value = '';
    } else {
      UI.openAddListErrorMsg();
    }
  }

  static handleDeleteListEvent(event) {
    const list = event.target.closest('.user-list');
    if(list) {
      const todoList = Storage.getTodoList();
      const listTitle = list.querySelector('span').textContent;
      if (Storage.getSelectedList() === listTitle) {
        UI.setSelectedList('All Tasks')
      }
      todoList.deleteList(listTitle);
      Storage.saveTodoList(todoList);
      UI.updateMainLists();
      UI.loadLists();
      UI.loadTasks();
    }
  }

  static handleSelectListEvent(event) {
    const list = event.target.closest('.user-list') || event.target.closest('.main-list'); 
    if(list) {
      const listTitle = list.querySelector('span').textContent;
      UI.setSelectedList(listTitle);
      UI.loadTasks();
    }
  }

  static handleAddTaskEvent(event) {
    event.preventDefault()

    const modal = document.querySelector('#add-task-modal');
    const title = event.target.elements['new-task-title'];
    const titleValue = title.value.trim();
    const dueDate = event.target.elements['new-task-due-date'];
    const dueDateValue = dueDate.value;
    
    const description = event.target.elements['new-task-description'];
    const descriptionValue = description.value;
    const priority = event.target.elements['priority-selector'];
    const priorityValue = priority.value;

    const selectedListName = Storage.getSelectedList();
    const todoList = Storage.getTodoList();

    const newTask = new Task(titleValue, dueDateValue);
    newTask.setDescription(descriptionValue);
    newTask.setPriority(priorityValue);
    newTask.setParentList(selectedListName);
    newTask.setId();

    todoList.getList(selectedListName).addTask(newTask);
    Storage.saveTodoList(todoList);
    UI.updateMainLists();

    Modal.closeModal(modal);
    title.value = '';
    description.value = '';
    priority.value = 'High';
    dueDate.value = '';

    UI.loadTasks();
  }

  static handleDeleteTaskEvent(event) {
    const todoList = Storage.getTodoList();
    const task = event.target.closest('.list-task');
    const taskId = task.getAttribute('data-task-id');

    const originalTask = todoList.findTask(taskId);
    if (originalTask) {
      const parentList = todoList.getList(originalTask.getParentList());
      parentList.deleteTask(taskId); 
    }
    Storage.saveTodoList(todoList);
    
    UI.updateMainLists();
    UI.loadTasks();
  }

  // Methods for managing element status
  static openAddListErrorMsg() {
    const addListErrorMsg = document.querySelector('#add-list-error-msg');
    addListErrorMsg.textContent = 'The list with this title already exists';
  }

  static closeAddListErrorMsg() {
    const addListErrorMsg = document.querySelector('#add-list-error-msg')
    addListErrorMsg.textContent = '';
  }
  
  static toggleDropdown(dropdownContent) {
    if (dropdownContent == null) return
    dropdownContent.classList.toggle('active');
  }

  static toggleMenu(menu) {
    if (menu == null) return
    menu.classList.toggle('active');
  }

  static toggleTheme() {
    let themeToggleButton = document.querySelector('#theme-toggle')
    const body = document.querySelector('body');
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      body.classList.add('dark-theme');
    }
    themeToggleButton.addEventListener('click', () => {
      body.classList.toggle('dark-theme');
    })
  }

  static clearUserLists() {
    const listsContainer = document.querySelector('.user-lists');
    listsContainer.innerHTML = '';  
  }

  static clearListTasks() {
    const tasksContainer = document.querySelector('.list-content');
    tasksContainer.innerHTML = '';  
  }

  static clearListAddTaskButton() {
    const addTaskButton = document.querySelector('.add-task-button');
    if (addTaskButton) {
      addTaskButton.remove();
    }
  }

  static setSelectedList(listTitle) {
    const selectedList = Storage.getTodoList().getList(listTitle);
    Storage.saveSelectedList(selectedList.name);
    UI.highlightSelectedList()
  }

  static highlightSelectedList() {
    const selectedListName = Storage.getSelectedList();
    if (selectedListName) {
      const allLists = document.querySelectorAll('.user-list, .main-list');
      allLists.forEach(list => {
        if(list.querySelector('span').textContent === selectedListName) {
          list.classList.add('selected');
        } else {
          list.classList.remove('selected');
        }
      });
    }
  }

  static updateMainLists() {
    Storage.updateAllTasksList();
    Storage.updateTodayList();
    Storage.updateWeekList();
  }

  static initAddTaskButton() {
    const tasksContainer = document.querySelector('.list-content');
    const addTaskButton = document.createElement('button');
    addTaskButton.classList.add('add-task-button');
    addTaskButton.setAttribute('data-modal-target', '#add-task-modal');
    addTaskButton.innerHTML = 
    `
    <i class="add-task-icon"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"></path></svg></i>
    <span>Add Task</span>      
    `;
    tasksContainer.after(addTaskButton);
  }

}