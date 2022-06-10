import { Router } from "express";
import {getUser, logUser, setUser} from "../controllers/UsersController.js"

const usersRouter = Router();

usersRouter.post("/signup", setUser)
usersRouter.post("/signin", logUser)
usersRouter.get("/users/:id", getUser)

export default usersRouter;