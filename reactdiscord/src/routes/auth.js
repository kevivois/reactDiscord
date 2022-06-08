const router = require("express").Router();         // route
const passport = require("passport");               // passport discord
const { useParams, useSearchParams } = require("react-router-dom"); // parametres de l'url

router.get("/",passport.authenticate("discord"));       // connection avec la strategy discord
router.get("/redirect",passport.authenticate("discord",{        //execution lorsque l'utilisateur c'est connecté
    failureRedirect:"/",        // si la connection a échoucé
}),(req,res) => {
    // lorsque l'utilisateur est connecté
    res.send(req.user);
    const {code} = useParams();
  
   
    res.redirect(`http://localhost:3000/dashboard/${code})`);       //revenir sur la page d'affichage des serveurs avec un code en paramètre
});

router.get("/logout",(req,res) => {     // lorsque l'utilisateur se déconnecte
    if(req.user)
    {
        req.logout();       // le déconnecter
    }
})

module.exports = router ;       // exportation du module