class Utils {
    constructor () {}
    
    // Fetch Data
    static fetchData = (url, option) => {

        fetch(url, option)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }else {
                    throw response
                }
            })
            .then (data => {
                const evt = new Event('data_loaded');
                evt.data = data;
                document.dispatchEvent(evt);
            })
            .catch(err => {
                console.log(err)
            });
    }

    // Create collection of tasks
    static createTasks = (array) => {
        const tasks = [];
        
        array.forEach((e) => {
            const task = new Task();
            task.title = e.title;
            task.description = e.description;
            task.priority = e.priority;
            task.date = e.dueDate;
            tasks.push(task);
        });

        return tasks;
    }

    // Create Modal
    static createModal = () => {
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

        // append to main
        main.appendChild(modal);
    }


    // Create a single task
    static createTask = (arg) => {
        const task = document.createElement('article');
        task.setAttribute('class','task');
        task.innerHTML = `
            <p class="task__priority" data-priority="${arg.priority.toLowerCase()}">${arg.priority}</p>
            <h3>${arg.title}</h3>
            <p>${arg.description}</p>
            <p class="task__date"><time datetime="2021-08-07">${arg.date}</time></p> 
        `;

        return task;
    }

    // Prevent default
    static preventDefault = () => {
        const form = document.querySelector('form');
        form.addEventListener('submit', e => {
        e.preventDefault();
        });
    }

    // Prevent scroll
    static disableScroll = () => {
        window.scrollTo(0,0);
    }
}