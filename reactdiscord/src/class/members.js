// importations
//===============
import {useState } from "react";    // fonction utile pour les variables
import { List } from "@mui/material"; // liste d'affichage
import { ListItem } from "@mui/material";   // item de liste
import { ListItemText } from "@mui/material"; // texte d'un item
import {item,list,tooltipStyle} from "../style/memberStyle" // style
import Tooltip from '@mui/material/Tooltip';    //popup
export default function Members(props)
{

    const [windowOpen,setWindowOpen] = useState(false);     // fenetre windows pour l'affichage du graphique

    const showDataChart = async (value) => {    // fonction pour afficher les statistiques de l'utilisateur sur un graphique
        // fonction reprise depuis la partie bot discord, et modifiée pour être adaptée
        // le parametre value correspond à l'utilisateur concerné
        // la propriété amount correspond au nombre de messages de l'utilisateur
        if(value.amount == 0) return;     // si'l n'y a pas de messages
        var dbMember;
        var discordMember = value;
        for(const m of props.DbMembers)   // boucle sur touts les utilisateurs de la db , passé en paramètre lors de l'appel de la fonction
        {
            if(m.id == value.user.id)   // determination de l'utilisateur dans la BDD
            {
                dbMember = m;
            }
        }
        const joinedAt = new Date(discordMember.joined_at);   //date quand l'utilisateur à rejoins le serveur discord
        const difference =  new Date(Date.now()).getTime() - joinedAt.getTime();  // difference
        const data = await activesHours(dbMember);    // recuperation des données pour les afficher dans un graphique ensuite
        const chartData = [];   // données formatées pour le graphique
            var totalMessages = 0;    // messages totaux
            for(const t of data.sliceHours)   // comptage du nombre de messages totaux de l'utilisateur
            {
              totalMessages += t.l.length;
            }
            for(const t of data.sliceHours)   // boucle sur chaque 3 heures
            { 
        chartData.push((t.l.length/totalMessages)*100);   // ajout des données pour le graphique, on met le nombre de messages de l'utilisateur en % sur le nombre totaux
            }
        const chart = {   // graphique
            type: 'bar',
            data: {
              labels: [0,3,6,9,12,15,18,21],
              datasets: [{
                label: 'Activitée ( % )',
                data: chartData   // données
              }],
            },
            options: {
              scales:{
                yAxes: [{
                  ticks: {
                    min: 0, 
                    max: 100,
                    stepSize: 20
                  }
                }]
              }
            }
          }
          const encodedChart = encodeURIComponent(JSON.stringify(chart));   // création de l'url
          const chartUrl = `https://quickchart.io/chart?c=${encodedChart}&backgroundColor=white`;   // url du graphique
          // ouverture de la page de graphique
          var w = window;
          if(windowOpen == false)   //test si la page est fermé pour qu'on puisse ouvrir qu'une seule fois la page
          {
            w = await window.open(chartUrl,"_blank",`width=${window.innerWidth/4}`);    // ouvrire la page
            setWindowOpen(true);
          }
          var timer = setInterval(function() {      // on test chaque 500ms, si la page est fermée
            if(w.closed) {  
                clearInterval(timer);  
                setWindowOpen(false);
            }  
        }, 500); 
    }

   const activesHours = async (guildUser) =>   // methode retournant les tranches d'heures quand l'utilisateur est le plus actif
        {
          var sliceHours = [{h:0,l:[]},{h:3,l:[]},{h:6,l:[]},{h:9,l:[]},{h:12,l:[]},{h:15,l:[]},{h:18,l:[]},{h:21,l:[]}];   // liste contenant les tranches d'heures vides
          const messages = guildUser.messages;
          for(var msg of messages)        // boucle sur chaque message
          {
            const date = new Date(msg.date);  // date du message
            const hour = date.getHours();   // heure du message
            for(var i = 3; i <= 24;i+= 3) // boucle sur les tranches d'heures
            {
              if(hour >= i && hour  < i+3 ) // test sur quel tranche d'heure le message à été écris
              {
                var obj = sliceHours.find(hh => i == hh.h);   // récuperation de la tranchde d'heire
                if(i == 24)
                {
                  obj = sliceHours.find(hh => hh.h == 0);
                }
                sliceHours.at(sliceHours.indexOf(obj)).l.push({t:date})   // ajout de la date de l'heure du message dans la tranche d'heure
              }
            }     
          }
          var max = sliceHours[0];    // tranche d'heure avec le plus de messages
         sliceHours.forEach(slc => {    //determination de la tranche d'heure avec le plus de messages
            if(slc.l.length > max.l.length)
            {
              max = slc;
            }
         })
          var sum = 0;    // sommme des heures des messages en minutes
          max.l.forEach(m => {   // boucle sur la tranche d'heure avec le plus de messages
            // console.log (new Date(m.t).toTimeString());
            var date = new Date(m.t);
            sum += (date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60);    // ajout de l'heure du messages
            
          })
          var avg = sum / max.l.length - 1;    // moyenne de l'heure en minute
          
          const realAvg = (Math.floor(avg / 60)) + ":" + Math.floor(avg % 60) + ":" + Math.floor((avg % 60 - parseInt(avg % 60))*60);   // moyennne en heures
          return await {sliceHours,maximum:max.h,average:realAvg}
        }



   return (<List disablePadding sx={list}  >    {/* saffichage de la liste avec le style defini*/}
       {props.members.map((value,key)=> {   // boucle sur touts les membres
           if(value.user.username == "Dynamo") return
      return (<ListItem   sx={item} onClick={() => showDataChart(value)}  // ajout de l'utilisateur, avec lorsqu'on clic sur l'utilisateur, le graphique s'affiche
      key={key}>
        {/* Lorsqu'on passe la souris sur l'utilisateur, un hover s'affiche avec le nombre de messages */}
         <Tooltip PopperProps={{sx:tooltipStyle}}  sx={tooltipStyle}   title={<div style={{fontSize:"0.6vw"}}>{"messages : " + value.amount}</div>} placement="top-start">  
      <ListItemText disableTypography sx={item} primary={`${key+1}. ${value.user.username}`} />
      </Tooltip>
    </ListItem>)})}</List>
    )
}