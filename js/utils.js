class Utils {
  constructor() {}

  // Method to disable srcoll
  static disableScroll() {
    window.scrollTo(0, 0);
  }

  // Method to prevent default
  static preventDefault() {
    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }

  // Method to create Modal
  static displayModal() {
    // Display Modal
    const main = document.querySelector("main");
    const modalHTML = `
      <div id = "modal">
      <form action = "" method = "POST"> 
          <h2>Add Task</h2>
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

    main.insertAdjacentHTML("beforeend", modalHTML);
  }
}
