
// importations
import "./App.css"    // css de l'app
import React from "react"   // react
import { Button } from "@mui/material";   // button de la librairie mui/material
import {body, button, buttontext} from "./style/connectionStyle"    // importation du style
import Banner from "./style/banner";      // importation du style de la bannière
import config from "./config.json"        // importations des variables globales


export default function Connection() {    // fonction de connection
  return (
    <div style={body}>
          <Banner></Banner> {/*Affichage de la bannière sur la page*/}
          <Button style={button} sx={button} onClick={onClickConnection}><div  style={buttontext}>Se Connecter</div></Button>  {/* Affichage du bouton de connection, sur le clic, on se connecte a discord */}
    </div>
  );
}

const onClickConnection = async ()  => {    // fonction pour se connecter

  const URL_START = config.URl_START;
  
  window.location.replace(URL_START+"://"+config.URL_IP+":3001/auth");    // redirection vers l'addresse de l'api pour lancer l'authentification
  
}

