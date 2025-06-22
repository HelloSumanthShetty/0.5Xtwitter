import { Link } from "react-router-dom";
import { useState } from "react";



import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignupPage = () => {

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		Fullname: "",
		password: ""

	})

	const queryclient = useQueryClient()
	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ name, email, Fullname, password }) => {
			try {
				const res = await fetch("/api", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ name, email, Fullname, password })
				});
				const data = await res.json()
				if (!res.ok) {
					throw new Error(data.error||"internal server issue")
				}
				
				//console.log(data.success)
			

				toast.success("Account creation was successful")
				queryclient.invalidateQueries({queryKey:["authUser"]})

				

				return data
			}

			catch (error) {

				console.error(error)

				toast.error("something when wrong")
				throw error
			}

		},

	})
	const handleSubmit = (e) => {


		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};



	return (
		<div className='min-w-screen  bg-blue-300 min-h-screen flex items-center justify-center'>
			<div className="flex border-4 md:mx-auto max-h-auto md:min-w-5/12 overflow-hidden rounded-4xl  border-gray-400 shadow-blue-400  shadow-2xl  ">
				{/* <div className=' hidden lg:flex max-w-4/8 '>
					<img src="https://media.licdn.com/dms/image/v2/D5612AQGCTnCarinTmA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1690274190248?e=2147483647&v=beta&t=ePvx5owcYKAKE0aS8za5qufIJxtG4Ve6Ir58od6LYg0" className=' flex-1  ' />
				</div> */}

				<div className='md:flex-1  flex flex-col max-md:p-6  bg-white h-150 max-h-auto  justify-center items-center'>
					<form className='lg:w-3/6 md:w-3/6    text-white md:mx-20 focus:outline-none flex gap-6 flex-col' onSubmit={handleSubmit}>

						<h1 className='text-4xl font-extrabold  text-gray-400'>Join today.</h1>
						<label className='input input-bordered rounded flex items-center bg-gray-600   gap-2'>
							<MdOutlineMail />
							<input
								type='email'
								className='grow'
								placeholder='Email'
								name='email'
								onChange={handleInputChange}
								value={formData.email}
							/>
						</label>
						
							<label className='input input-bordered  rounded bg-gray-600 flex items-center gap-2'>
								<FaUser />
								<input
									type='text'
									className='grow '
									placeholder='username'
									name='name'
									onChange={handleInputChange}
									value={formData.name}
								/>
							</label>
							<label className='input input-bordered rounded bg-gray-600 flex items-center gap-2 '>
								<MdDriveFileRenameOutline />
								<input
									type='text'
									className='grow'
									placeholder='Fullname'
									name='Fullname'
									onChange={handleInputChange}
									value={formData.Fullname}
								/>
							</label>
						
						<label className='input input-bordered rounded bg-gray-600  flex items-center gap-2'>
							<MdPassword />
							<input
								type='password'
								className='grow'
								placeholder='Password'
								name='password'
								onChange={handleInputChange}
								value={formData.password}
							/>
						</label>

						<button className='btn rounded-full btn-primary font-semibold  text-white'>{isPending ? "Signing..." : "Sign up"}</button>
						{isError && <p className='text-red-500 mx-auto'>{error.message}</p>}
					</form>
					<div className='flex flex-col lg:w-2/3 gap-2 mt-5'>
						<p className='text-black text-lg'>Already have an account?</p>
						<Link to='/login'>
							<button className='btn rounded-full btn-primary font-semibold text-blue-400  btn-outline w-full'>Sign in</button>
						</Link>
					</div>
				</div>
			</div>
		</div>

	);
};

export default SignupPage