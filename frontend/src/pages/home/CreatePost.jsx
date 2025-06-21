import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { useMutation,useQuery, useQueryClient } from "@tanstack/react-query";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const {data:authuser}=useQuery({queryKey:["authUser"]})	
  const queryclient=useQueryClient()
	const imgRef = useRef(null);

	// const isPending = false;
	// const isError = false;
 const {mutate:createPost,isError,isPending}=useMutation({
	mutationFn:async({text,img})=>{
		try {
			const res=await fetch(`/api/post/`,{
				method:"POST",
				headers:{
					"Content-Type":"application/json"
				},
				body:JSON.stringify({text,img})
			})
			const data=await res.json()
         console.log(data)
			if(!res.ok){
				throw new Error(data.error||"internal server error")
			}

      return data

		} catch (error) {
			toast.error("internal server error")
			console.error(error)
			throw error
 		}
	},
	onSuccess:()=>{
	setText("")
	setImg(null)
    toast.success("posted")
	queryclient.invalidateQueries({queryKey:["Posts"]})
	
	}
 })
	const data = {
		profileImg: "/avatars/boy1.png",
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({text,img})
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		console.log(file)
		 if (file) {
			const reader = new FileReader();
		 	console.log(reader)
		 	reader.onload = () => {
				setImg(reader.result);
				
			};
			reader.readAsDataURL(file);
		}
	}

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar '>
				<div className='w-8 rounded-full'>
					<img src={authuser.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full focus:mt-6  p-0 text-lg resize-none border-none top-2 focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-1  z-10 text-white bg-gray-800 hover:scale-120 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='text-blue-400 w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className=' w-5 h-5 text-blue-500  cursor-pointer' />
					</div>
					<input type='file' hidden ref={imgRef} accept="image/*" onChange={handleImgChange} />
					<button className='btn btn-primary bg-blue-700 shadow-md shadow-blue-600 rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>Something went wrong</div>}
			</form>
		</div>
	);
};
export default CreatePost;