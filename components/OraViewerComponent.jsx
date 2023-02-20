import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";

export default ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onCanvasReady, ...rest }) => {
    const reactCanvas = useRef(null);

    useEffect(() => {
        const { current: canvas } = reactCanvas;

        if (!canvas) return;

        // wait for jsora to be loaded
        const waitForJsOra = () => {
            if (window.jsora == null) {
                setTimeout(waitForJsOra, 50);
            }

            else onCanvasReady(canvas);
        }

        setTimeout(waitForJsOra, 50);

        return () => {
        };
    }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onCanvasReady]);

    return <canvas className="w-[512px]" ref={reactCanvas} {...rest} />;
};
