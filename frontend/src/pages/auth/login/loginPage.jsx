const backendUrl = import.meta.env.VITE_BACKEND_URL;

import { useState } from "react";
import { Link } from "react-router-dom"
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import { useMutation,useQueryClient } from "@tanstack/react-query";
const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		name: "",
		password: "",
	});
  const queryclient= useQueryClient()
	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, name, password }) => {
			try {
				const res = await fetch(`${backendUrl}api/login`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ email, name, password })
				});
				const data = await res.json()
				//console.log(data.success)

				if (!res.ok) {
					throw new Error(data.error||"internal server error")
				}
				if (!data.success) {
					throw new Error(data.error || "unknow error")

				}
				else {
				
						toast.success("Account logged in successfully")
						queryclient.invalidateQueries({queryKey:['authUser']})
					
					//console.log(data)
					return data
				}
			}

			catch (error) {
				toast.error("login failed")
				console.error(error)
				throw error
			}
		
        

		},

	
	})

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData)

	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};



	return (
		<div className='min-w-screen max-w-7xl flex min-h-screen  bg-black  '>
			<div className="hidden justify-center lg:flex flex-1 flex-col  ">
				<div className="border-l-8 text-white font-extrabold rounded border-blue-400 ml-20  ">
					<h1 className="text-7xl pl-10 ">Wellcome</h1>
					<br />
					<h1 className="text-7xl  pl-10">back</h1>
					<br />
					<h1 className="text-7xl  pl-10">to</h1>
					<br />
					<h1 className="text-7xl  pl-10">twitter</h1>
				</div>
				<img src="https://www.shutterstock.com/shutterstock/videos/1063781164/thumb/5.jpg?ip=x480" alt="img" className="object-contain pr-100  h-40 " />
			</div>
			<div className='flex-1 flex w-full   justify-center items-center  '>



				<div className="bg-white border-2  border-zinc-700  min-w-0 mx-2  sm:min-w-xl px-4  py-12 sm:px-10 rounded-3xl sm:py-20 ">
					<form className='flex gap-8 flex-col ' onSubmit={handleSubmit}>

						<h1 className='text-4xl font-extrabold mx-auto text-zinc-800'>Login Form</h1>
						<hr className="h-1 bg-zinc-900" />
						<label className='border-b-2 mt-4 border-gray-400 mx-10 text-zinc-600 flex items-center gap-2'>
							<MdOutlineMail />
							<input
								type='email'
								className='grow text-black focus:outline-0 '
								placeholder='Email'
								name='email'
								onChange={handleInputChange}
								value={formData.email}
							/>
						</label>
						<label className="border-b-2 mt-4 border-gray-400 mx-10 text-zinc-600 flex items-center gap-2">
							<FaUser />
							<input type="text"
								className="grow  text-black focus:outline-0"
								name="name"
								placeholder="Username"
								onChange={handleInputChange}
								value={formData.name}
							/>

						</label>

						<label className='border-b-2 mt-4 border-gray-400 mx-10 text-zinc-600 flex items-center gap-2'>
							<MdPassword />
							<input
								type='password'
								className='grow  text-black focus:outline-0'
								placeholder='Password'
								name='password'
								onChange={handleInputChange}
								value={formData.password}
							/>
						</label>
						<button className='btn rounded-full btn-primary text-white'>{isPending ? "loading..." : "login in"}</button>
						{isError && <p className='text-red-500 mx-auto'>Error: {error.message}</p>}
					</form>
					<div className='inline-flex items-center  mt-6'>
						<p className='text-gray-800 text-sm'>{"Don't"} have an account?</p>
						<Link to='/signup'>
							<button className='pl-10 flex  text-blue-400 '>Signup</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;