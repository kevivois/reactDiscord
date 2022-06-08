// importations du projet
//======================
import { useEffect, useState } from "react";
import {imgStyle, text,body} from "../style/informationsStyle"       // style
import Commands from "./commands";      // fichier du tableau des commandes
import config from "../config.json"     // variables globales

export default function Informations(props)
{
    const [smallguild,setsmallGuild] = useState(props.guild);   // serveur passé en paramètre lors de l'appel de la fonction
    const [profilePicture,setPP] = useState(null);              // pp du serveur discord
    const [guild,setGuild] = useState();                        // serveur actuelle complet
    const [commands,setCommands] = useState(null);                // liste de commands
    const [owner,setOwner] = useState();                        // propriétaire du serveur
    const [RenderCommands,setRenderCommands] = useState(<div></div>)    // rendu de la liste des commands
    const [members,setMembers] = useState(props.members);               // liste des membres passés en paramètre

    useEffect(() => {       // fonction qui s'execute lorsque la valeur du serveur passé en parametre change
        // pp du serveur
        const imgSrc = smallguild.icon ? `https://cdn.discordapp.com/icons/${smallguild.id}/${smallguild.icon}.png?size=4096`: require("../img/discord_logo.png");
        setPP(imgSrc)
        getCompleteGuild();     // fonction qui recupere le serveur complet
        getDBCommands();  
    },[smallguild]);

   const getCompleteGuild = async () => {    //fonction qui recupere le serveur complet à l'api   
        const query = await fetch("http://"+config.URL_IP+":3001/dashboard/guild/"+smallguild.id)       // requête
        const response = await query.json();
        setGuild(response);
   }
   const getDBCommands = async () => {

    const commands = await fetch("http://"+config.URL_IP+":3001/db/guild/"+smallguild.id+"/commands")

    const response = await commands.json();
    
    
    setCommands(response);
    

}
    const getOwner = async () => {      // fonction qui récupere les informations du propriétaire du serveur
        const query = await fetch("http://"+config.URL_IP+":3001/settings/guild/"+smallguild.id+"/owner")
        const response = await query.json();
        setOwner(response);
    };
    useEffect(() => {  // on execute la fonction que lorsque la valeur du serveur change
          
        getOwner();
    },[guild])

    useEffect(() => {      
            if(guild != null)   // affichage des commands si la guild existe
            {
                
                setRenderCommands(<Commands commands={commands} guild={guild} members={props.members} creator={props.creator}></Commands>)
            }
    },[commands,members,guild])

    // affichage
return (<div style={body}><div style={{width:"22%",textAlign:"center",marginRight:"2%"}}><img style={imgStyle} src={profilePicture} />
        <div style={{width:"20%",display:"inline"}}>
        <p style={text}>propriétaire : { owner != null? owner.user.username : "" }</p>      {/*affichage de la pp du serveur */}  
        <p style={text}>{members.length != null ? props.members.length : ""} membres</p>    {/*affichage du nombre de membres */}  
        </div></div>
        {RenderCommands}        {/* affichage des commands */}
        </div>)
} 