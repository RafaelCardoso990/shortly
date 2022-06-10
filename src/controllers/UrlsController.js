import db from "../db.js";
import {nanoid} from "nanoid"

export async function setUrl(req,res){
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer", " ").trim();
    const {urls} = req.body

    if(!authorization){
        return res.sendStatus(401)
    }

    try{
        const tokenUser = await db.query(`SELECT * 
        FROM sessions
        WHERE sessions."token" = $1`, [token])

        if(!tokenUser){
            return res.sendStatus(401)
        }       
        const id = tokenUser.rows[0].userId
        console.log(id)
        const shortUrl = nanoid(10)

        await db.query(`INSERT INTO urls (url, "shortUrl", "userId", "visitCount") VALUES ($1,$2,$3,$4)`,[urls, shortUrl, id, 0 ])

        res.status(201).send(shortUrl)
    } catch(err){

        res.status(422).send(err.detail)
    }
}

export async function getUrl(req,res){
    const {id} = req.params
    
    try{
        const urls = await db.query(`SELECT id, "shortUrl", url
        FROM urls
        WHERE urls."id" = $1`, [id])
        

        if(urls.rows[0] === undefined){
            return res.sendStatus(404)
        }

        res.status(200).send(urls.rows[0])
    } catch(err){
        res.status(422).send(err.detail)
    }
}

export async function getShortUrl(req,res){
    const {shortUrl} = req.params

    try{
        await db.query(`UPDATE urls SET "visitCount" = "visitCount" + 1 WHERE "shortUrl" = $1;`, [shortUrl])
        const url = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1;`, [shortUrl])
        
        if(url.rows[0] === undefined){
            return res.sendStatus(404)
        }
        res.redirect(`${url.rows[0].url}`)


    }catch(err){
        res.status(500).send(err.detail)
    }
}

export async function deleteUrl(req,res){
    const {id} = req.params
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer", " ").trim();       
    
    if(!authorization){
        return res.sendStatus(401)
    }

    try{
        const userId = await db.query(`SELECT "userId" 
        FROM sessions
        WHERE sessions."token" = $1`, [token])

     
        if(userId.rows[0] === undefined){
            return res.sendStatus(401)
        }            

        const urlId = await db.query(`SELECT *
        FROM urls
        WHERE urls."id" = $1`, [userId.rows[0].userId])

        
        if(urlId.rows[0].userId !== userId.rows[0].userId){
            res.sendStatus(401)
        }

        if(urlId.rows[0].shortUrl === undefined){
            res.sendStatus(404)
        }

        await db.query(`DELETE FROM URLS WHERE urls."id" = $1`, [id])

        res.sendStatus(204)
    } catch(err){
        res.status(500).send(err.detail)
    }
}

