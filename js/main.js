// Application
class App {
    constructor() {
        this.controller = new Controller();
    }

    static getInstance () {
        if(!App.instance) {
            App.instance = new App();
            return App.instance;
        }else {
            throw "App is already running!";
        }
    }
}

class Controller {
    constructor () {
        this.loadData();
        this.model = new Model();
        this.view = new View();
        this.buttons = document.querySelectorAll('button');
        this.buttons[0].addEventListener('click', this.displayModal);
        this.buttons[1].addEventListener('click', this.displayModal);
        this.buttons[2].addEventListener('click', this.displayModal);
    }

    loadData = () => {
        const base = 'https://sturdy-torpid-throat.glitch.me/api/';
        const accessToken = '5b1064585f4ab8706d275f90';
        const URL = `${base}lists?accessToken=${accessToken}`;

        // Method
        const option = { method: 'GET'}

        // Fetch
        fetch(URL, option)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }else {
                    throw response
                }
            })
            .then (data => {
                const evnt = new Event('loaded_data');
                evnt.data = data;
                document.dispatchEvent(evnt);
            })
            .catch(err => {
                console.log(err)
            })
    }

    displayModal = () => {
        // create element
        const modal = document.createElement('div');
        const main = document.querySelector('main');

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
        main.appendChild(modal);

        const cancelBtn = document.querySelector('#cancel').addEventListener('click', this.closeModal);
        const form = document.querySelector('form');
        form.addEventListener('submit', e => {
            evt.preventDefault();
        });

        const submitBtn = document.querySelector('#submit').addEventListener('click', this.captureData);
    }

    closeModal = () => {
        document.querySelector('#modal').remove();
    }

    captureData = () => {
        
    }
}


class Model {
    constructor() {
        document.addEventListener('loaded_data', e => this.processData(e))
    }

    processData = (e) => {
        const backlog = [];
        const implementation = [];
        const complete = [];
        const priority = ['high', 'low', 'medium'];


        // Process backlog data
        e.data[0].items.forEach((task, index) => {
            let newTask = new Task();
            newTask.title = task.title;
            newTask.description = task.description;
            newTask.date = task.dueDate;

            // set priority
            switch (index) {
                case 0: 
                    newTask.priority = priority[0]; 
                break;
                case 1: 
                    newTask.priority = priority[2];
                break;
                case 2:
                    newTask.priority = priority[0];
                break;
            }

            backlog.push(newTask);
        });

        // Process implementation 
        e.data[1].items.forEach((task, index) => {
            let newTask = new Task();
            newTask.title = task.title;
            newTask.description = task.description;
            newTask.date = task.dueDate;

            // set priority
            switch (index) {
                case 0: 
                    newTask.priority = priority[1]; 
                break;
                case 1: 
                    newTask.priority = priority[0];
                break;
                case 2:
                    newTask.priority = priority[2];
                break;
            }
            implementation.push(newTask);
        });


        // Process complete 
        e.data[2].items.forEach((task, index) => {
            let newTask = new Task();
            newTask.title = task.title;
            newTask.description = task.description;
            newTask.date = task.dueDate;
            complete.push(newTask);

            // set priority
            switch (index) {
                case 0: 
                    newTask.priority = priority[0]; 
                break;
                case 1: 
                    newTask.priority = priority[0];
                break;
                case 2:
                    newTask.priority = priority[2];
                break;
            }
        });

        // Event
        const evnt = new Event('data_processed');
        evnt.backlog = backlog;
        evnt.implementation = implementation;
        evnt.complete = complete;
        document.dispatchEvent(evnt);
    }
}


class View {
    constructor() {
        document.addEventListener('data_processed', e => this.displayData(e));
    }

    displayData = (e) => {
        const sections = document.querySelectorAll('section');
        const articles = document.querySelectorAll('article');
        
        // Remove articles
        articles.forEach((article) => {
            article.remove();
        })

        // 
        e.backlog.forEach((task) => {
            const newTask = document.createElement('article');
            newTask.setAttribute("class", "task");
            newTask.innerHTML = `
                <p class="task__priority" data-priority="${task.priority}">${task.priority}</p>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p class="task__date"><time datetime="2021-08-07">${task.date}</time></p> 
            `;

            sections[0].appendChild(newTask);
        })

        e.implementation.forEach((task) => {
            const newTask = document.createElement('article');
            newTask.setAttribute("class", "task");
            newTask.innerHTML = `
                <p class="task__priority" data-priority="${task.priority}">${task.priority}</p>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p class="task__date"><time datetime="2021-08-07">${task.date}</time></p> 
            `;

            sections[1].appendChild(newTask);
        })


        e.complete.forEach((task) => {
            const newTask = document.createElement('article');
            newTask.setAttribute("class", "task");
            newTask.innerHTML = `
                <p class="task__priority" data-priority="${task.priority}">${task.priority}</p>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p class="task__date"><time datetime="2021-08-07">${task.date}</time></p> 
            `;
            sections[2].appendChild(newTask);
        })

    }
}


// Start application
(() => {
const app = App.getInstance();
})();