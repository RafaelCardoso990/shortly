import express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./src/routes/UsersRouter.js";
import urlsRouter from "./src/routes/UrlsRouter.js";
import rankingRouter from "./src/routes/RankingRouter.js";

dotenv.config();

const app = express();

app.use(cors())
app.use(express.json())
app.use(usersRouter)
app.use(urlsRouter)
app.use(rankingRouter)



app.listen(process.env.PORT , () => {
    console.log(`Server started on port ${process.env.PORT}`)
})