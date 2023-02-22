import { createContext, useEffect, useRef, useState } from "react";
import * as AvatarBuilder from "../avatar/";

export const OraDataContext = createContext(null);

export default ({ onCanvasReady, ...rest }) => {
    const reactCanvas = useRef(null);
    const [partsCategories, setPartsCategories] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");


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
    </>
    )
};
