import React, { useEffect } from "react";
import OraViewerComponent from "../components/OraViewerComponent";

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
            <OraViewerComponent
                onCanvasReady={onCanvasReady}
                id="ora-canvas"
            />
        </div>
    );
}
