class App {
  constructor() {
    //   confirms app has started successfully
    console.log("App started successfully.");
    this.controller = new Controller();
  }

  // Gets a single instance of the application
  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
      return App.instance;
    } else {
      throw "App is already running.";
    }
  }
}

// Controller
class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.projectName = "sturdy-torpid-throat";
    this.accessToken = "5b1064585f4ab8706d275f90";
    this.loadData();
    document.querySelector("main").addEventListener("click", (e) => this.gatherData(e));
  }

  // method used for loading data from the api
  loadData() {
    const URL = `https://${this.projectName}.glitch.me/api/lists?accessToken=${this.accessToken}`;
    const option = { method: "GET" };

    // Fetch data
    fetch(URL, option)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        const evt = new Event("data_loaded");
        evt.data = data;
        document.dispatchEvent(evt);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Gather data
  gatherData(e) {
    if (e.target.parentElement.nodeName == "HEADER" && e.target.nodeName == "BUTTON") {
      // Display the modal
      Utils.displayModal();
      //  Disable scroll
      Utils.disableScroll();

      // Id used to place new task item in the correct list
      const id = e.target.parentElement.parentElement.dataset.id;

      // Event listener used used to close modal if cancel button is clicked
      document.querySelector("#cancel").addEventListener("click", (e) => {
        // removes the disable scroll event listener
        window.removeEventListener("scroll", Utils.disableScroll);
        // Removes modal
        document.querySelector("#modal").remove();
      });

      // Event listener added to the submit button
      document.querySelector("#submit").addEventListener("click", (e) => {
        Utils.preventDefault();

        // Values from the form
        const title = document.querySelector("#task-title").value.trim();
        const description = document.querySelector("#task-description").value.trim();
        const priority = document.querySelector("#task-priority").value.trim();
        const date = document.querySelector("#task-date").value.trim();

        // if form values are not empty
        if (title != "" && description != "" && priority != "" && date != "") {
          // Re-enable scroll by remove the eventlistener
          window.removeEventListener("scroll", Utils.disableScroll);
          // Remove modal
          document.querySelector("#modal").remove();

          // New task
          const taskItem = new Task();
          taskItem.title = title;
          taskItem.description = description;
          taskItem.priority = priority;
          taskItem.date = date;

          // Custom event
          const evt = new Event("data_captured");
          evt.projectName = this.projectName;
          evt.accessToken = this.accessToken;
          evt.id = id;
          evt.task = taskItem;
          document.dispatchEvent(evt);
        }
      });
    }
  }
}

// Model
class Model {
  constructor() {
    // event listener - recieve data gathered from form
    document.addEventListener("data_captured", (e) => this.process(e));
  }

  // Procress method used to post new task to the API
  process(e) {
    const URL = `https://${e.projectName}.glitch.me/api/items?accessToken=${e.accessToken}`;

    // task to send
    const taskToSend = {
      title: e.task.title,
      listId: e.id,
      description: e.task.description,
      priority: e.task.priority,
      dueDate: e.task.date,
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

    // Custom event, send task to the view
    const evt = new Event("data_processed");
    evt.listID = e.id;
    evt.task = e.task;
    document.dispatchEvent(evt);
  }
}

// View
class View {
  constructor() {
    // Event listener to display loaded items
    document.addEventListener("data_loaded", (e) => this.displayData(e));
    // Event listener to add new task
    document.addEventListener("data_processed", (e) => this.addTask(e));
  }

  // Method used to add new task
  addTask(e) {
    // Sections
    const sections = document.querySelectorAll("section");
    const section = sections[e.listID - 1];
    // New Task HTML
    const taskHTML = `
    <article class="task">
        <p class="task__priority" data-priority="${e.task.priority.toLowerCase()}">${e.task.priority}</p>
        <h3>${e.task.title}</h3>
        <p>${e.task.description}</p>
        <p class="task__date"><time datetime="2021-08-07">${e.task.date}</time></p>
    </article>
    `;
    // Add the task to the dom
    section.firstElementChild.insertAdjacentHTML("afterend", taskHTML);
  }

  // Method used to display loaded data from the API
  displayData(e) {
    const main = document.querySelector("main");

    // Loops through the data and creates a section for each list
    for (let i = e.data.length - 1; i >= 0; i--) {
      // Section HTML
      let sectionHTML = ` 
        <section data-id = "${e.data[i].id}">
            <header>
                <h2>${e.data[i].title}</h2>
                <button>Task</button>
            </header>
        </section>`;

      // Add the section
      main.insertAdjacentHTML("afterbegin", sectionHTML);
    }

    // Sections
    const section = document.querySelectorAll("section");

    // Loop through each list and adds items to each list section
    for (let i = e.data.length - 1; i >= 0; i--) {
      //  sort items by highest to lowest
      const tasks = e.data[i].items;
      tasks.sort(function (a, b) {
        return b.id - a.id;
      });

      //  Add items to the DOM
      tasks.forEach((task) => {
        const articleHTML = ` 
            <article class="task">
                <p class="task__priority" data-priority="${task.priority.toLowerCase()}">${task.priority}</p>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p class="task__date"><time datetime="2021-08-07">${task.dueDate}</time></p>
            </article>
        `;
        section[i].insertAdjacentHTML("beforeend", articleHTML);
      });
    }
  }
}

// Start app
(() => {
  const app = App.getInstance();
})();
