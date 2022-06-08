
const router = require("express").Router();     // route
const fetch = require('cross-fetch');           // module pour faire des requêtes
const config = require("../config.json")        // variables globales du projet

var dbclient = require("../singleton");         // connection à la BDD
router.get("/guild/:id/members",async (req,res) => {        // fonction qui retourne la liste des membres en fonction d'un id d'un serveur
    
    dbclient = require("../singleton");         // connection à la BDD

   const db = await dbclient.db("Dynamo").collection("guild");  // db
   const id = req.params.id;        // id

   if(!id ||id.length == 0)     // si l'id est inexistant , arrête la fonction
   {
       return res.sendStatus(401);
   }

   const query = await db.findOne({id:id});     // requête dans la BDD
   res.setHeader("Access-Control-Allow-Origin","*");        // header obligatoire pour spécifier que la requête peut être faite de n'importe ou 
  
   res.send(query.users != null && query != null ? query.users : {error:"id not match in db"});     // retour du resultat de la requête 
})

router.get("/guild/:id/commands",async (req,res) => {   // fonction qui la liste des commandes d'un serveur en fonction de son id
    dbclient = require("../singleton");     // connection à la BDD

   const db = await dbclient.db("Dynamo").collection("guild");  // db
   const id = req.params.id;        // id

   if(!id ||id.length == 0)  // si l'id est inexistant , arrête la fonction
   {
       return res.sendStatus(401);
   }

   
   const query = await db.findOne({id:id});     // requête
   res.setHeader("Access-Control-Allow-Origin","*");     // header obligatoire pour spécifier que la requête peut être faite de n'importe ou 
   try
   {
    // try catch si l'api de discord retoure une erreur , query,commands n'existe pas   

    res.send(query.commands);       // envoie de la reponse
   }
   catch(error)
   {
       console.log(error)       // s'il y a erreur
    res.send({error:"error"})
   }
})
   router.post("/guild/:id/command/:cmdName/delete",async (req,res) => {        // fonction qui supprime une commande en fonction de son nom

    dbclient = require("../singleton");     // connection à la BDD

   const db = await dbclient.db("Dynamo").collection("guild");      //db
   const id = req.params.id;        //id
   const prefix = req.params.cmdName.substring(0,1);        //prefix de la commande
   const name = req.params.cmdName.substring(1,req.params.cmdName.length);  // nom de la commande

   if(!id || id.length == 0)       // si l'id n'existe pas arrête la fonction
   {
       return res.sendStatus(401);
   }
   
   const query2 = await db.updateOne({id:id,},{$pull:{"commands":{"name":name,"prefix":prefix}}});      // requête de suppression dans le serveur concerné

   res.setHeader("Access-Control-Allow-Origin","*");    // header obligatoire pour spécifier que la requête peut être faite de n'importe ou 
  
   return res.send(query2); //retour du resultat

  
})

router.post("/guild/:id/commands/add",async (req,res) => {      // fonction qui ajoute une commande dans la BDD
    
    dbclient = require("../singleton");     // connection
    
   const db = await dbclient.db("Dynamo").collection("guild");      // db

   // corps de la requête
   //========================
   const id = req.params.id;
   const name = req.body.name;
   const prefix = req.body.prefix;
   const content = req.body.content;
   const creator = req.body.creator;
   const description = req.body.description;
    
   
    // ajout des différents headers nécessaires
    res.setHeader("Access-Control-Allow-Origin","*");// header obligatoire pour spécifier que la requête peut être faite de n'importe ou 
    res.setHeader("Access-Control-Allow-Headers","Content-type");   //header qui spécifie quel headers sont autorisés dans la requête , pour le coup content-type qui spécifie le type de contenu du corps
    
   if(!name || !prefix || !content || !id || !description) return res.sendStatus(401);    // s'il manque un champ ,  arr'ete la fonction
   
   
   const query = await db.updateOne({id:id},{$push:{"commands":{...req.body}}});        // requête d'ajout
   console.log(query);
   
   return res.status(201).json({"created":"true"});     // retour du resulat

  
})



module.exports = router;        // exportation du module

