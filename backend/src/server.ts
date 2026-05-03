import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import cors from 'cors'
import router from "./routers/game.router";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json())

app.use("/", router);

app.get('/', (req, res) => {res.send("Hello world!")})
app.listen(PORT, () => console.log(`Express running on port ${PORT}!`))