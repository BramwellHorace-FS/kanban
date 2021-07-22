class App {
  constructor() {
    console.log("App started successfully.");
    this.controller = new Controller();
  }

  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
      return App.instance;
    } else {
      throw "App is already running.";
    }
  }
}

class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.projectName = "sturdy-torpid-throat";
    this.accessToken = "5b1064585f4ab8706d275f90";
    this.loadData();
    document
      .querySelector("main")
      .addEventListener("click", (e) => this.gatherData(e));
  }

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
    if (e.target.parentElement.parentElement.nodeName == "SECTION") {
      const id = e.target.parentElement.parentElement.dataset.id;
      // Display Modal
      const main = document.querySelector("main");
      const modalHTML = `
        <div id = "modal">
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
        </div>
      `;
      main.insertAdjacentHTML("beforeend", modalHTML);

      // disable scroll
      window.addEventListener("scroll", Utils.disableScroll);

      // modal buttons (submit)
      document.querySelector("#submit").addEventListener("click", (e) => {
        Utils.preventDefault();

        // Gather data
        const taskItem = new Task();
        taskItem.title = document.querySelector("#task-title").value;
        taskItem.description =
          document.querySelector("#task-description").value;
        taskItem.priority = document.querySelector("#task-priority").value;
        taskItem.date = document.querySelector("#task-date").value;

        // Custom event
        const evt = new Event("data_captured");
        evt.projectName = this.projectName;
        evt.accessToken = this.accessToken;
        evt.id = id;
        evt.task = taskItem;
        document.dispatchEvent(evt);

        window.removeEventListener("scroll", Utils.disableScroll);
        document.querySelector("#modal").remove();
      });

      // Cancel button
      document.querySelector("#cancel").addEventListener("click", (e) => {
        window.removeEventListener("scroll", Utils.disableScroll);
        document.querySelector("#modal").remove();
      });
    }
  }
}

class Model {
  constructor() {
    document.addEventListener("data_captured", (e) => this.process(e));
  }

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

    const config = {
      method: "POST",
      body: JSON.stringify(taskToSend),
      headers: {
        "content-type": "application/json",
      },
    };

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
  }
}

class View {
  constructor() {
    document.addEventListener("data_loaded", (e) => this.displayData(e));
  }

  displayData(e) {
    const main = document.querySelector("main");
    e.data.forEach((list) => {
      const sectionHTML = `
        <section data-id = "${list.id}">
            <header>
                <h2>${list.title}</h2>
                <button>Task</button>
            </header>
        </section>
        `;
      main.insertAdjacentHTML("beforeend", sectionHTML);
    });

    const sections = document.querySelectorAll("section");

    for (let i = 0; i < e.data.length; i++) {
      e.data[i].items.forEach((item) => {
        const articleHTML = `
          <article class="task">
                <p class="task__priority" data-priority="${item.priority.toLowerCase()}">${item.priority}</p>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <p class="task__date"><time datetime="2021-08-07">${item.dueDate}</time></p>
            </article>
          `;

        sections[i].firstElementChild.insertAdjacentHTML('afterend',articleHTML);
      });
    }
  }
}

// Start app
(() => {
  const app = App.getInstance();
})();