/* CREATE APP CLASS (SINGLETON)
---------------------------------------------------------------- */
class App {
  constructor() {
    // Confirms app has started successfully
    console.log("App started successfully.");

    // Variables
    this.main = document.querySelector("main");
    this.projectName = "sturdy-torpid-throat";
    this.accessToken = "5b1064585f4ab8706d275f90";

    // Load Data
    this.fecthData();
    this.loadFromStorage();
    this.loadColor();

    // Main event listener
    this.main.addEventListener("click", (e) => this.collectData(e));
  }

  /* METHOD USED TO RETURN SINGLE INSTANCE OF THE APP
  ------------------------------------------------------------ */
  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
      return App.instance;
    } else {
      throw "App is currently running";
    }
  }

  /* METHOD USED TO LOAD COLORS
  ------------------------------------------ */
  loadColor() {
    // Body children
    const childrenArr = Array.from(document.body.children);
    const closeBtn = document.querySelector("#closeButton3");
    const cancelBtn = document.querySelector("#cancelButton3");
    const submitBtn = document.querySelector("#okButton");
    const modal = document.querySelector("#colorModal");
    const modalOverlay = document.querySelector("#colorModal__overlay");
    const form = document.querySelector("#colorModal__form");
    const btn = document.querySelector("#openColor");
    let previousActiveElement;
    previousActiveElement = document.activeElement;

    // Event listener
    btn.addEventListener("click", displayModal);

    // Display Modal Medthod
    function displayModal() {
      modal.hidden = false;
      window.addEventListener("scroll", Utils.disableScroll);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
      });

      document.querySelector('#color-picker').focus();

      disable();
      // Rename
      addListener(closeBtn);
      addListener(modalOverlay);
      addListener(cancelBtn);

      // Submit button
      submitBtn.addEventListener("click", formSubmit);
      submitBtn.addEventListener("keydown", (e) => {
        if (e.key == "enter") {
          formSubmit();
        }
      });
    }

    // Close Modal
    function closeModal() {
      modal.hidden = true;
      window.removeEventListener("scroll", Utils.disableScroll);
      reEnable();
      previousActiveElement.focus();
    }

    // OnSubmit
    function formSubmit() {
      const color = document.querySelector("#color-picker").value;
      document.querySelector("body").style.backgroundColor = color;
      closeModal();
    }

    // Add listners
    function addListener(ele) {
      ele.addEventListener("click", () => {
        closeModal();
      });

      ele.addEventListener("keydown", (e) => {
        if (e.key == "enter") {
          closeModal();
        }
      });
    }

    // Disable body elements
    function disable() {
      childrenArr.forEach((child) => {
        if (child !== modal) {
          child.inert = true;
        }
      });
    }

    // ReEnable body children
    function reEnable() {
      childrenArr.forEach((child) => {
        if (child.inert) {
          child.inert = false;
        }
      });
    }
  } // ****** End of Load Color Method ******

  /* METHOD USED TO FECTH DATA FROM THE API
  ------------------------------------------------------------------------------------------------ */
  fecthData() {
    // endpoint
    const URL = `https://${this.projectName}.glitch.me/api/lists?accessToken=${this.accessToken}`;
    const option = { Method: "GET" };

    // fetch
    fetch(URL, option)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        // Pass data to display method
        this.display(data);
      })
      .catch((err) => {
        console.log(err);
      });

  } // ****** End of fetchdata ******

  /* METHOD USED TO DISPLAY DATA
  -------------------------------------------------------------------- */
  display(data) {
    // loop through the data lists
    data.forEach((list) => {
      // create the section HTML
      const sectionHTML = `
      <section data-id = "${list.id}">
      <header>
      <h2>${list.title}</h2>
      <button class = 'add-task-btn'>Task</button>
      </header>
      </section>
      `;

      // add to main beforeend
      this.main.insertAdjacentHTML("beforeend", sectionHTML);
    }); // end of foreach Loop

    // Get all section created
    const sections = document.querySelectorAll("section");

    // Loop through list and add items to appropriate list
    for (let i = 0; i < data.length; i++) {
      // Sort
      data[i].items.sort(function (a, b) {
        return b.id - a.id;
      });

      // Loop through items and add to sections
      data[i].items.forEach((item) => {
        // Article (Tasks) HTML
        const articleHTML = `
        <article class="task">
            <p class="task__priority" data-priority="${item.priority.toLowerCase()}">${item.priority}</p>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <p class="task__date"><time datetime="2021-08-07">${item.dueDate}</time></p>
        </article>`;

        // Add to section
        sections[i].insertAdjacentHTML("beforeend", articleHTML);
      });
    }
  } // ****** End of display method ******

  /* METHOD USED GATHER DATA FROM USER
  --------------------------------------------------------------------- */
  collectData(e) {
    // Set target and parent
    let target = e.target;
    let parent = target.parentElement;
    let sectionID = "";

    // check if button class name = add-task-btn
    if (target.className == "add-task-btn") {
      // Set the section ID
      sectionID = parent.parentElement.dataset.id;

      // Display Modal
      this.displayModal();

      // Form
      const form = document.querySelector("#taskModal__form");

      // Disable form default
      form.addEventListener("submit", (e) => {
        e.preventDefault();
      });

      // Form Items
      const title = form.elements.namedItem("title");
      const description = form.elements.namedItem("description");
      const priority = form.elements.namedItem("priority");
      const date = form.elements.namedItem("date");

      let titleValidity = false;
      let descripValidity = false;
      let priorityValidity = false;
      let dateValidity = false;

      // Validate Inputs
      title.addEventListener("input", (e) => {
        let valid = Utils.inputValidation(e);
        titleValidity = this.checkValidity(valid, titleValidity);
      });

      description.addEventListener("input", (e) => {
        let valid = Utils.inputValidation(e);
        descripValidity = this.checkValidity(valid, descripValidity);
      });

      priority.addEventListener("change", (e) => {
        let valid = Utils.selectValidation(e);
        priorityValidity = this.checkValidity(valid, descripValidity);
      });

      date.addEventListener("change", (e) => {
        let valid = Utils.dateValidation(e);
        dateValidity = this.checkValidity(valid, dateValidity);
      });

      // Form buttons
      const submitBtn = document.querySelector("#submitButton");

      // Add event listener to submit button
      submitBtn.addEventListener("click", (e) => {
        const validities = [];

        validities.push(
          { input: title, valid: titleValidity },
          { input: description, valid: descripValidity },
          { input: priority, valid: priorityValidity },
          { input: date, valid: dateValidity }
        );

        // Check if all inputs are valid
        let valid = validities.every((e) => {
          return e.valid == true;
        });

        // Conditional
        if (valid) {
          // Create new taskItem
          const newTask = new TaskItem();
          newTask.title = title.value.trim();
          newTask.description = description.value.trim();
          newTask.priority = priority.value.trim();
          newTask.date = date.value.trim();

          // Remove Modal
          this.hideModal();

          // Post to API
          this.postData(newTask, sectionID);
        } else {
          validities.forEach((input) => {
            if (input.valid == false) {
              input.input.style.borderColor = "red";
            }
          });
        }
      });
    }
  } // ****** End of collectData ******

  /* METHOD USED TO CHECK VALID VALUES
  ------------------------------------------------------------- */
  checkValidity(valid, validity) {
    if (valid == true) {
      validity = true;
    } else if (valid == false) {
      validity = false;
    }

    return validity;

  } // ****** End of checkValidity ******

  /* METHOD USED TO ADD ERROR ON SUBMIT
  ------------------------------------------------------------- */
  addError(e, charLen) {
    const target = e;
    const parent = e.parentElement;
    const error = `<label class = "error" for = "${target.id}">${target.name} should be at least ${charLen} characters long.</label>`;

    if (!parent.querySelector(".error")) {
      parent.insertAdjacentHTML("beforeend", error);
    }

  } // ****** End of addError ******
  
  /* METHOD USED DISPLAY NEW TASK
  ------------------------------------------------------------- */
  addTask(taskItem, ID) {
    const sections = document.querySelectorAll("section");
    const articleHTML = `
    <article class="task">
      <p class="task__priority" data-priority="${taskItem.priority.toLowerCase()}">${taskItem.priority}</p>
      <h3>${taskItem.title}</h3>
      <p>${taskItem.description}</p>
      <p class="task__date"><time datetime="2021-08-07">${taskItem.date}</time></p>
    </article>`;
    sections[ID - 1]
      .querySelector("header")
      .insertAdjacentHTML("afterend", articleHTML);

  } // ****** End of addTask ******

  /* METHOD USED TO DISPLAY MODAL
  ------------------------------------------------------------- */
  displayModal() {
    const modal = document.querySelector("#taskModal");
    const modalOverlay = document.querySelector("#taskModal__Overlay");
    const closeBtn = document.querySelector("#closeButton");
    const cancelBtn = document.querySelector("#cancelButton");
    const form = document.querySelector("#taskModal__form");

    let previousActiveElement;

    previousActiveElement = document.activeElement;

    this.addInert(modal);

    modal.hidden = false;
    window.addEventListener("scroll", Utils.disableScroll);

    const eleArry = [modalOverlay, closeBtn, cancelBtn];

    eleArry.forEach((ele) => {
      ele.addEventListener("click", () => {
        this.removeInert(modal);
        previousActiveElement.focus();
        modal.hidden = true;
        window.removeEventListener("scroll", Utils.disableScroll);
      });

      ele.addEventListener("keydown", (e) => {
        if (e.key == "enter") {
          this.removeInert(modal);
          previousActiveElement.focus();
          modal.hidden = true;
          window.removeEventListener("scroll", Utils.disableScroll);
        }
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key == "Escape") {
        this.removeInert(modal);
        modal.hidden = true;
        window.removeEventListener("scroll", Utils.disableScroll);
      }
    });

    modal.querySelector("input").focus();

  } // ****** End of DisplayModal ******

  /* METHOD USED TO REMOVE INERT ATTRIBUTE
  ------------------------------------------------------------ */
  removeInert(element) {
    Array.from(document.body.children).forEach((child) => {
      if (child !== element) {
        child.inert = false;
      }
    });

  } // ****** End of removeInert ******

  /* METHOD USED TO ADD INERT ATTRIBUTE
  ------------------------------------------------------------ */
  addInert(element) {
    Array.from(document.body.children).forEach((child) => {
      if (child !== element) {
        child.inert = true;
      }
    });

  } // ****** End of addInert ******

  /* METHOD USED TO HIDE MODAL
  ------------------------------------------------------------ */
  hideModal() {
    const modal = document.querySelector("#taskModal");
    window.removeEventListener("scroll", Utils.disableScroll);
    modal.hidden = true;

  } // ****** End of hideModal ******

  /* METHOD USED POST TO THE API
  ------------------------------------------------------------ */
  postData(data, ID) {
    const URL = `https://${this.projectName}.glitch.me/api/items?accessToken=${this.accessToken}`;

    // task to send
    const taskToSend = {
      title: data.title,
      listId: ID,
      description: data.description,
      priority: data.priority,
      dueDate: data.date,
    };

    // Config
    const config = {
      method: "POST",
      body: JSON.stringify(taskToSend),
      headers: {
        "content-type": "application/json",
      },
    };

    // Fetch - post new task to the API
    fetch(URL, config)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((responseAsJson) => {
        console.log(responseAsJson);
      })
      .catch((error) => {
        console.log(error);
      });

    this.addTask(data, ID);

  } // ****** End of postData ******

  /* METHOD USED TO DISPLAY IMAGE UPLOAD MODAL
  ------------------------------------------------------------ */
  displayUploadModal() {
    const modal = document.querySelector("#imgUploadModal");
    const modalOverlay = document.querySelector("#imgUploadModal__Overlay");
    const modalWindow = document.querySelector(".imgUploadModal__window");
    const cancelBtn = document.querySelector("#cancelUploadButton");
    const closeBtn = document.querySelector("#closeButton2");
    const enter = "enter";
    const esc = "Escape";

    let previousActiveElement;
    previousActiveElement = document.activeElement;

    // Display modal
    this.addInert(modal);
    modal.hidden = false;
    window.addEventListener("scroll", Utils.disableScroll);
    modal.querySelector("#avatar").focus();


    // Array
    const eleArry = [modalOverlay, closeBtn, cancelBtn];

    // Addevent Listeners
    eleArry.forEach((ele) => {
      ele.addEventListener("click", () => {
        this.removeInert(modal);
        previousActiveElement.focus();
        modal.hidden = true;
        window.removeEventListener("scroll", Utils.disableScroll);
      });

      ele.addEventListener("keydown", (e) => {
        if (e.key == enter) {
          this.removeInert(modal);
          previousActiveElement.focus();
          modal.hidden = true;
          window.removeEventListener("scroll", Utils.disableScroll);
        }
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key == esc) {
        this.removeInert(modal);
        modal.hidden = true;
        window.removeEventListener("scroll", Utils.disableScroll);
      }
    });

  } // ****** End of displayUploadModal ******

  /* METHOD USED FOR LOCALSTORAGE
  ------------------------------------------------------------ */
  loadFromStorage() {
    const img = document.querySelector("img");
    const form = document.querySelector("#imgUploadModal__form");
    const uploadBtn = document.querySelector("#uploadButton");

    // Add event listener to image
    img.addEventListener("click", (e) => {
      this.displayUploadModal();
      const avatar = document.querySelector("#avatar");
      avatar.addEventListener("change", function () {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          localStorage.setItem("recent-avatar", reader.result);
        });
        reader.readAsDataURL(this.files[0]);
      });
    });

    // Load last image on load
    document.addEventListener("DOMContentLoaded", () => {
      const recentAvatarURL = localStorage.getItem("recent-avatar");
      if (recentAvatarURL) {
        img.setAttribute("src", recentAvatarURL);
      }
    });

    // Prevent link from refreshing page
    const link = document.querySelector("a");
    link.addEventListener("click", (e) => {
      e.preventDefault();
    });

    // upload button
    uploadBtn.addEventListener("click", () => {
      const recentAvatarURL = localStorage.getItem("recent-avatar");

      if (recentAvatarURL) {
        img.setAttribute("src", recentAvatarURL);
      }

      window.removeEventListener("scroll", Utils.disableScroll);
      const modal = (document.querySelector("#imgUploadModal").hidden = true);
      this.removeInert(modal);
    });

    // Form
    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });

  } // ****** End of LocalStorage ******

} // ****** End App Class ******

/* STARTS APPLICATION
--------------------------------- */
(() => {
  const app = App.getInstance();
})();
