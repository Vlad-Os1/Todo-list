import './styles.css'
import Modal from './modules/modal.js';
import UI from './modules/ui.js';



document.addEventListener("DOMContentLoaded", () => {
  UI.loadHomepage();
  Modal.init();
});