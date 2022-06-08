import { useEffect, useState } from "react";
import { List } from "@mui/material";
import {name} from "../style/rolesStyle"
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";
import {item,list} from "../style/rolesStyle"
import { StyledEngineProvider } from "@mui/material";
export default function Roles(props)
{
    
    return (<List  sx={list}  >
        {props.roles.map((value,key)=> {
       return (<ListItem sx={item} 
       key={value.id}>
           
       <ListItemText disableTypography sx={item} primary={`${value.name}`} />
     </ListItem>)})}</List>
     )

    
}