const DiscordStrategy = require('passport-discord').Strategy;           // importation de la strategy discord
const passport = require("passport");                                   // importation pour la strategy discord
const config = require("../config.json");                               // importation du fichier des variables globales
const scopes = ["identify","connections","guilds","guilds.members.read"]// defintion des droits qu'a le bot discord sur l'utilisateur qui se connecte

passport.serializeUser((user,done) => {  //methode qui s'execute lorsqu'un utilisateur se connecte
    done(null,user.id);
})
passport.deserializeUser(async(id,done) => {     // methode qui s'execute lorsqu'un utilisateur se deconnecte
    var user = {};
    done(null,user);
    
})
passport.use(new DiscordStrategy({      // creation de la strategy discord
    clientID : config.CLIENT_ID,        // id du bot
    clientSecret:config.CLIENT_SECRET,  // secret du bot    
    callbackURL:config.CLIENT_REDIRECT, // url de redirection lorsque l'utilisateur est connecté
    scope:scopes                        // droit 
},(accessToken,refreshToken,profile,done) => {      // lorsqu'un utilisateur est connecté
    //console.log(profile.username);
    console.log(`User ${profile.username} just connected discord account`);
    var user={id:profile.id,name:profile.name,guilds:profile.guilds,avatar:profile.avatar,connections:profile.connections}  // utilisateur
    
    done(null,user);        // fin de la fonction
    
   

}));  