import * as AvatarBuilder from "../avatar/";
import { useEffect, useState } from "react"; 
import { render } from "react-dom";

const dotBase64 = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

export default function PartTile(props){
    const {partPath, renderTrigger} = props  
    const [imgSrc, setImgSrc] = useState(dotBase64); // here is the hook for the url
     
    useEffect(() => {
      const getPartImage = async (path) =>{          
            setImgSrc(await AvatarBuilder.getItemImage(path));
        }
  
      getPartImage(partPath);
    }, [renderTrigger]);
  
    return(
        <>
        <p className="absolute text-xs">{partPath.split("/").pop()}</p>
        <img src={imgSrc}></img>
        </>
    )
  

  }