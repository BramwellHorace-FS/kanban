class Utils {
  constructor() {}

  static disableScrolling() {
    window.scrollTo(0, 0);
  }

  static displayModal(modalElements) {
    let modal = modalElements.modal;
    let closeButton = modalElements.closeButton;
    let modalOverlay = modalElements.modalOverlay;
    let cancelButton = modalElements.cancelButton;
    let previousActiveElement = document.activeElement;

    modal.hidden = false;
    window.addEventListener("scroll", Utils.disableScrolling);
    modalElements.form.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    document.querySelector("input").focus();
    enableInert();
    enableExitTriggers();
    // onFormSubmit();

    /** Enable inert **/
    function enableInert() {
      const bodyChildren = Array.from(document.body.children);
      bodyChildren.forEach((child) => {
        if (child !== modal) child.inert = true;
      });
    }

    /** Event triggers **/
    function enableExitTriggers() {
      const exitTriggers = [closeButton, modalOverlay, cancelButton];

      const KEYCODE = { ESC: 27 };
      const KEY = { ESCAPE: "Escape" };

      exitTriggers.forEach((trigger) => {
        trigger.addEventListener('click', exitModal);
      })

      document.addEventListener("keydown", (e) => {
        if (e.keyCode == KEYCODE.ESC || e.key == KEY.ESCAPE) {
          exitModal();
        }
      });
    }

    /** Exit Modal **/
    function exitModal() {
      modal.hidden = true;
      window.removeEventListener("scroll", Utils.disableScrolling);
      disableInert();
      previousActiveElement.focus();
    }

    /** Disable Inert **/
    function disableInert() {
      const bodyChildren = Array.from(document.body.children);
      bodyChildren.forEach((child) => {
        if (child !== modal) child.inert = false;
      });
    }
  }

  static inputValidation(e) {
    let target = e.target;
    let parent = target.parentElement;
    let characterLength = 0;

    if (target.name == "Title") {
      characterLength = 5;
    } else {
      characterLength = 20;
    }

    const errorLabel = `<label class = "error" for = "${target.id}">${target.name} should be at least ${characterLength} characters long.</label>`;

    if (
      target.value.trim() == 0 ||
      target.value.trim().length < characterLength
    ) {
      if (!parent.querySelector(".error")) {
        parent.insertAdjacentHTML("beforeend", errorLabel);
        target.style.borderColor = "red";
        return false;
      }
    } else {
      if (parent.querySelector(".error")) {
        parent.removeChild(parent.querySelector(".error"));
        target.style.borderColor = "green";
        return true;
      }
    }
  }

  static selectValidation(e) {
    let target = e.target;

    if (target.selectedIndex == 0) {
      target.style.borderColor = "red";
      return false;
    } else {
      target.style.borderColor = "green";
      return true;
    }
  }

  static dateValidation(e) {
    let target = e.target;

    if (target.value == 0 || target.value == "") {
      target.style.borderColor = "red";
      return false;
    } else {
      target.style.borderColor = "green";
      return true;
    }
  }

  static disableInert(modal) {
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach((child) => {
      if (child !== modal) child.inert = false;
    });
  }

  /** Exit Modal **/
  static exitModal(modal, previousActiveElement) {
    modal.hidden = true;
    window.removeEventListener("scroll", Utils.disableScrolling);
    Utils.disableInert(modal);
    previousActiveElement.focus();
  }


  static saveToLocalStorage(name,itemToSave){
    localStorage.setItem(name,itemToSave);
  }


  static loadFromLocalStorage(){
      const bodyElement = document.querySelector('body');
      const userProfileImage = document.querySelector('#user-profile-img');

      const recentUserImage = localStorage.getItem('recent-avatar');
      const recentBackgroundColor = localStorage.getItem('color');

      if(recentUserImage) {
        userProfileImage.setAttribute('src', recentUserImage);
      }

      if (recentBackgroundColor) {
        bodyElement.style.backgroundColor = recentBackgroundColor;
      }
  }
}

