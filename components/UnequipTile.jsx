import * as AvatarBuilder from "../avatar/";
import { useEffect, useState } from "react"; 

const dotBase64 = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

export default function UnequipTile(props){
    const {renderTrigger} = props  
    const [imgSrc, setImgSrc] = useState(dotBase64);
     
    useEffect(() => {

    }, [renderTrigger]);
  
    return(
        <>
        <p className="absolute text-xs">Unequip</p>
        <img src={imgSrc}></img>
        </>
    )
  

  }