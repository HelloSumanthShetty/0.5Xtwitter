import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelskeleton.jsx";
// import ProfilePage from "../../pages/profile/Profilepage";
// import dayjs from "dayjs";
import LoadingSpinner from "./Loadingspinner.jsx";
import { useQuery,useQueryClient } from "@tanstack/react-query";
import hooks from "../hooks/hooks.jsx";
const RightPanel = () => {
	
	const {followlogic,isPending}=hooks()

	const {data:user,isLoading,}=useQuery(
	
		{
			queryKey:["sugg"],
		queryFn:async()=>{
			
			try {
				
				const res=await fetch("/api/user/profile/sugguser",
				{method:"GET"}
			)
			//console.log(res)
			const data=await res.json()
			//console.log(data)
		if(!res.ok){
			throw new Error(data.error||"internal server error")
		}
		// //console.log(data)
	 
        return data

			} catch (error) {
				//console.log(error||"internal server error")
				throw error
			}
		}
	}
	)

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-zinc-800 p-4 rounded-md text-white sticky top-2'>
				<p className='font-bold'>{user?.length!=0?"Who to follow":"NO USER AVAILABLE"}</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						user?.map((user) => (
							<Link
								to={`/profile/${user.name}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div> 
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.Fullname}
										</span>
										<span className='text-sm text-slate-500'>@{user.name}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault()
											followlogic(user)
										}}
									>
										{isPending ? <LoadingSpinner size="sm"/> : "follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;