import db from "../db.js";

export async function getRanking(req,res){
    try{
        const ranking = await db.query(`SELECT users."id", users."name", COUNT(urls."id") as linksCount, SUM("visitCount") AS visitCount
        FROM users
        LEFT JOIN urls ON urls."userId" = users."id"
        GROUP BY users."id"
        ORDER BY visitCount
        LIMIT 10;`)

        res.status(200).send(ranking.rows)
    } catch(err){
        res.status(500).send(err.detail)
    }
}