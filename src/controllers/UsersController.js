import db from "../db.js";
import bcrypt from "bcrypt";
import {v4} from "uuid";

export async function setUser(req,res){
    const {name, email, password, confirmPassword} = req.body

    try{

        if( confirmPassword != password){
            return res.status(422).send("Senhas não conferem.")
        }
        const passwordCrypt = bcrypt.hashSync(password, 10)

        await db.query('INSERT INTO users (name, email, password) VALUES($1,$2,$3)', [name, email, passwordCrypt])

        res.status(201).send("Cadastro feito com sucesso.")

    } catch(err){
        console.log(err);
        res.status(422).send(err.detail);
    }
}

export async function logUser(req,res){
    const user = req.body

    try {
        const emailUser = await db.query(`SELECT  * 
        FROM users
        WHERE users."email" = $1;`, [user.email])

        if(!emailUser){
            return res.sendStatus(401)
        }
        
        if(bcrypt.compareSync(user.password, emailUser.rows[0].password)){            
            const token = v4()
            await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1,$2)`, [token, emailUser.rows[0].id]);
            res.status(200).send(token)
        }else{
            res.sendStatus(422)
        }
       

    } catch(err){
        console.log(err);
        res.status(422).send(err.detail);
    }
}

export async function getUser(req,res){
    const {id} = req.params
  
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer", " ").trim();       
    
    if(!authorization){
        return res.sendStatus(401)
    }

    try{
        const urls = await db.query(`SELECT urls."id", urls."shortUrl", urls."url", urls."visitCount" FROM users
        JOIN urls ON users."id" = urls."userId"
        WHERE users."id" = $1`, [id])
        
        const user = await db.query(`SELECT users."id", users."name", SUM("visitCount") AS visitCount
        FROM users
        JOIN urls ON urls."userId" = users."id"
        WHERE users."id" = $1
        GROUP BY users."id";`, [id])

        if(user.rows === undefined){
            res.sendStatus(404)
        }

        const object = {
            id: user.rows[0].id,
            name: user.rows[0].name,
            visitcount: user.rows[0].visitcount,
            shortenedUrls: urls.rows
        }
        
        res.status(200).send(object)

    } catch(err){
        res.status(500).send(err.detail)
    }
}
