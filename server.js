const App = require(".");
const DbConfig = require("./config/db_config");
const env_variables = require("./utils/envutils");

class Server {
    constructor() {
        this.appInstance = new App();
        this.dbConfig = new DbConfig(env_variables.MONGO_URI);
        this.port = env_variables.PORT || 3000;
    }
    
    async initialize() {
        try {
            await this.dbConfig.DbConnect();
            this.appInstance.start(this.port);
        } catch (error) {
            console.error("Error during server initialization:", error);
        }
    }
}
new Server().initialize();
