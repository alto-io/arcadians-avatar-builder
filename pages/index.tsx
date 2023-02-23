import React, { createContext, useEffect } from "react";
import * as AvatarBuilder from "../avatar/";

import OraViewerComponent from "../components/OraViewerComponent";
import * as Config from "../avatar/config";

export default function HomePage() {
   
    // initialize ora viewer
    const onCanvasReady = async (canvas: any) => {
        console.log("onCanvasReady");
    }

    useEffect(() => {
        console.log("useEffect");
       }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center text-white gap-2">
            <div className="flex w-full gap-2 items-center justify-center">
                <p className={`font-bold text-[#AA54FF]`}>
                    ORA PATH: {Config.g_config.oraConfigPath}
                </p>
            </div>
            <OraViewerComponent
                onCanvasReady={onCanvasReady}
                id="ora-canvas"
            />
        </div>
    );
}
