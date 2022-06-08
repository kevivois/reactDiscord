
// importations

import { useEffect, useState } from "react";
import config from "../config.json";        // variables globales
import Guild from "../class/DiscordGuild"   // style de la guild
import {body,guildsStyle} from "../style/dashboardStyle";       // style du fichier
import { useLayoutEffect } from "react";            // fonction utile
import Banner from "../style/banner";       // style de la banniere



export default function Dashboard()
{
    const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));      // paramètres de l'url
    const [token,setToken] = useState(localStorage.getItem("token") == "undefined" ? "" : localStorage.getItem("token"));       // recuperation du token
    const [code,setCode] = useState(searchParams.get("code"));          // parametre utile pour les requête
    const [guilds,setGuilds] = useState([]);            // listes des serveurs de l'utilisateur 
    const [clientGuilds,setClientGuilds] = useState([]);
    
    const queryClientGuilds = async () => {     // fonction pour faire une requête pour récuperer la liste des serveurs de l'utilisateur
        
        if(clientGuilds.length === 0)   // si la liste est vide
        {
             const query = await fetch(`http://${config.URL_IP}:3001/dashboard/bot/guilds`);        // requête à notre api 
     
             const response = await query.json();
             
             if(response.retry_after != null)       // si la propriéte "retry_after" est présente dans la réponse, cela veut dire que discord nous limite, donc on attend 3 secondes avant de refaire la requête
                {
                    setTimeout(async () => {        // création du timer
                        
                       await queryClientGuilds(); // execution de la fonction
                    },3000)
                }
                else{
                    await setClientGuilds(response);        // defintion des serveurs
                }
             
        }
         
      };

    
      useLayoutEffect(() => {       // fonction qui s'éxecute lorsque le token change, asynchronement
        refresh();                      // on rafraîchie les valeurs
    },[token])


    useLayoutEffect(() => {     // fonction qui s'execute asynchronement lorsque la valeur de la liste des guilds ou le token change
        refreshGuilds();        // methode pour récuperer la liste des serveurs sur lequels quand le token change, ou la liste des guilds
        
    },[guilds,token])

    useLayoutEffect(() => { // fonction qui s'execute asynchronement lorsque la valeur de la liste des serveurs du bot change
        refreshClientGlds();          // methode pour récuperer la liste des serveurs sur lequel le bot se trouve
    },[clientGuilds])              

    const  refresh = async () => {      // fonction pour rafraîshir et re-defenir le token , le code est un code que discord nous fourni lorsque l'on s'est authentifié
        var tkn = await getToken(code);
        if(tkn)         // si le token existe, le reset
        {
           
            await setToken(tkn);                // on re-set le token
            localStorage.setItem("token",tkn);      // on stock le token localement dans le naviguateur
        } 
}
const  refreshGuilds = async () =>      // fonction qui rafraîchi les serveurs
{
    await getGuilds();      // recuperation des serveurs
}

 const refreshClientGlds = async () =>      // fonction qui rafraîchi les serveurs du bot
{
    await queryClientGuilds();      // recuperation des serveurs du bot
}
    const getGuilds = async () => {     // fonctîon qui récupère la liste des serveurs

        if(guilds.length == 0 && token.length > 0)      // si il n'y a pas de serveurs et que le token existe
        {
            const query = await fetch("https://discord.com/api/users/@me/guilds",{      // requête à l'api
                headers:{
                    "Authorization":`Bearer ${token}`       // token d'autorisation
                }
            })
            const response = await query.json();
            
            console.log(response)
            
                if(response.error == "unauthorized" || token == "undefined" || !token)      // si le token n'exsite pas ou qu'il y a une erreur dans la reponse de la requête
                {
                    window.location.reload();       // on refresh la page
                }
                 setGuilds(response);       
                if(response.retry_after != null)        // si discord nous limite, refaire la requête 3 secondes plus tard
                {
                    setTimeout(async () => {
                       
                        await getGuilds();
                    },3000)
                }
                
            }    
    };
    
    const getToken = async (code) => {      // fonction qui récupere le token de l'utilisateur


        if(token) return;       // si le token existe, ne rien faire;

        // paramètres de la requête
        const params = new URLSearchParams();
        params.append("client_id",config.CLIENT_ID);        // id du bot
        params.append("client_secret",config.CLIENT_SECRET);// secret du bot 
        params.append("grant_type","authorization_code");   // parametre nécessaire pour spécifier à discord, quel type de requête l'on fait
        params.append("code",code);     // code fourni par discord après l'authentification
        params.append("redirect_uri",config.CLIENT_REDIRECT);       // url de redirection
       
    
    
        const query = await fetch("https://discord.com/api/oauth2/token",{      // requête à l'api discord
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"      // type de la requête
            },
            body:params,
            method:"POST"
        })
        const response = await query.json();
       
        if(response.error)      // si il y a une erreur
        {
            console.log("token invalide !");
        }
        return response.access_token;
    
    };

    

    

    return (<div style={body}>      {/*affichage*/}
        <Banner></Banner>   {/* banniere du projet*/}
        {

        <div style={guildsStyle}>   
        {guilds.map((guild,key) => {        {/*boucle sur chaque serveur de l'utilisateur*/}
            
            
            if(guild.owner || (guild.permissions & 0x08) == 0x08)      // on vérifie si l'utilisateur à assez de permissions pour inviter le bot discord dans le serveur concerné
            {
                  
                return <div>       
                    {/*si oui, on affiche pour chaque serveur , leur informations, dans la classe DiscordGuild, on passe en paramètre le serveur et la liste des serveurs du bot discord */}
                    <Guild guild={guild} clientGuilds={clientGuilds}></Guild>       {/* on appel la classe pour afficher chaque serveur*/}
                    </div>
            }   
        })}
        </div>}
        </div>
        );
        
};



