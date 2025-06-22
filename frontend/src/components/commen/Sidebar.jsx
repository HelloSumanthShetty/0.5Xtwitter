
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, } from "react-router-dom";
import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { IoLogoTwitter } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const Sidebar = () => {
	const { data: authuser } = useQuery({ queryKey: ["authUser"] })
	
	const queryclient = useQueryClient()

	const { mutate: logout, isError, isPending, error } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/logout", {
					method: "POST"
				})

				if (!res.ok) {
					throw new Error("Logout failed due to server error");
				}


				const data = await res.json()
				//console.log(data)


				queryclient.invalidateQueries({ queryKey: ["authUser"] })

				toast.success("successfully logged out")



			}
			catch (error) {
				toast.error("something when wrong")
				console.error(error.message)
				throw error

			}
		}

	})
	function handleit() {

		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});

	}




	return (
		<div className='md:flex-[2_2_0]    w-10 max-sm: max-w-50'>
			<div className='sticky   top-0 max-sm:left-0  min-h-screen flex flex-col border-r border-gray-700 w-10 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start'>
					<FaXTwitter onClick={() => handleit()} className='px-2 w-12 h-12 outline-none rounded-lg text-blue-500 hover:scale-140 md:mx-5  ease-in-out transition-transform duration-300 ' />
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							onClick={() => handleit()}
							className='flex gap-3 items-center hover:bg-primary transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							onClick={() => handleit()}
							className='flex gap-3 items-center hover:bg-primary transition-all rounded-full  duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authuser?.name}`}
							onClick={() => handleit()}
							className='flex gap-3 items-center hover:bg-primary transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>
				</ul>
				
				{authuser && (
					<Link
						to={`/profile/${authuser?.name}`}
						className='mt-auto  mb-10 flex gap-2 mr-2 items-start transition-all sm:bg-zinc-700 duration-300 hover:bg-primary sm:py-2 max-sm:px-3 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full'>
								<img src={authuser?.profileImg || "/avatar-placeholder.png"} />

							</div>
						</div>
						<div className='flex justify-between flex-1  '>
							<div className='hidden md:block'>
								<p className='text-white font-bold text-sm w-20 truncate'>{authuser?.Fullname}</p>
								<p className='text-slate-500 truncate text-sm'>@{authuser?.name}</p>
							</div>
							<div className=" text-red-500 rounded-full 
							  items-center  sm:p-3 ">
								<BiLogOut className='w-5 h-7  cursor-pointer' onClick={(e) => {
									e.preventDefault()
									logout()
								}} />
							</div>
						</div>
					</Link>


				)}


			</div>
		</div>
	);
};
export default Sidebar;