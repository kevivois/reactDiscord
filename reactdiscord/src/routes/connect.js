
const router = require("express").Router();     // route
const config = require("../config.json")        // variables globales du projet

router.get("/:id",(req,res) => {        // fonction qui redirige l'utilisateur pour se connecter à discord
    
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${config.CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${req.params.id}`);
    
   
})
module.exports = router;        // exportation du module