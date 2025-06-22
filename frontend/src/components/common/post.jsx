import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";;
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState,useEffect, } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import LoadingSpinner from "./Loadingspinner.jsx";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import App from "../../App";
import ProfilePage from "../../pages/profile/Profilepage";
dayjs.extend(relativeTime);
const Post = ({ post,postlen }) => {
	
	const [comment, setcomment] = useState("");
	const { data: authuser } = useQuery({queryKey:["authUser"]})
	//console.log({authuser})
	const [isLiked, setisLiked] = useState(false)
       useEffect(()=>{
		if(!authuser?.likedpost||!post?._id){
			return 
		}
		const check=authuser.likedpost?.includes(post._id)
		setisLiked(check)
	   },[authuser?.likedpost,post._id])
	const QueryClient = useQueryClient()
	const { mutate: deletpost, isPending } = useMutation({
		mutationFn: async () => {
			try {
 
				const res = await fetch(`/api/post/${post._id}`, {
					method: "DELETE"
				}  
				)
				const data = await res.json()

				if (!res.ok) {
					throw new Error(data.error || "internal server error")
				}
				toast.success("post was successfully deleted")
				QueryClient.invalidateQueries({ queryKey: ["Posts"] })
				return data

			} catch (error) {
				toast.error("something went wrong")

				console.error(error)
				throw error
			}
		}
	})
	const { mutate: likepost } = useMutation({
		mutationFn: async () => {
			try {


				const res = await fetch(`/api/post/like/${post._id}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				}
				)
				const data = await res.json()
				if (!res.ok) {
					throw new Error(data.error || "internal server error")
				}
				if (data == "liked") {
					setisLiked(true)
					QueryClient.invalidateQueries({ queryKey: ['Posts'] })
					//console.log(data)
				}
				else {
					setisLiked(false)
					QueryClient.invalidateQueries({ queryKey: ['Posts'] })
					//console.log(data)
				}
			} catch (error) {
				console.error(error)
				toast.error(error || "internal server error")
			throw error			}
		}


	})
	const {mutate:userComment,isPending:isCommenting}=useMutation({
		mutationFn:async({text})=>{
			try {
				const res=await fetch(`/api/post/comment/${post._id}`,{
					method:"POST",
					headers:{
						"Content-Type":"application/json"
					},
					body:JSON.stringify({text})
				})
				//console.log(res)
				const data=await res.json()
				//console.log(data)
				
				return data
			} catch (error) {
				console.error(error)
				toast.error(error || "internal server error")
				throw error
			}
		},
		onSuccess:()=>{
			
			setcomment("")
			QueryClient.invalidateQueries({queryKey:["Posts"]})
		}
	})
	const postOwner = post.user;

	const isMyPost = authuser?._id === post.user._id

// 	if(authuser._id===post.user.likepost){
//   setisLiked(true)
// 	}
 //console.log(postlen)



	const formattedDate = dayjs(post.createdAt).fromNow();

	//const isCommenting = true;
  
	const handleDeletePost = () => {
		deletpost()
	};

	const handlePostComment = (e) => {
		e.preventDefault();
		if(isCommenting) return
		userComment({text:comment})
	

	};

	const handleLikePost = () => {
		likepost()

	};

	return (
		<>
			<div className={`flex gap-2 items-start p-4 border-b border-gray-700 ${isPending ? "opacity-60 pointer-events-none " : "opacity-100"}`}>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.name}`} className='w-8 rounded-full overflow-hidden'>
						<img src={postOwner.profileImg || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='flex  flex-col flex-1'>
					<div className='flex gap-2  items-center'>
						<Link to={`/profile/${postOwner.name}`} className='font-bold truncate'>
							{postOwner.Fullname}
						</Link>
						<span className='text-gray-700 max-sm:text-xs flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.name}`}>@{postOwner.name}</Link>
							<span>·</span>
							<span  >{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!isPending && <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />}
								{isPending &&
									<LoadingSpinner size="sm" />
								}
							</span>
						)}
					</div>
					<div className="flex flex-col gap-3 overflow-hidden ">
						<span>{post.text}</span>
						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("Comment_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.Comment?.length}
								</span>
							</div>

							<dialog id={`Comment_modal${post._id}`} className='modal border-none overflow-auto outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>Comment</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.Comment.length === 0 && (
											<p className='text-sm text-slate-500'>
												No Comment yet
											</p>
										)}
										{post.Comment.map((Comment) => (
											<div key={Comment._id} className='flex gap-2 border-b mt-3  border-blue-400 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={Comment.user?.profileImg || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center truncate gap-1'>
														<span className='font-bold'>{Comment.user?.Fullname}</span>
														<span className='text-gray-700 text-sm'>
															@{Comment.user?.name}
														</span>
													</div>
													<div className='text-sm py-2'>{Comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-6 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a Comment...'
											value={comment}
											onChange={(e) => setcomment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? (
												<span className='loading loading-spinner loading-md'></span>
											) : (
												"Post"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>
							<div className='flex gap-1 items-center  group cursor-pointer' onClick={handleLikePost} >
								{!isLiked && (
									<FaHeart className='w-4 h-4 cursor-pointer text-gray-500 ease-in-out transition-transform duration-75  group-hover:text-pink-500  ' />
								)}
								{isLiked && <FaHeart className='w-4 h-4 cursor-pointer text-pink-500 scale-125 transition-transform ease-in-out duration-100' />}

								<span
									className={`text-sm  group-hover:text-pink-500 ${isLiked ? "text-pink-500" : "text-slate-500 "
										}`}
								>
									{post.like?.length}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>
			
		</>
	);
};
export default Post;