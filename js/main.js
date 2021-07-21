class App {
  constructor() {
    console.log("App started successfully");
    this.constroller = new Controller();
  }

  // get single instance of the App class
  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
      return App.instance;
    } else {
      throw "App is already running";
    }
  }
}

// Controller
class Controller {
  constructor() {
    // Confirms constructor has been created successfully
    console.log("Controller created.");
    this.model = new Model();
    this.view = new View();
    // project name
    this.projectName = "sturdy-torpid-throat";
    // Access token
    this.accessToken = "5b1064585f4ab8706d275f90";
    // URL to connect to the API combining the base URL and the Access Token
    this.URL = `https://${this.projectName}.glitch.me/api/lists?accessToken=${this.accessToken}`;
    this.postURL = `https://${this.projectName}.glitch.me/api/items?accessToken=${this.accessToken}`;
    // Get method to load list
    this.getMethod = { method: "GET" };
    // Post method to add to a list
    this.postMethod = { method: "POST" };
    // Load Data
    this.loadData();
    this.addEventListers();
  }

  // Method used to lists from the API
  loadData() {
    fetch(this.URL, this.getMethod)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        // Custom event used to pass the data to the model for processing
        const evnt = new Event("data_loaded");
        evnt.data = data;
        document.dispatchEvent(evnt);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //   const taskItem = new Task();
  //   taskItem.listID = e.target.parentElement.parentElement.id;
  //   taskItem.title = document.querySelector('#task-title').value;
  //   taskItem.description = document.querySelector('#description').value;
  //   taskItem.priority = document.querySelector('#task-priority').value;
  //   taskItem.date = document.querySelector('#task-date');

  addEventListers() {
    const main = document.querySelector("main");
    main.addEventListener("click", (e) => {
      if (e.target.nodeName == "BUTTON") {
        this.gatherData();
      }
    });
  }

  gatherData() {
    const modal = `
        <form action = "" method = "POST"> 
            <h2>Add Task</h2>
            <fieldset>
                <label for="task-title">Title</label>
                <input type="text" name="task-title" id="task-title" placeholder="Enter Task Ttile">
            </fieldset>
            <fieldset>
                <label for="task-description">Description</label>
                <textarea name="task-description" id="task-description" cols="50" rows="10" placeholder="Enter task description"></textarea>
            </fieldset>
            <fieldset>
                <label for="task-priority">Task Piority</label>
                <select id="task-priority" name="task-priority">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </fieldset>
            <fieldset>
                <label for="task-date">Date</label>
                <input type="date" id="task-date" name="task-date">
            </fieldset>
            <button type="Submit" id="submit">Submit</button>
            <button id="cancel">Cancel</button>
        </form>
      `;

    document.querySelector("main").insertAdjacentHTML("beforeend", modal);
  }

  postData() {
    const dataToSendToServer = {
      title: "A new todo item",
      listId: 1,
      description: "This is an example of the todo description",
      priority: "High",
      dueDate: "2018-08-05",
    };

    const config = {
      method: "POST",
      body: JSON.stringify(dataToSendToServer),
      headers: {
        "content-type": "application/json",
      },
    };

    fetch(this.postURL, config)
      .then((response) => {
        if (response.ok) {
          // [1]
          return response.json();
        }
        throw response; // [2]
      })
      .then((responseAsJson) => {
        console.log(responseAsJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

// Model
class Model {
  constructor() {
    // Confirms model has been created successfully
    console.log("Model created.");
    // Event listener to recieve data loaded from the API
    document.addEventListener("data_loaded", (e) => this.process(e));
  }
  // method used to process data
  process(e) {}
}

// View
class View {
  constructor() {
    // Confirms view has been created successfully
    console.log("View created.");
    document.addEventListener("data_loaded", (e) => this.display(e));
  }

  display(e) {
    const main = document.querySelector("main");

    e.data.forEach((list) => {
      const section = `
        <section id = "${list.title}">
        <header>
        <h2>
        ${list.title}
        </h2>
        <button>Task</button>
        </header>
        </section>
        `;
      main.insertAdjacentHTML("beforeend", section);
    });

    const sections = document.querySelectorAll("section");

    for (let i = 0; i < e.data.length; i++) {
      if (e.data[i].title == sections[i].id) {
        e.data[i].items.forEach((item) => {
          const article = ` 
            <article class="task">
                <p class="task__priority" data-priority="${item.priority.toLowerCase()}">${
            item.priority
          }</p>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <p class="task__date"><time datetime="2021-08-07">${
                  item.dueDate
                }</time></p> 
            </article>
            `;
          sections[i].insertAdjacentHTML("beforeend", article);
        });
      }
    }
  }
}

// auto start the application
(() => {
  const app = App.getInstance();
})();
