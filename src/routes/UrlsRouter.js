import { Router } from "express";
import { deleteUrl, getShortUrl, getUrl, setUrl } from "../controllers/UrlsController.js";

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", setUrl)
urlsRouter.get("/urls/:id", getUrl)
urlsRouter.get("/urls/open/:shortUrl", getShortUrl)
urlsRouter.delete("/urls/:id", deleteUrl)

export default urlsRouter;