// Application 
class App {
    constructor() {
        console.log(`App started successfully.`);
    }

    getInstance = () => {
        if(!appInstance) {
            appInstance = new App();
            return appInstance;
        }else {
            throw `App is already running.`;
        }
    }


}

// Auto start function
(() => {
 App.getInstance();
})();