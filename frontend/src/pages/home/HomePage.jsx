import { useState,useEffect } from "react";

import Posts from "../../components/common/posts";

import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

useEffect(() => {
  window.scrollTo({
	top:0,
	behavior:"smooth"
  }); }, []);

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r  border-gray-700 min-h-screen'>
			
				<div className='flex w-full border-b  border-gray-700'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-zinc-500 rounded-md transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10  h-1  rounded-full bg-blue-600'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-zinc-500 rounded-md transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full  bg-blue-600'></div>
						)}
					</div>
				</div>

			
				<CreatePost />

				<Posts feedType={feedType}/>
			</div>
		</>
	);
};

export default HomePage