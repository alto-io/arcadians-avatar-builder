import { createContext, useEffect, useRef, useState } from "react";
import * as AvatarBuilder from "../avatar/";
import * as Config from "../avatar/config";

import PartTile from "./PartTile";

export const OraDataContext = createContext(null);

export default ({ onCanvasReady, ...rest }) => {
    const reactCanvas = useRef(null);
    const [oraFileName, setOraFileName] = useState(Config.g_config.oraConfigPath)
    const [partsCategories, setPartsCategories] = useState(null);
    const [parts, setParts] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("XYZ");
    const [renderTrigger, setRenderTrigger] = useState(false); // to force tile to rerender

    const hiddenFileInput = useRef(null);


    useEffect(() => {
        const { current: canvas } = reactCanvas;

        if (!canvas) return;

        // wait for jsora to be loaded
        const waitForJsOra = async () => {
            if (window.jsora == null) {
                setTimeout(waitForJsOra, 50);
            }

            else {
                await AvatarBuilder.initializeOra(canvas);
                setPartsCategories(AvatarBuilder.getOraPartsCategories());
                setParts(AvatarBuilder.getArrayOfAllParts());
                onCanvasReady(canvas);
            }
        }

        setTimeout(waitForJsOra, 50);

        return () => {
        };
    }, [ onCanvasReady ]);

    const handleFileUploadClick = (event) => {
        hiddenFileInput.current.click()
    }

    const loadNewOra = async (event) => {
        event.preventDefault();
        var oraFile = event.target.files[0];
        if (oraFile) {
            if (await AvatarBuilder.loadLocalOraFile(oraFile))
            {
                setOraFileName(oraFile.name);
                setPartsCategories(AvatarBuilder.getOraPartsCategories());
                setParts(AvatarBuilder.getArrayOfAllParts());
            }
        }
    }

    return (
    <>
        <div className="flex w-full gap-2 items-center justify-center">
            <p className={`font-bold text-[#AA54FF]`}>
                {oraFileName}
            </p>
            <button 
                onClick = {handleFileUploadClick}
                className={
                    "bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-bold py-2 px-4 border-b-4 border-fuchsia-700 hover:border-fuchsia-500 rounded inline-flex"
                }
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span>Upload</span>
            </button>
            <input
            type="file"
            ref={hiddenFileInput}
            onChange={loadNewOra}
            style={{display: 'none'}} 
            />            
            </div>
        <canvas className="w-[512px]" ref={reactCanvas} {...rest} />
        <div className="flex w-full items-center justify-evenly gap-2">
            {partsCategories && partsCategories.map((item, index) => {
                return (
                    <button
                        key={index}
                        onClick={
                            () => {
                                    setSelectedCategory(item)
                                    setRenderTrigger(!renderTrigger)
                            }
                        }
                        className={
                            `font-bold ${item === selectedCategory ? "text-[#AA54FF]" : ""}`
                        }
                    >
                        {item}
                    </button>
                );
            })}
        </div>
        <div className="flex flex-col gap-2">
            <div className="flex flex-col w-full gap-2 mx-auto">
                <div className="flex w-full flex-wrap gap-2 items-center justify-center">
                    {parts ?
                        parts
                        .filter(
                        (val) => val.includes(selectedCategory)
                        )
                        .map( (item, index) => {
                            return (
                            <div
                                className="hover:cursor-pointer relative p-1 rounded-md aspect-square h-[100px] hover:border-[#AA54FF] hover:border-2 bg-[#EEBD92]"
                                onClick={() => {
                                    AvatarBuilder.displayPart(item);
                                }}                            
                                key={index}
                            >
                                <PartTile partPath={item} renderTrigger={renderTrigger}></PartTile>
                            </div>
                            )
                        })
                        :
                        <p className={`font-bold text-[#AA54FF]`}>
                        ⌛ Loading categories... ⌛                       
                        </p>
                    }
                </div>
                {
                    parts && parts.filter((val) => val.includes(selectedCategory)).length > 0 ?
                    <></> 
                    : 
                    <p className={`font-bold text-[#AA54FF]`}>
                        👆 Select a category 👆                         
                    </p>
                }        
            </div>        
        </div>        
  
    </>

    )
};
