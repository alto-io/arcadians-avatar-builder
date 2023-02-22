import React, { createContext, useEffect } from "react";
import * as AvatarBuilder from "../avatar/";

import OraViewerComponent from "../components/OraViewerComponent";

const OraDataContext = createContext(null);

export default function Test() {
    const parts = ["Bottom", "Head", "Eyes", "Left Hand", "Right Hand", "Skin", "Mouth", "Top", "Shadow"];
   
    const [arcadiansParts, setArcadiansParts] = React.useState<any>(null);
    const [arcadianGender, setArcadianGender] = React.useState<any>("Male");
    const [arcadianSelectedPart, setArcadianSelectedPart] = React.useState<any>("Bottom");

    // initialize ora viewer
    const onCanvasReady = async (canvas: any) => {
        console.log("onCanvasReady");
    }

    useEffect(() => {
        const getArcadiansParts = async () => {
            const data = await fetch("./v1/arcadian-parts/partsConfig.json", {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            const json = await data.json();
            setArcadiansParts(json);
        };

        getArcadiansParts().catch((err) => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        console.log(arcadiansParts, "arcadiansParts");
        console.log(arcadianGender, "arcadianGender");
    }, [arcadiansParts, arcadianGender]);

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center text-white gap-2">
            <div className="flex w-full gap-2 items-center justify-center">
                <button
                    className={`font-bold ${"Female" === arcadianGender ? "text-[#AA54FF]" : ""}`}
                    onClick={() => {
                        AvatarBuilder.loadAvatar("Female");
                        setArcadianGender("Female");
                    }}
                >
                    FEMALE
                </button>

                <button
                    className={`font-bold ${"Male" === arcadianGender ? "text-[#AA54FF]" : ""}`}
                    onClick={() => {
                        AvatarBuilder.loadAvatar("Male");
                        setArcadianGender("Male");
                    }}
                >
                    MALE
                </button>
            </div>
            <div className="flex w-full gap-2 items-center justify-center">
                {/* Need to loop through all the animations if needed not currently needed for the avatar builder but good to have an example */}
                <button
                    onClick={() => {
                        AvatarBuilder.playAnim("Hit");
                    }}
                >
                    HIT
                </button>
                <button
                    onClick={() => {
                        AvatarBuilder.playAnim("Walk");
                    }}
                >
                    WALK
                </button>
            </div>
            <OraViewerComponent
                onCanvasReady={onCanvasReady}
                id="ora-canvas"
            />
            <div className="flex w-full items-center justify-evenly gap-2">
                {parts && parts.map((item: any, index: number) => {
                    return (
                        <button
                            key={index}
                            onClick={() => setArcadianSelectedPart(item)}
                            className={`font-bold ${item === arcadianSelectedPart ? "text-[#AA54FF]" : ""}`}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>
            <div className="flex flex-col gap-2">
                {arcadiansParts &&
                    arcadiansParts[`${arcadianGender === "Male" ? 1 : 0}`]?.Parts?.filter((val: any) => val.Name.includes(arcadianSelectedPart)).map(
                        (item: any, index: number) => {
                            return (
                                <div className="flex flex-col w-full gap-2 mx-auto" key={index}>
                                    <div className="flex w-full flex-wrap gap-2 items-center justify-center">
                                        {item.Files?.map((part: any, index: number) => {
                                            return (
                                                <div
                                                    className="hover:cursor-pointer relative p-1 rounded-md aspect-square h-[100px] hover:border-[#AA54FF] hover:border-2 bg-[#EEBD92]"
                                                    key={index}
                                                >
                                                    <p className="absolute text-xs">{part.Name}</p>
                                                    <img
                                                        onClick={() => {
                                                            AvatarBuilder.replaceParts(item.Name, part.Path);
                                                        }}
                                                        src={part.Path}
                                                    ></img>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }
                    )}
            </div>
        </div>
    );
}
