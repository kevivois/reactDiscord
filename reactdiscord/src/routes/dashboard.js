
const router = require("express").Router();     // route
const fetch = require('cross-fetch');           // module pour faire des requêtes
const config = require("../config.json")        // variables globales du projet

router.get("/guild/:id",async (req,res) => {    // fonction qui s'exécute pour récuperer un serveur complet en fonction d'un id  en paramètre
    const id = req.params.id;       // id
    

    const query = await fetch(`https://discord.com/api/guilds/`+id,{        // requête à l'api discord pour recuperer le serveur complet
                 headers:{
                     "Authorization":`Bot ${config.BOT_TOKEN}`      // authorisation à mettre dans les headers, le bot discord doit être sur le serveur
                 }
    })
    const response = await query.json();        // reponse
    res.setHeader("Access-Control-Allow-Origin","*");       // ajout d'un headder pour gérer les cors, autoriser les requête depuis n'importe quel origine
    res.send(response);     // renvoie de la réponse
    
})

router.get("/bot/guilds",async (req,res) => {       // fonction qui s'exécute pour récuperer les serveurs sur lequel se trouve le bot
    const query = await fetch(`https://discord.com/api/users/@me/guilds`,{      // requete à l'api discord pour recuperer les serveurs du bot
                 headers:{
                     "Authorization":`Bot ${config.BOT_TOKEN}`  // authorisation à mettre dans les headers token du bot discord
                 }
             })
    const response = await query.json();        // reponse

    res.setHeader("Access-Control-Allow-Origin","*");        // ajout d'un headder pour gérer les cors, autoriser les requête depuis n'importe quel origine
    res.send(response); // renvoie de la reponse
    
    
})


module.exports = router;        // exportation du module

