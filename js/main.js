class App {
  constructor() {
    console.log("App started successfully");
    this.Controller = new Controller();
    Utils.loadFromLocalStorage();
  }

  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
      return App.instance;
    } else {
      throw "App is already running";
    }
  }
}

class Controller {
  constructor() {
    console.log("controller created");
    this.model = new Model();
    this.view = new View();
    this.loadTask();
    this.addEventListeners();
  }

  loadTask() {
    const PROJECT_TITLE = "sturdy-torpid-throat";
    const ACCESS_TOKEN = "5b1064585f4ab8706d275f90";
    const URL = `https://${PROJECT_TITLE}.glitch.me/api/lists?accessToken=${ACCESS_TOKEN}`;
    const option = { Method: "GET" };

    fetch(URL, option)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        const loadEvent = new Event("task_loaded");
        loadEvent.taskLists = data;
        document.dispatchEvent(loadEvent);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addEventListeners() {
    const addTaskButton = document.querySelector("main");
    const backgroundColorButton = document.querySelector("#openColor");
    const uploadImageButton = document.querySelector("img");

    addTaskButton.addEventListener("click", (e) => this.getTaskData(e));
    backgroundColorButton.addEventListener("click", this.getBackgroundColor);
    uploadImageButton.addEventListener("click", this.getUserImage);
  }

  getTaskData(e) {
    let target = e.target;
    let parent = target.parentElement;
    let sectionID = "";
    let previousActiveElement = document.activeElement;

    if (target.className == "add-task-btn") {
      sectionID = parent.parentElement.dataset.id;

      const modalElements = {
        modal: document.querySelector("#taskModal"),
        modalOverlay: document.querySelector("#taskModal__Overlay"),
        closeButton: document.querySelector("#closeButton"),
        cancelButton: document.querySelector("#cancelButton"),
        submitButton: document.querySelector("#submitButton"),
        form: document.querySelector("#taskModal__form"),
      };

      Utils.displayModal(modalElements);
    
      const title = modalElements.form.elements.namedItem('title');
      const description = modalElements.form.elements.namedItem('description');
      const priority = modalElements.form.elements.namedItem('priority');
      const date = modalElements.form.elements.namedItem('date');

      const inputValidity = {
        titleIsValid: false,
        descriptionIsValid: false,
        priorityIsValid: false,
        dateIsValid: false,
      }

      title.addEventListener('input', (e) => {
        let valid = Utils.inputValidation(e);
        inputValidity.titleIsValid = checkValidity(valid, inputValidity.titleIsValid);
      });

      description.addEventListener('input', e => {
        let valid = Utils.inputValidation(e);
        inputValidity.descriptionIsValid = checkValidity(valid, inputValidity.descriptionIsValid);
      });

      priority.addEventListener('change', e => {
        let valid = Utils.selectValidation(e);
        inputValidity.priorityIsValid = checkValidity(valid, inputValidity.priorityIsValid);
      });

      date.addEventListener('change', e => {
        let valid = Utils.dateValidation(e);
        inputValidity.dateIsValid = checkValidity(valid, inputValidity.dateIsValid);
      });


  
      // ** Submit

      modalElements.submitButton.addEventListener('click', () => {
        
        let formInputsAfterValidation = [
          {input: title, isValid: inputValidity.titleIsValid},
          {input: description, isValid: inputValidity.descriptionIsValid },
          {input: priority, isValid: inputValidity.priorityIsValid},
          {input: date, isValid: inputValidity.dateIsValid}
        ]

        let inputsAreValid = formInputsAfterValidation.every((e) => {
          return e.isValid === true;
        });

        if (inputsAreValid) {
          const taskItem = new TaskItem();
          taskItem.title = title.value.trim();
          taskItem.description = description.value.trim();
          taskItem.priority = priority.value.trim();
          taskItem.date = date.value.trim();

          Utils.exitModal(modalElements.modal, previousActiveElement);

          const taskEvent = new Event('task_created');
          taskEvent.taskItem = taskItem;
          taskEvent.listID = sectionID;
          document.dispatchEvent(taskEvent);

        }else {
          formInputsAfterValidation.forEach((input) => {
            if(input.isValid == false) {
              input.input.style.borderColor = 'red';
            }else {
              input.input.style.borderColor = ' greeen';
            }
          })
        }
      });


      function checkValidity(value, input) {
        if(value === true) {
          input = true;
        } else if (value === false) {
          input = false;
        }
        return input;
      }

    }
  }

  getBackgroundColor() {
    const bgColorModal = {
      modal: document.querySelector('#colorModal'),
      modalOverlay: document.querySelector('#colorModal__overlay'),
      closeButton: document.querySelector('#closeButton3'),
      cancelButton: document.querySelector('#cancelButton3'),
      submitButton: document.querySelector('#okButton'),
      form: document.querySelector('#colorModal__form'),
    }

    bgColorModal.form.addEventListener('submit', e => {
      e.preventDefault();
    })

    let previousActiveElement = document.activeElement;

    document.querySelector('#openColor').addEventListener('click', Utils.displayModal(bgColorModal));

    bgColorModal.submitButton.addEventListener('click', saveColor);

    function saveColor () {
      const bgColor = document.querySelector('#color-picker').value;
      document.querySelector('body').style.backgroundColor = bgColor;
      Utils.saveToLocalStorage('color', bgColor);
      Utils.exitModal(bgColorModal.modal, previousActiveElement);
    }
  }

  getUserImage() {
    const imgUploadModal = {
      modal: document.querySelector('#imgUploadModal'),
      modalOverlay: document.querySelector('#imgUploadModal__Overlay'),
      closeButton: document.querySelector('#closeButton2'),
      cancelButton: document.querySelector('#cancelUploadButton'),
      submitButton: document.querySelector('#uploadButton'),
      form: document.querySelector('#imgUploadModal__form'),
    }

    let previousActiveElement = document.activeElement;

    document.querySelector('a').addEventListener('click', e => {
      e.preventDefault();
    });

    Utils.displayModal(imgUploadModal);
    let imageUploaded = '';

    document.querySelector('#avatar').addEventListener('change', function () {
       const reader = new FileReader();

       reader.addEventListener('load', () => {
          imageUploaded = reader.result;
       });
       reader.readAsDataURL(this.files[0]);
    });

    imgUploadModal.submitButton.addEventListener('click', () => { 
        if(imageUploaded != ''){
            Utils.saveToLocalStorage('recent-avatar', imageUploaded);
            document.querySelector('#user-profile-img').setAttribute('src', imageUploaded);
        }
        Utils.exitModal(imgUploadModal.modal, previousActiveElement);
    });
  }
}

class Model {
  constructor() {
    console.log("model created");
    document.addEventListener('task_created', e => this.postTask(e));
  }

  postTask(e){
    const PROJECT_TITLE = "sturdy-torpid-throat";
    const ACCESS_TOKEN = "5b1064585f4ab8706d275f90";
    const URL = `https://${PROJECT_TITLE}.glitch.me/api/items?accessToken=${ACCESS_TOKEN}`;

    const taskToSend = {
      title: e.taskItem.title,
      listId: e.listID,
      description: e.taskItem.description,
      priority: e.taskItem.priority,
      dueDate: e.taskItem.date,
    };

    const config = {
      method: "POST",
      body: JSON.stringify(taskToSend),
      headers: {
        "content-type": "application/json",
      },
    }

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
    

    const postEvent = new Event('task_posted');
    postEvent.taskItem = e.taskItem;
    postEvent.sectionID = e.listID;
    document.dispatchEvent(postEvent);
  }
}

class View {
  constructor() {
    console.log("view created");
    document.addEventListener("task_loaded", (e) => this.display(e));
    document.addEventListener('task_posted', (e) => this.addTaskToSection(e));
  }

  addTaskToSection(e) {
    const sections = document.querySelectorAll('section');
    const articleHTML = `
    <article class="task">
        <p class="task__priority" data-priority="${e.taskItem.priority.toLowerCase()}">${e.taskItem.priority}</p>
        <h3>${e.taskItem.title}</h3>
        <p>${e.taskItem.description}</p>
        <p class="task__date"><time datetime="2021-08-07">${e.taskItem.date}</time></p>
      </article>
    `;
    sections[e.sectionID-1].querySelector('header').insertAdjacentHTML('afterend', articleHTML);
  }

  display(e) {
    e.taskLists.forEach((list) => {
      const sectionHTML = `
      <section data-id = "${list.id}">
      <header>
      <h2>${list.title}</h2>
      <button class = 'add-task-btn'>Task</button>
      </header>
      </section>
      `;

      document.querySelector("main").insertAdjacentHTML("beforeend", sectionHTML);
    });

    const sections = document.querySelectorAll("section");

    for (let i = 0; i < e.taskLists.length; i++) {
      e.taskLists[i].items.sort(function (a, b) {
        return b.id - a.id;
      });

      e.taskLists[i].items.forEach((item) => {
        const articleHTML = `
          <article class="task">
              <p class="task__priority" data-priority="${item.priority.toLowerCase()}">${
          item.priority
        }</p>
              <h3>${item.title}</h3>
              <p>${item.description}</p>
              <p class="task__date"><time datetime="2021-08-07">${
                item.dueDate
              }</time></p>
          </article>`;
        sections[i].insertAdjacentHTML("beforeend", articleHTML);
      });
    }
  }
}

(() => {
  const app = App.getInstance();
})();
