//importations du projet
//============================
import { useEffect } from "react";
import config from "../config.json"
import { useState } from "react";
import { useLocation } from 'react-router-dom'; // pour récuperer le contenu passé en paramètre de la fonction
import {body} from "../style/dashboardStyle"        // style

export default function Configure()
{
    const location = useLocation();     //contenu passé en paramètre du lien
    const [guild,setGuild] = useState(location.state == null ? null : location.state[0]);       // recuperation du serveur
    const [close,setClose] = useState(false);
    const URL_START = config.URl_START;
    
    useEffect(() =>{        // fonction qui s'execute au debut du fichier dés qu'on arrive sur la page

        if(!guild)      // s'il n'y pas de serveur
        {
            return;
        }
        handleWindow();     // fonctuin pour gérer l'ouverture de l'authentification discord
        async function handleWindow()
        {
            const  w = await window.open(URL_START+"://"+config.URL_IP+":3001/connect/"+guild.id,"_blank",`width=${window.innerWidth/2}`); //fenêtre d'authenfication
            
            var timer = setInterval(function() {    // on verifie jusqu'a quelle soit fermée
                if(w.closed) {  
                    clearInterval(timer);  
                    setClose(w.closed);
                }  
            }, 500); 
        }
    },[])

    useEffect(() => {       // quand l'utilisateur a fini l'authentification, on le fait revenir à la page d'affichage de serveurs
        if(close)
        {
            window.history.back();
        }
    },[close])
    return (<div style = {body}></div>);
}