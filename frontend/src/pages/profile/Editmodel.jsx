import { useState, useEffect } from "react";
import useUpdateUserProfile from "../../components/hooks/useUpdateUserProfil";
import { useQuery } from "@tanstack/react-query";
const EditProfileModal = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] })
	const [formData, setFormData] = useState({
		Fullname: "",
		name: "",
		email: "",
		bio: "",
		link: "",
		confirmedpassword: "",
		currentpassword: "",
		newpassword: ""
	});

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				confirmedpassword: "",
				currentpassword: "",
				newpassword: ""
			});
		}
	}, [authUser]);


	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-blue-400 rounded p-2 input-md'
								value={formData.Fullname}
								name='Fullname'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='name'
								className='flex-1 input border border-blue-400 rounded p-2 input-md'
								value={formData.name}
								name='name'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-blue-400 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-blue-400 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-blue-400 rounded p-2 input-md'
								value={formData.currentpassword}
								name='currentpassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-blue-400 rounded p-2 input-md'
								value={formData.newpassword}
								name='newpassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='confirmed Password'
								className='flex-1 input border border-blue-400 rounded p-2 input-md'
								value={formData.confirmedpassword}
								name='confirmedpassword'
								onChange={handleInputChange}
							/>


						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-blue-400 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white'>{isUpdatingProfile ? "Updating..." : "Update"}</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;