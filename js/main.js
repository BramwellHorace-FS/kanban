// Application
class App {
    constructor() {
        console.log(`App started successfully.`);
        this.controller = new Controller();
    }

    static getInstance = () => {
        if(!App.instance) {
            App.instance = new App();
            return App.instance;
        }else {
            throw "App is already running!";
        }
    }
}

// Controller (Capture data)
class Controller {
    constructor() {
    console.log(`Controller created.`);
    this.model = new Model();
    this.view = new View();
    }


}

// Model (Process Data)
class Model {
    constructor () {
        console.log(`Model created.`);
        this.buttons = document.querySelectorAll('button');
        this.buttonEvent();
    }

    // add button event listeners
    buttonEvent = () => {
        this.buttons.forEach((btn) => {
            btn.addEventListener('click', this.createModal)
        });
    }

    // create modal 
    createModal = () => {
        // create element
        const modal = document.createElement('div');
        // give div an id of modal
        modal.setAttribute("id", "modal");
        // set innerHTML
        modal.innerHTML = `
            <div id='modal__content'>
            <h2>Add Task</h2>
            <form action="" method="post">
            <fieldset>
                <label for="task-title">Title</label>
                <input type="text" name="task-title" id="task-title" placeholder="Enter Task Ttile" required>
            </fieldset>
            <fieldset>
                <label for="task-description">Description</label>
                <textarea name="task-description" id="task-description" cols="50" rows="10" placeholder="Enter task description" required></textarea>
            </fieldset>
            
            <fieldset>
                <label for="task-priority">Task Piority</label>
                <select id="task-priority" name="task-priority" required>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </fieldset>
            <fieldset>
                <label for="task-date">Date</label>
                <input type="date" id="task-date" name="task-date" required>
            </fieldset>
            <button type="Submit" id="submit">Submit</button>
            <button id="cancel">Cancel</button>
            </form>
        </div>
        `;
        // append to main
        document.querySelector('main').appendChild(modal);

    }
}

// Vieiw (Display Data)
class View {
    constructor() {
        console.log(`View created.`);
    }
}


// Start application
(() => {
const app = App.getInstance();
})();