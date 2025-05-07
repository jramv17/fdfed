const express = require("express");
const logger = require("./config/logger");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const Iointialize = require("./Controllers/socket");
const Auth = require("./Routes/UserAuthRouter");
const GoogleStrategy = require("./Routes/GoogleAuthRouter");
const JwtVerifyRouter = require("./Routes/JwtVerifyRouter");
const CreateRoom = require("./Routes/CreateRoomRouter");
const Rooms = require("./Routes/RoomRouter");
const JoinRoom = require("./Routes/JoinRoomRouter");
const RoomDetails = require("./Routes/RoomDetailsRouter");
const CreateRoomComplaint = require("./Routes/UserComplaintRouter");
const SecurityLog = require("./Routes/LogRouter");
const Dashboard = require("./Routes/DashBoardRouter");
const isRoleVerify = require("./Routes/RoleVerification");
const Annoucement = require("./Routes/AnnouncementRoute");
const Admin = require("./Routes/AdminRouter");
const Payment = require("./Routes/PaymentRouter");
const PostRouter = require("./Routes/PostRouter");
const path = require("path");
const { config } = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

class App extends Iointialize {
    constructor() {
        config();
        super();
        console.log(process.env.CLIENT_URL);
        console.log(process.env.CLIENT_URL);
        this.cors = {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
            optionSuccessStatus: 200,
        };
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = require("socket.io")(this.server, {
            cors: {
                origin: process.env.CLIENT_URL,
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                credentials: true,
            },
            connectionStateRecovery: {},
        });
        this.setMiddleware(this.cors);
        this.setRoutes();
        this.initializeSocket();
    }

    setMiddleware(corsOptions) {
        // ✅ 1. CORS FIRST
        this.app.use(cors(corsOptions));
        this.app.options("*", cors(corsOptions)); // Preflight handling
    
        // ✅ 2. Other middlewares
        const morganFormat = ":method :url :status :response-time ms";
        this.app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(swaggerSpec));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(passport.initialize());
        
        // ✅ 3. Logger
        this.app.use(
            morgan(morganFormat, {
                stream: {
                    write: (message) => {
                        const logObject = {
                            method: message.split(" ")[0],
                            url: message.split(" ")[1],
                            status: message.split(" ")[2],
                            responseTime: message.split(" ")[3],
                        };
                        logger.info(JSON.stringify(logObject));
                    },
                },
            })
        );
        const options = {
            definition: {
              openapi: "3.0.0",
              info: {
                title: "SocietyLog API",
                version: "1.0.0",
                description: "API documentation for SocietyLog",
              },
              servers: [
                {
                  url: "https://fdfed-server.vercel.app",
                },
              ],
            },
            apis: ["./Routes/*.js"],
          };
          
        const swaggerSpec = swaggerJsdoc(options);
          
          // ✅ Plug this directly into your Express app
        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        // ✅ 4. Static files
        this.app.use(
            "/communitypost",
            express.static(path.join(__dirname, "communitypost"))
        )

        
    
        // ✅ 5. Passport
        require("./config/passport_config");
    }
    

    setRoutes() {
        this.app.use("/user", Auth);
        this.app.use("/auth/google", GoogleStrategy);
        this.app.use("/jwtVerify", JwtVerifyRouter);
        this.app.use("/createRoom", CreateRoom);
        this.app.use("/my-rooms", Rooms);
        this.app.use("/join-room", JoinRoom);
        this.app.use("/room-details", RoomDetails);
        this.app.use("/complaints", CreateRoomComplaint);
        this.app.use("/dashboard", Dashboard);
        this.app.use("/api/residents", SecurityLog);
        this.app.use("/isSuperRole", isRoleVerify);
        this.app.use("/announcement", Annoucement);
        this.app.use("/admin", Admin);
        this.app.use("/payment", Payment);
        this.app.use("/api/posts", PostRouter);
    }

    initializeSocket() {
        this.initSocket(this.io);
    }

    start(port) {
        this.server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

module.exports = App;
