
// importations 
//================
import { useEffect, useState } from "react";        // importations des différentes fonctions utiles pour le projet
import {buttontext,buttonConfig,buttonOpen,buttonStyle,body,header,guildName,guildImg,btnstyle} from "../style/eachGuildStyle"      // importation du style
import { Button } from "@mui/material";         // button 
import { Link } from "react-router-dom";        // importation pour faire les liens

export default function Guild(props)
{
    const [guild,setGuild] = useState(props.guild);     // serveur actuelle passé en paramètre lors de l'appel de la fonction
    const [isClientIn,setisClientIn] = useState();      // instanciation du propriéte pour vérifier si le bot discord est bien dans le serveur
    const onClickConfigure = () => {

    };
    useEffect(() => {       // fonction qui s'éxécute dès que le fichier est affiché

        setisClientIn(props.clientGuilds.find(gl => gl.id == guild.id) != undefined ? true : false);        // vérification 
    });
const imgSrc = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096`: require("../img/discord_logo.png"); // lien de l'image du serveur 
    return (

   <div style={body}> 
        <div style={guildName}>{guild.name}</div> {/*nom du serveur */}
        <div style={header}><img style={guildImg} src={imgSrc}></img></div> {/*image du serveur */}
        { isClientIn ? // on vérifie si le bot est bien dedans
        <Link to={`${guild.id}`} state={[guild,isClientIn]}> {/*lorsqu'on click sur le bot, l'url va rajoute / avec l'id du serveur */}
            <div style={buttonOpen}><Button><div style={buttontext}>Ouvrir</div></Button></div>     {/*bouton d'ouvertue d'un serveur */}
            </Link>
            :
            // si le bot n'est pas dans le serveur
           <Link to="/connect"  state={[guild,isClientIn]}> {/* faire un bouton qui redirige vers la connexion discord, avec en paramètre le serveur */}
          <div style={buttonConfig} onClick={() => onClickConfigure()}><Button><div style={buttontext}>Configurer</div></Button></div>      {/*bouton */}
            </Link>
            }
        </div>)
}

