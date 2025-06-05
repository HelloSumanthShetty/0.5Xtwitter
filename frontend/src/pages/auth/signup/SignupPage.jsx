import { Link } from "react-router-dom";
import { useState } from "react";



import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignupPage = () => {
 const[formData,setFormData]=useState({
	name:"",
	email:"",
	Fullname:"",
	password:""

})
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const isError = false;

	return (
		<div className='w-full h-screen flex items-center justify-center'>
            <div className="flex  bg-zinc-800 shadow-2xl  ">
			<div className=' hidden lg:flex w-5/9  '>
				<img src="https://media.licdn.com/dms/image/v2/D5612AQGCTnCarinTmA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1690274190248?e=2147483647&v=beta&t=ePvx5owcYKAKE0aS8za5qufIJxtG4Ve6Ir58od6LYg0" className=' flex-1 min-h-screen border-2   border-black ' />
			</div>
        
			<div className='flex-1 flex flex-col max-md:p-6 bg-gray-800 border-2 h-150 min-md:mt-15 max-md:h-auto  border-zinc-900 mx-4 rounded-2xl shadow-slate-700 shadow-2xl justify-center items-center'>
				<form className='lg:w-2/3 md:w-2/3 mx-auto md:mx-20  flex gap-6 flex-col' onSubmit={handleSubmit}>
					
					<h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
					<label className='input input-bordered rounded flex items-center  gap-2'>
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
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='username'
								name='name'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
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
					</div>
					<label className='input input-bordered rounded flex items-center gap-2'>
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
					<button className='btn rounded-full btn-primary text-white'>Sign up</button>
					{isError && <p className='text-red-500'>Something went wrong</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
            </div>
            </div>
		
	);
};

export default SignupPage