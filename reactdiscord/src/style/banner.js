

export default function Banner()        // fonction qui affiche la banniere du projet
{
    const body = {      // style de la banniere
        width:"100%",
        height:"6.85vw",
        fontSize:"5.5vw",
        backgroundColor:"rgb(89, 91, 104,.38)",
        fontFamily: 'Hind Madurai',
        fontStyle: "Semibold",
        color:"white",
        textAlign:"center"
    }

    return(<div style={body}>DYNAMO BOT</div>)      // affichage de la bannière
}