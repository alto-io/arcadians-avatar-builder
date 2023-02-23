import { createContext, useEffect, useRef, useState } from "react";
import * as AvatarBuilder from "../avatar/";

import PartTile from "./PartTile";

export const OraDataContext = createContext(null);

export default ({ onCanvasReady, ...rest }) => {
    const reactCanvas = useRef(null);
    const [partsCategories, setPartsCategories] = useState(null);
    const [parts, setParts] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("XYZ");
    const [renderTrigger, setRenderTrigger] = useState(false); // to force tile to rerender


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

    return (
    <>
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
                    {parts && parts
                        .filter(
                        (val) => val.includes(selectedCategory)
                        )
                        .map( (item, index) => {
                        return (
                        <div
                            className="hover:cursor-pointer relative p-1 rounded-md aspect-square h-[100px] hover:border-[#AA54FF] hover:border-2 bg-[#EEBD92]"
                            onClick={() => {
                                // AvatarBuilder.replaceParts(item.Name, part.Path);
                                console.log(item)
                            }}                            
                            key={index}
                        >
                            <PartTile partPath={item} renderTrigger={renderTrigger}></PartTile>
                        </div>
                        )
                    })
                    }
                </div>        
            </div>        
        </div>        
  
    </>

    )
};
