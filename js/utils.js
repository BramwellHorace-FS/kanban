/* UTILITY CLASS
--------------------------- */
class Utils {
  constructor() {}

  /* STATIC METHOD USED DISABLE SCROLL
  ------------------------------------------------------ */
  static disableScroll() {
    window.scrollTo(0, 0);
  }

  /* METHOD TO VALIDATE TEXT & TEXTAREA INPUTS
  ------------------------------------------------------ */
  static inputValidation(e) {
    // Set variables
    let target = e.target;
    let parent = target.parentElement;
    let charLen = 0;

    // Set character length based on target
    if (target.name == "Title") {
      charLen = 5;
    } else {
      charLen = 20;
    }

    // Create label to display error
    const error = `<label class = "error" for = "${target.id}">${target.name} should be at least ${charLen} characters long.</label>`;
    // const success = `<label class = "success" for = "${target.id}">${target.name} is at least ${charLen} characters long.</label>`;


    // Add error message to parent element
    if (target.value.trim() == 0 || target.value.trim().length < charLen) {
      if (!parent.querySelector(".error")) {
        parent.insertAdjacentHTML("beforeend", error);
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

  /* METHOD TO VALIDATE SELECTS
  ------------------------------------------------------ */
  static selectValidation(e) {
    // Set variables
    let target = e.target;
    let parent = target.parentElement;

    if (target.selectedIndex == 0){
        target.style.borderColor = "red";
        return false;
    }else {
      target.style.borderColor = "green";
      return true;
    }
  }

    /* METHOD TO VALIDATE DATE
  ------------------------------------------------------ */
  static dateValidation(e) {
    let target = e.target;
    let parent = target.parentElement;

    if(target.value == 0 || target.value == ''){
      target.style.borderColor = 'red';
      return false;
    }else {
      target.style.borderColor = 'green';
      return true;
    }
  }
}