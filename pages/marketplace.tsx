import React, { useState } from "react";

export default function Marketplace() {
    const numberOfElementPerPage = 40;
    const totalSupply = 535; 
    const totalPages = Math.ceil(totalSupply / numberOfElementPerPage);
    const [page, setPage] = useState(1);

    const nextPage = () => {
        setPage((prev) => prev >= totalPages ? totalPages : prev + 1);
    }

    const previousPage = () => {
        setPage((prev) => prev - 1 || 1);
    }

	const getItem = (itemId) => {
        if (itemId > totalSupply) return; 

		return (
			<div className="flex flex-col items-center">
				<div className="border-2 w-28 h-28 rounded-md flex items-center flex-col gap-2">
					<img
						className=""
						crossOrigin="anonymous"
						src={
							`${process.env.NEXT_PUBLIC_ARCADIANS_V2_BACKEND_URL}/v2/items/image/${itemId}`
						}
					></img>
				</div>
				<p>Item #{itemId}</p>
			</div>
		);
	};

	return (
		<>
			<div className="w-full flex items-center justify-center text-white pb-10 pt-5">
				<h1 className="text-lg font-bold">
					Marketplace Item Thumbnails
				</h1>
			</div>
			<div className="w-full flex items-center justify-center flex-wrap text-white gap-2">
				{new Array(numberOfElementPerPage).fill(0).map((element, index) => {
					return getItem((page - 1) * numberOfElementPerPage + index + 1);
				})}
			</div>
            <div className="w-full flex items-center justify-center py-8 gap-4">
                 <button className="rounded-full bg-green-300 text-black font-bold px-3 py-2" onClick={() => previousPage()}>
                    Previous page
                </button>
                <div>
                    <p className="text-white">
                        {page} of {totalPages}
                    </p>
                </div>
                <button className="rounded-full bg-green-300 text-black font-bold px-3 py-2" onClick={() => nextPage()}>
                    Next page
                </button>
            </div>
		</>
	);
}
