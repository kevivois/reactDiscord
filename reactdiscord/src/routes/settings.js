const router = require("express").Router();     // route
const fetch = require('cross-fetch');           // module pour faire des requêtes
const config = require("../config.json")        // variables globales du projet


router.get("/guild/:id/members",async (req,res) => {        // fonction qui retourne la liste des membres d'un serveur spécifique
    
    
    const id = req.params.id;       // id
    if(id.length == 0)  // si il n'y a pas d'id
    {
        res.send(401);
    }
    const query = await fetch(`https://discord.com/api/guilds/${id}/members?limit=1000`,{       // requête des membres à l'api discord
                 headers:{
                     "Authorization":`Bot ${config.BOT_TOKEN}`      // token du bot 
                 }
    })
    const response = await query.json();        //reponse
    res.setHeader("Access-Control-Allow-Origin","*")
    res.send(response);     // retour de la reponse
    
    
})

router.get("/guild/:id/roles",async (req,res) => {      // fonction qui retourne la liste des roles en fonction d'un serveur spécifique
    
    
    const id = req.params.id;       // id 
    if(id.length == 0)      // si il n'y a pas d'id
    {
        res.send(401);
    }
    const query = await fetch(`https://discord.com/api/guilds/${id}/roles`,{        //requêtes des roles
                 headers:{
                     "Authorization":`Bot ${config.BOT_TOKEN}` // token du bot 
                 }
    })
    const response = await query.json();        //reponse
    res.setHeader("Access-Control-Allow-Origin","*")
    res.send(response);     // retour de la reponse
    
    
})

router.get("/guild/:id/owner",async(req,res) => { // fonction qui retourne les informations concernant le propriétaire d'un serveur
    const id = req.params.id;
    

    const queryGuild = await fetch(`https://discord.com/api/guilds/`+id,{       // requête du serveur
                 headers:{
                     "Authorization":`Bot ${config.BOT_TOKEN}`// token du bot
                 }
    })
    const responseGuild = await queryGuild.json();

    const queryOwner = await fetch("https://discord.com/api/guilds/"+id+"/members/"+responseGuild.owner_id,{        // requête du propiétaire du serveur
        headers:{
            "Authorization":`Bot ${config.BOT_TOKEN}`       // token du bot
        }
    });

    const responseOwner = await queryOwner.json();      // reponse


    res.setHeader("Access-Control-Allow-Origin","*");
    res.send(responseOwner)     // retour de la reponse
    
    
})

router.get("/guild/:id/member/:mbrId",async (req,res) => {      // fonction qui retourne un utilisateur spécifique d'un serveur spécifique
    
    
    const id = req.params.id;       // id   du serveur
    const mbrId = req.params.mbrId;     // id de l'utilisateur
    if(id.length == 0 || mbrId.length == 0) // si les ids sont null , arrête la fonction
    {
        return res.send(401);
    }
    const query = await fetch(`https://discord.com/api/guilds/${id}/members/${mbrId}`,{     // requête
                 headers:{
                     "Authorization":`Bot ${config.BOT_TOKEN}`      // token du bot
                 }
    })
    const response = await query.json();        // reponse
    res.setHeader("Access-Control-Allow-Origin","*")
    res.send(response);     // retour de la reponse
    
    
})
router.get("/user/@me/:token",async (req,res) => { // fonction qui retourne les informations sur l'utilisateur actuel
    
    
    const token = req.params.token;     //token de l'utilisateur 
    if(token.length == 0 )
    {
        res.send(401);
    }
    const query = await fetch(`https://discord.com/api/users/@me`,{ //requête
                 headers:{
                     "Authorization":`Bearer ${token}`  //token de l'utilisateur 
                 }
    })
    const response = await query.json();
    res.setHeader("Access-Control-Allow-Origin","*")
    res.send(response);     // reponse
    
    
})

router.get("/guild/:id/leave",async (req,res) => {  // fonction qui fait quitter le bot discord d'un serveur spécifique
    
    
    const id = req.params.id;       // id
    
    if(id.length == 0 )
    {
        res.send(401);
    }
    const query = await fetch(`https://discord.com/api/users/@me/guilds/${id}`,{method:"delete",headers:{       // requête
        "Authorization":`Bot ${config.BOT_TOKEN}`
    }});
    
    res.setHeader("Access-Control-Allow-Origin","*")
    
    res.sendStatus(query.status)        // reponse
    
    
})


module.exports = router;        // exportation du module

