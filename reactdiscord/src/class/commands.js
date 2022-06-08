// importations nécessaires
// ============================

import { useEffect, useState } from "react";    // fonction utiles
import {item,list} from "../style/commandsStyle"    // style
import { DataGrid } from '@mui/x-data-grid';    // tableau d'affiche des commandes
import "../style/commands.css"    // style
import Delete from '@mui/icons-material/Delete';    // icon de suppression
import config from "../config.json"                 // fichier de config des variables globales
import AddCircleIcon from '@mui/icons-material/AddCircle';    // icon d'ajout
export default function Commands(props)
{

  const [rows,setRows] = useState([]);    // contenu du tableau
  const [commands,setCommands] = useState(props.commands);    // liste des commandes du serveur
  const [members,setMembers] = useState(props.members);       // liste des membres du serveur
  const [render,setRender] = useState(<div></div>);           // rendu de la fonctuion
  useEffect(() => {   // fonction qui s'exécute en fonction de la valeur des membres, commands, si un des deux change et ou lorsque la page est affichée pour la 1ere fois
    
      renderData();   // fonction qui definie le contenu du tableau

    
  },[members,commands])

  useEffect(() => {   // fonction qui affiche le tableau lorsque la valeur du contenu change
setRender(<DataGrid  disableExtendRowFullWidth={true} rowsPerPageOptions={[]} disableColumnMenu={true} disableSelectionOnClick={true} disableColumnFilter={true} 
  disableVirtualization={true}  rowHeight={30} rows={rows} sx={list} columns={columns} 
      onCellClick={(e) => {   // sur le clic de suprression
        
      if(e.field == "delete")
      {
       
        onCellClick(e)    // suppression de la ligne
      }
}}/>)
  },[rows])

  const renderData = async () => {    // fonction qui formate la liste des commandes pour les afficher dans la liste
    const temp = [];
    
    if(!props.commands || props.commands.length < 0 || !Array.isArray(props.commands)) return; // s'il n'y a pas de commandes, ne rien faire
    var i = 0;
    for(var b = 0 ; b < commands.length;b++) {    // boucle dans les commandes
      const tempCmd = commands[b];
      const user  = members.find(m => m.user.id == commands[b].creator);
      if(user != null)
      {
        tempCmd.creator = user.user.username;   // on change l'id de l'utilisateur par son nom
      }   
      tempCmd.command = tempCmd.prefix+tempCmd.name;    // commande     
      temp.push({id:i, ...tempCmd});    // ajout dans la liste du contenu formaté
      i++;
    };
    
    setRows(temp);    // definition du contenu du tableau
   

    
  }
  const getDBCommands = async () => {   // fonction qui récupère la liste des commandes

    const commands = await fetch("http://"+config.URL_IP+":3001/db/guild/"+props.guild.id+"/commands")    // requête à l'api

    const response = await commands.json();   // reponse
  
    setCommands(response);    // definition des commandes
    
     
    

}
  const columns = [   // colonnes du tableau
    { field: 'command', headerName: 'Commande', width:160,flex:0.5,},   //dispotion flex, la taille des colonnes sont reparties proportionnellement
    { field: 'description', headerName: 'Description', width: 200,flex:1.2, },
    { field: 'creator', headerName: 'Créateur', width: 160,flex:1, },
    { field: 'delete', headerName: 'supprimer', width: 110,renderCell: () => <Delete />, renderHeader: () => <Delete />,flex:0.1},    // suppression avec icon
    
    
  ];
  const onCellClick = async (e) => {    // fonction qui s'exécute lors du clic sur la cellule de suppression
    
    
    const cmd = commands[e.row.id]    // recuperation de la commande sur laquelle on a cliqué
    if(cmd  == null) return  getDBCommands();   // si la commande est nulle.
    const deleteQuery = await fetch("http://"+config.URL_IP+":3001/db/guild/"+ props.guild.id +"/command/"+cmd.prefix+cmd.name+"/delete",{    // requête
      method:"post"
    });
   
    const response = await deleteQuery.json();    // reponse
     getDBCommands();   // affichage des commands après suppression
  }

  const CreateNewCommand = async () => {   // fonction qui s'exécute pour crée une nouvelle commande
    // recuperations des informations de la nouvelle commande
    var fullCommand = prompt("Entrer le nom de la commande (prefix inclus)");
    var content = prompt("Entrer le contenu de la commande");
    var description = prompt("Entrer la description de la commande");
    description = description.length > 0 ? description : "a custom command";
    const creator = props.creator;
    var prefix = fullCommand.substring(0,1);
    var command = fullCommand.substring(1,fullCommand.length);
    const prefixs = ["!", ".", ",", ":", ";", "-", "_", "+", "*", "#", "%", "&", "|", "?", "<", ">"]
    // on vérifie si touts les champs sont remplis
    if(command && content && description && creator && commands.find(cmd => cmd.name == command && cmd.prefix == prefix) == undefined && prefixs.find(pr => pr == prefix) != null)
    {
      var raw = JSON.stringify({
        "prefix": prefix,
        "name": command,
        "content": content,
        "description": description,
        "creator": creator.id
      });
      // corps en json de la requête
      const query = await fetch("http://"+config.URL_IP+":3001/db/guild/"+props.guild.id+"/commands/add",{    // requête d'ajout à l'api
        headers:{
          'Content-Type': 'application/json',   // type du contenu
        },
        method:"POST",
        body:raw,
      });
      const response = await query.json();  
      console.log(response);
      getDBCommands();   
    }
  }
    
    return (<div style={{display:"flex",width:"74%"}}>    {/* affichage de la liste des commandes */}
      {render} {/* variable contenant la liste des commandes, on la définie plus tôt */}
      <AddCircleIcon sx={{width:"2.5vw",height:"2.5vw",alignContent:"flex-end","marginTop":"13.5vw"}} onClick={() => CreateNewCommand()} /> {/* icon d'ajout*/}
    </div>
     )
}