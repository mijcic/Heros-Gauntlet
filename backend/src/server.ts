import express from 'express'
import cors from 'cors'
import router from "./routers/game.router";

const app = express()

app.use(cors({
  origin: "http://localhost:4200"
}));
app.use(express.json())

app.use("/", router);

app.get('/', (req, res) => {res.send("Hello world!")})
app.listen(4000, () => console.log("Express running on port 4000!"))