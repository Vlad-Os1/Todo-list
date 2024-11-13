import { format } from 'date-fns'
import Storage from './storage.js'
import Modal from './modal.js'
import List from './list.js';



export default class UI {

  static loadHomepage() {
    document.querySelector('.left-panel').classList.add('active');
    UI.loadDropdown();
    UI.loadMenu();
    UI.toggleTheme();
    UI.loadLists(); 
    UI.initializeEventListeners();
  }

  // Loading methods
  static loadLists() {
    Storage.getTodoList().getLists().forEach((list) => {
      if (
        list.name !== 'All Tasks' &&
        list.name !== 'Today' &&
        list.name !== 'Week'
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
      <i id="delete-list"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"></path></svg></i>
    </button>
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
    document.querySelector('#add-list-form').addEventListener('submit', UI.handleAddListEvent);
    document.querySelector('.user-lists').addEventListener('click', (event) => {
      if (event.target && event.target.id === 'delete-list') {
        UI.handleDeleteListEvent(event);
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
      UI.clearUserLists();
      UI.loadLists();
      Modal.closeModal(modal);

      inputElement.value = '';
    } else {
      UI.openAddListErrorMsg();
    }
  }

  static handleDeleteListEvent(event) {
    const list = event.target.closest('.user-list');
    if(list) {
      const listTitle = list.querySelector('span').textContent;
      
      Storage.deleteList(listTitle);
      UI.clearUserLists();
      UI.loadLists();
    }
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

}