import Post from "./post";
import PostSkeleton from "../skeletons/PostSkeleton";
import ProfilePage from "../../pages/profile/Profilepage";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Posts = ({ feedType, userid, username,postLength }) => {
	//console.log(feedType)
	//console.log(userid)
	//console.log(username)
	const queryclient = useQueryClient()
	const getpost = () => {
		if (feedType === "forYou") {
			return '/api/post'
		}
		else if (feedType == "following") {
			return "/api/post/following"
		}
		else if (feedType == "posts") {
			return `/api/post/user/${username}`
		}
		else if (feedType == "likes") {
			return `/api/post/like/${userid}`
		}
		return "/api/post"

	}

	const { data: posts, isLoading, } = useQuery({
		queryKey: ["Posts", feedType],

		queryFn: async () => {
			try {

				const res = await fetch(getpost())
				//console.log(res)
				const data = await res.json()
				if (!res.ok) {
					throw new Error(data.error || "internal server issue")
				}
				//console.log("Fetched posts:", data);
				////console.log(data?.length)
				////console.log(postLength)
				postLength?.(data?.length)

				return data
			} catch (error) {
				console.error(error)
				throw error

			}
		},

	}

	)

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			

			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts is available</p>}

			{!isLoading && posts && (
				<div>
					{posts?.map((post) => (
						<Post key={post._id} post={post}  />


					))}
				</div>
			)}
			




		</>
	);
};
export default Posts;