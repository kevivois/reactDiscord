const express = require("express");             // importation d'express
const app = express();                          // declaration de la variable principale de l'api
const PORT = 3001;                              // port sur lequel le server de l'api sera à l'écoute
const session = require("express-session");     // variable pour configuration les cookies
const passport = require("passport");           // variables
const DiscordStrategy = require("../strategies/discordstrategy");       // strategy discord préallablement configurée
const cors = require("cors");                                           // cors pour gérer les cors
const config = require("../config.json");                            // variable de config                       
const authRoute = require("../routes/auth");                // route de l'authentification
const dasboardRoute = require("../routes/dashboard");       // route du dashboard
const connectRoute = require("../routes/connect");          // route de la connection
const settings = require("../routes/settings");             // route des settings
const dbRoute = require("../routes/db")                     // route de la base de donnée
             
app.use(session({           // création d'un cookie , configuration
    secret:"IWUTGHWERZGT",  
    resave:false,
    cookie:{
        maxAge:60000 * 60*24*7      // temps du cookie
    },
    saveUninitialized:false,
    name:"discord.oauth2"       // nom
}));
app.options('*', cors());                       // ajout des cors
app.use(express.urlencoded({extended:true}))    // pour gérer les urls
app.use(express.json());                        // pour gérer le corsp des requête en JSON
app.use(cors({                                  // configuration des cors
    origin:[config.URL_START+"://"+config.URL_ip+":3000"],         
    credentials:true
}))
app.use(passport.initialize());       //initaliton de la strategy pour la connexion discord          
app.use(passport.session());          // configuration pour la connexion discord
app.use("/auth",authRoute);         // ajout de la route de l'authentification

app.use("/dashboard",dasboardRoute);    // ajout de la route pour le dashboard
app.use("/connect",connectRoute);       // ajout de la route pour la connexion
app.use("/settings",settings)           // ajout de la route pour les settings
app.use("/db",dbRoute);                 // ajout de la route pour la DB


app.listen(PORT,() => {     // mise en local du serveur de l'api
    console.log("Ecoute le port " + PORT);

})