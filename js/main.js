class App {
    constructor() {
        this.controller = new Controller();
        console.log('app started successfully.');
        this.removeTasks();
    }

    static getInstance = () => {
        if(!App.instance) {
            App.instance = new App();
            return App.instance;
        }else {
            throw ('App already running.');
        }
    }

    removeTasks = () => {
        const articles = document.querySelectorAll('article');
        articles.forEach((article) => {
            article.remove();
        })
    }
}

// Controller
class Controller {
    constructor() {
        this.base = 'https://sturdy-torpid-throat.glitch.me/api/';
        this.accessToken = '5b1064585f4ab8706d275f90';
        this.URL = `${this.base}lists?accessToken=${this.accessToken}`
        this.getMethod = { method: 'GET' }
        this.loadData();
        this.addEventListeners();
        this.model = new Model();
        this.view = new View();
    }

    loadData = () => {
        Utils.fetchData(this.URL, this.getMethod);
    }

    addEventListeners = () => {
        const buttons = Array.from(document.querySelectorAll('button'));

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                let title = '';

                Utils.createModal();
                Utils.preventDefault();

                window.addEventListener('scroll', Utils.disableScroll);

                switch(buttons.indexOf(btn)) {
                    case 0: 
                    title = 'Backlog';
                    break;
                    case 1:
                    title = 'Implementation';
                    break;
                    case 2:
                    title = 'Complete';
                    break;
                }

                // Remove modal when cancel button is clicked
                document.querySelector('#cancel').addEventListener('click', () => {
                    document.querySelector('#modal').remove();
                    window.removeEventListener('scroll', Utils.disableScroll);
                });

                // Capture data after submit button is clicked
                document.querySelector('#submit').addEventListener('click', () => {
                    const task = new Task();
                    task.title = document.querySelector('#task-title').value;
                    task.description = document.querySelector('#task-description').value;
                    task.priority = document.querySelector('#task-priority').value;
                    task.date = document.querySelector('#task-date').value;

                    const evt = new Event('data_captured');
                    evt.title = title;
                    evt.task = task;
                    document.dispatchEvent(evt);

                    document.querySelector('#modal').remove();
                    window.removeEventListener('scroll', Utils.disableScroll);
                });

            });
        });
    }
}

// Model
class Model {
    constructor(){
        document.addEventListener('data_loaded', e => this.process(e));
    }

    process = (e) => {

        let backlogTasks;
        let implementationTasks;
        let completeTasks;

        if (e.type == 'data_loaded'){
            for(let i = 0; i < e.data.length; i++) {
                switch (e.data[i].title) {
                    case 'Backlog':
                        backlogTasks = Utils.createTasks(e.data[0].items);
                        backlogTasks[0].priority = 'High';
                        backlogTasks[1].priority = 'High';
                        backlogTasks[2].priority = 'Low'
                        break;
                    case 'Implementation':
                        implementationTasks = Utils.createTasks(e.data[1].items);
                        implementationTasks[0].priority = 'High';
                        implementationTasks[1].priority = 'Low';
                        implementationTasks[2].priority = 'Medium';
                        break;
                    case 'Complete':
                        completeTasks = Utils.createTasks(e.data[2].items);
                        completeTasks[0].priority = 'High';
                        completeTasks[1].priority = 'Medium';
                        completeTasks[2].priority = 'Low';
                        break
                    default:
                }
            }  
            
            const evt = new Event('data_processed');
            evt.backlog = backlogTasks;
            evt.implementation = implementationTasks;
            evt.complete = completeTasks;
            document.dispatchEvent(evt);

        }
    }
}

// View
class View {
    constructor() {
        document.addEventListener('data_processed', e => this.displayData(e));
        document.addEventListener('data_captured', e => this.displayData(e));
    }

    displayData = (e) => {
        const sections = document.querySelectorAll('section');
        // const articles = document.querySelectorAll('article');   

        if(e.type == 'data_processed') { 
            // // Remove articles
            // articles.forEach((article) => {
            //     article.remove();
            // })

            const tasks = [e.backlog, e.implementation, e.complete];

            tasks.forEach((el) => {
                el.forEach((task) => {
                    sections[tasks.indexOf(el)].appendChild(Utils.createTask(task));
                });
            })
        }else {
            switch(e.title) {
                case 'Backlog':
                sections[0].appendChild(Utils.createTask(e.task));
                break;
                case 'Implementation':
                sections[1].appendChild(Utils.createTask(e.task));
                break;
                case 'Complete':
                sections[2].appendChild(Utils.createTask(e.task));
                break;
                default:
            }
        }

        

        // Click to view task
        sections.forEach((section) => {
            section.addEventListener('click', (e) => {
                if (e.target.nodeName == 'ARTICLE') {
                    const taskModal = document.createElement('div');
                    taskModal.setAttribute('id', 'task-modal');
                    taskModal.innerHTML = `
                        ${e.target.innerHTML}
                        <button id='close'>Close</button>
                    `
                    document.querySelector('main').appendChild(taskModal);
                }
            })
        });

    }
}

// Start application
(() => {
const app = App.getInstance();
})();