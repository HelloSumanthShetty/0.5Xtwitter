import { useRef, useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery,useQueryClient } from "@tanstack/react-query";
import useUpdateUserProfile from "../../components/hooks/useUpdateUserProfil.jsx";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./Editmodel";
import { POSTS } from "../../utils/db/dummy";
import hooks from "../../components/hooks/hooks.jsx";
import Posts from "../../components/commen/posts.jsx";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
 import { useParams } from "react-router-dom";
import dayjs from "dayjs";


 

const ProfilePage = () => {
	const {followlogic}=hooks()
    
	const {data:authuser}= useQuery({queryKey:["authUser"]})

	const [coverImg, setCoverImg] = useState(null);
	const [postLength, setPostLength] = useState(0);
	const queryClient=useQueryClient()
	const [profileImg, setProfileImg] = useState(null);
	const [feedType, setFeedType] = useState("posts");
   const { username } = useParams();
   //console.log(username)
	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);

 const {data:user,isLoading}=useQuery({
	queryKey:["user",username],
	queryFn:async()=>{
		
		try {
			const res=await fetch(`/api/user/profile/${username}`,{
				method:"GET"
			})
			const data=await res.json()
			if(!res.ok){
				throw new Error(data.error||"internal server error")
			}
			await Promise.all([
			queryClient.invalidateQueries({queryKey:["authUser"]}),
			queryClient.invalidateQueries({queryKey:["Posts"]})
			
			])
			//console.log(data)
			return data


		} catch (error) {
		  console.error(error||"internal server error")	
		}
	},
	
  })

	
	const isMyProfile = authuser?._id===user?._id;
	const isfollowing=authuser.following?.includes(user?._id)
	////console.log({authuser})
	//console.log("what"+isfollowing)
		const joindate=dayjs(user?.createdAt).format("DD MMMM YYYY")
	// //console.log(authuser?._id)
	// //console.log(user?._id)
	// //console.log(isMyProfile)
	////console.log(postlen)
 
	const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

	

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "coverImg" && setCoverImg(reader.result);
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};
	useEffect(() => {
  window.scrollTo({
	top:0,
	behavior:"smooth"
  }); }, []);

	return (
		<>
			<div className='flex-[4_4_0]  border-r   border-gray-700 min-h-screen '>
				{/* HEADER */}
				{isLoading && <ProfileHeaderSkeleton />}
				{!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.Fullname}</p>
									<span className='text-sm text-slate-400'>{postLength} posts</span>
								</div>
							</div>
							{/* COVER IMG */}
							<div className='relative group/cover'>
								<img
									src={coverImg || user?.coverimg || "/cover.png"}
									className='h-52 w-full object-cover'
									alt='cover image'
								/>
								{isMyProfile && (
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-blue-400 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
										onClick={() => coverImgRef.current.click()}
									>
										<MdEdit className='w-5 h-5 z-10 text-white ' />
									</div>
								)}

								<input
									type='file'
									hidden
                                    accept="image/*"
									ref={coverImgRef}
									onChange={(e) => handleImgChange(e, "coverImg")}
								/>
								<input
									type='file'
									hidden
                                    accept="image/*"
                                    ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")}
								/>
								{/* USER AVATAR */}
								<div className='avatar absolute -bottom-16 left-4'>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 z-10 text-white'
													onClick={() => profileImgRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='flex justify-end px-4 mt-5'>
								{isMyProfile && <EditProfileModal />}
								{!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault
										
											followlogic(user)
										}}
									>
										{isfollowing?"Unfollow":"follow"}
									</button>
								)}
								{(coverImg || profileImg) && (
									<button
										className='btn btn-primary bg-blue-500 font-semibold rounded-full btn-sm text-white px-4 ml-2'
										onClick={async () => {
											await updateProfile({ coverImg, profileImg });
											setProfileImg(null);
											setCoverImg(null);
										}}
									>
										{isUpdatingProfile ? "Updating..." : "Update"}
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.Fullname}</span>
									<span className='text-sm text-slate-500'>@{user?.name}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
										<div className='flex gap-1 items-center '>
											<>
												<FaLink className='w-3 h-3 text-slate-500' />
												<a
													href={user?.link}
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-500 hover:underline'
												>
													{user?.link}
												</a>
											</>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>Joined {joindate}</span>
									</div>
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.following.length}</span>
										<span className='text-slate-500 text-xs'>Following</span>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.follower.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</div>
								</div>
							</div>
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-zinc-500 hover:text-white rounded-md transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("posts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-blue-500' />
									)}
								</div>
								<div
									className='flex justify-center flex-1 p-3 text-slate-500 rounded-md 	hover:bg-zinc-500 hover:text-white transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-blue-500' />
									)}
								</div>
							</div>
						</>
					)}

					{user &&<Posts feedType={feedType} userid={user?._id} username={user?.name} postLength={setPostLength} />}
				</div>
			</div>
		</>
	);
};
export default ProfilePage;