
import { useState } from "react";
import {Link} from "react-router-dom"
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
    name:"",
		password: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const isError = false;

	return (
		<div className='min-w-screen flex min-h-screen  bg-black overflow-scroll '>
	  <div className="hidden justify-center lg:flex flex-1 flex-col  ">
     <div className="border-l-8 font-extrabold rounded border-blue-400 ml-20  ">
    <h1 className="text-7xl pl-10 ">Wellcome</h1>
    <br />
    <h1 className="text-7xl  pl-10">back</h1>
    <br />
    <h1 className="text-7xl  pl-10">to</h1>
    <br />
    <h1 className="text-7xl  pl-10">twitter</h1>
    </div>
    <img src="https://www.shutterstock.com/shutterstock/videos/1063781164/thumb/5.jpg?ip=x480" alt="img" className="object-contain pr-100  h-40 "/>
    </div>
			<div className='flex-1 flex w-full   justify-center items-center  '>


				
        <div className="bg-white border-2  border-zinc-700  min-w-0 mx-2  sm:min-w-xl px-4  py-12 sm:px-10 rounded-3xl sm:py-20 ">
				<form className='flex gap-8 flex-col ' onSubmit={handleSubmit}>
		
					<h1 className='text-4xl font-extrabold mx-auto text-zinc-800'>Login Form</h1>
          <hr className="h-1 bg-zinc-900"/>
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
            <FaUser/>
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
					<button className='btn rounded-full btn-primary text-white'>Login</button>
					{isError && <p className='text-red-500'>Something went wrong</p>}
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