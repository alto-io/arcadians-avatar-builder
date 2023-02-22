import { createContext, useEffect, useRef, useState } from "react";
import * as AvatarBuilder from "../avatar/";

export const OraDataContext = createContext(null);

export default ({ onCanvasReady, ...rest }) => {
    const reactCanvas = useRef(null);
    const [partsList, setPartsList] = useState(null);

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
                setPartsList(AvatarBuilder.getOraPartsList());
                onCanvasReady(canvas);
            }
        }

        setTimeout(waitForJsOra, 50);

        return () => {
        };
    }, [ onCanvasReady ]);

    return (
    <>
        {partsList}
        <canvas className="w-[512px]" ref={reactCanvas} {...rest} />
    </>
    )
};
