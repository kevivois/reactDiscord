// importations du projet
//=============================

import {useParams} from 'react-router-dom';     // paramètre de l'url
import { useEffect,useState } from 'react';
import {body, membersPanel,mainPanel,Paneltext,parent,iconBackStyle} from "../style/settingsStyle";      // style
import { useLocation } from 'react-router-dom';   
import config from "../config.json";      // variables globales
import Banner from "../style/banner";     // banniere
import Members from '../class/members';   // panel des membres
import Informations from '../class/informations';  // panel d'informations
import ArrowBackIcon from '@mui/icons-material/ArrowBack';     //fleche de retour
import LogoutIcon from '@mui/icons-material/Logout';  // fleche de deconnection
import {tooltipStyle} from "../style/memberStyle"     // style du popup  
import Tooltip from '@mui/material/Tooltip';    // popup

export default function Settings()
 {
     const location = useLocation();         
     const [token,setToken] = useState(localStorage.getItem("token"));     // recuperation du token
     const [isClientIn,setisClientIn] = useState(location.state != null ? location.state[1] : null);     // on verifie si le bot discord est dans le serveur actuelle
     const [guild,setGuild] = useState(location.state != null ? location.state[0] : null);      // recuperation du serveur
     const { guildId } = useParams();     // recuperation de l'id du serveur depuis l'url
     const [renderMembers,setRenderMembers] = useState(null);  // rendu des membres
     const [members,setMembers] = useState([]); // liste des membres
     const [DbMembers,setDbMembers] = useState([]);   // liste des membres de la BDD
     const [RenderInformations,setRenderInformations] = useState(<div></div>);   // rendu du panel d'informations
     const [user,setUser] = useState(null);     //utilisateur actuellement connecté
     const URL_START = config.URl_START;        
     useEffect(() => {     // fonction qui s'execute quand une des trois valeurs dans la liste en paramètre change
        
        if( token === "" || token === "undefined" || !token)      // si'l n'y a pas de token, redigirer vers l'authentification
        {
         window.location.replace(URL_START+"://"+config.URL_IP+":3001/auth");
        }
        if(!guild || guild.id != guildId )      // si le serveur n'est pas le bon ou n'existe, revenir en arriere
        {
            window.history.back();
           window.location.reload();
        }
      
    
     },[guild,token,isClientIn]);

     useEffect(() => {     // fonction qui s'exécute au commencement
     
      fetchMembers();      // recuperation des utilisateurs du serveurs
      fetchUser();         // recuperation de l'utilisateur actuelle connecté
      
     },[]);
     const fetchUser = async () => {      // fonction pour récuperer les informations de l'utilisateur actuellement connecté
      const query = await fetch(`http://${config.URL_IP}:3001/settings/user/@me/${token}`);
      const response = await query.json();
      setUser(response);
      
     }
     const fetchMembers = async () => {      // fonction pour récuperer la liste des membres du serveur discord
      const query = await fetch(`http://${config.URL_IP}:3001/settings/guild/${guild.id}/members`); 
     const response = await query.json();
      const mbrs = await fetchDBMembers(response);
      setMembers(mbrs);
     }
      
     const fetchDBMembers = async (users) => {     // fonction pour récuperer la liste des membres de la BDD
         const query = await fetch(`http://${config.URL_IP}:3001/db/guild/${guild.id}/members`);
         const response = await query.json();
         setDbMembers(response);   
         const data = [];
         for(const user of response)      // liste sur touts les utilisateurs
         {
           data.push({user:user.id,amount:user.messages.length})     // on formate une liste avec le nombre de message représenté par "amount"
         };
         data.sort((a,b) => a.amount - b.amount);  // on trie les utilisateurs
         data.reverse();      // l'utilisateur avec le plus de message sera en 1er
         const tempMembers = [];    // liste des utilisateurs avec le nombre de messages
         users.forEach(mbr => {     // boucle sur touts les utilisateurs
            if(data.find(m => m.user == mbr.user.id) == undefined)      // si l'utilisateur n'existe pas
            {
               return tempMembers.push({...mbr,amount:-20});
            }
            const amount = data.find(m => m.user == mbr.user.id).amount == undefined ? 0 : data.find(m => m.user == mbr.user.id).amount;  // recuperation du nbr de msgs
            return tempMembers.push({...mbr,amount:amount});      // ajout des données 
         })
       //tri en fonction du nombre de messages
       tempMembers.sort((a,b) => {  
          return a.amount - b.amount;
       }).reverse();
         return tempMembers;
     };
     
    const onClickGoBack = async () => {      // fonction qui sert a revenir en arrière
       window.history.back();
    }
    const onClickDisconnectBot = async () => {     // fonction qui deconnecte le bot discord du serveur
      const query = await fetch("http://"+config.URL_IP+":3001/settings/guild/"+guild.id+"/leave");

      onClickGoBack();

    };
    
     
     useEffect(() => {     // fonction qui s'execute quand la liste des membres / le serveur/ l'utilisateur change
      if(members.length > 0)
      {
         setRenderMembers(<Members DbMembers={DbMembers} members={members}></Members>);      // on affiche le panel des membres
         setRenderInformations(<Informations guild={guild} members={members} creator={user}></Informations>)   // on affiche le panel d'informations
      }
     
      
     },[members,guild,user])
        return ( <div style={parent}>
           <Banner></Banner>     {/*affichage de la banniere */}
           <div style={body}>
              <ArrowBackIcon onClick={() => onClickGoBack()} sx={iconBackStyle} ></ArrowBackIcon>     {/* affichage de l'icone pour revenir en arriere */}
                 <div style={membersPanel}><div style={Paneltext}>Membres</div>{renderMembers}</div>
                 <div style={mainPanel}><div style={Paneltext}>Informations | {guild.name}</div>{RenderInformations}</div>
                 <Tooltip PopperProps={{sx:tooltipStyle}}  sx={tooltipStyle}   title={<div style={{fontSize:"0.6vw"}}>Déconnecter le bot</div>} placement="top">
                    <LogoutIcon onClick={() => onClickDisconnectBot()} sx={iconBackStyle} ></LogoutIcon></Tooltip></div>      {/*icon pour déconneter le bot*/}
                                                 </div>);
 }


 
