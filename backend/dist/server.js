"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var game_router_1 = __importDefault(require("./routers/game.router"));
var app = express_1.default();
app.use(cors_1.default({
    origin: "http://localhost:4200"
}));
app.use(express_1.default.json());
app.use("/", game_router_1.default);
app.get('/', function (req, res) { res.send("Hello world!"); });
app.listen(4000, function () { return console.log("Express running on port 4000!"); });
