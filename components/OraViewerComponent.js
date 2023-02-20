import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";

export default ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onCanvasReady, ...rest }) => {
    const reactCanvas = useRef(null);

    // set up basic engine and scene
    useEffect(() => {
        const { current: canvas } = reactCanvas;

        if (!canvas) return;

        onCanvasReady(canvas);


        return () => {
        };
    }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onCanvasReady]);

    return <canvas className="w-[512px]" ref={reactCanvas} {...rest} />;
};
