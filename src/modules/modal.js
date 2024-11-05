export default class Modal {
  constructor(){
    this.overlay = document.getElementById('overlay');
    this.init();
  }
  
  init() {
    const openModalButtons = document.querySelectorAll('[data-modal-target]')
    const closeModalButtons = document.querySelectorAll('[data-close-button]')

    openModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        this.openModal(modal);
      })
    })
    this.overlay.addEventListener('click', () => {
      const modals = document.querySelectorAll('.modal.active')
      modals.forEach(modal => {
        this.closeModal(modal);
      })
    })
    closeModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        this.closeModal(modal)
      })
    })
  }
  openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    this.overlay.classList.add('active')
  }

  closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    this.overlay.classList.remove('active')
  }
}