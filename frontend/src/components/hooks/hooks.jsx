import toast from "react-hot-toast";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import ProfilePage from "../../pages/profile/Profilepage";


const hooks = () => {
 const queryclient=useQueryClient()
    const {mutate:followlogic,isPending}=useMutation({
        queryKey:["follow"],
        mutationFn:async(user)=>{
            try {
                const res=await fetch(`/api/user/profile/${user._id}`,{
                    method:"POST"
                }
                )
                const data=await res.json()
                toast.success("congulations you "+data+" "+user.name)
                 //console.log(data)
                 
            if (!res.ok) {
					throw new Error(data.error||"internal server error")
				}
          await Promise.all([
                queryclient.invalidateQueries({queryKey:["authUser"]}),
                queryclient.invalidateQueries({queryKey:["sugg"]}),
                queryclient.invalidateQueries({queryKey:["user"]}),
				
          ])
					return 
				}
			
            

			catch (error) {
				toast.error("internal server error")
				console.error(error)
				throw error
			}
        }
        
    })
    return {followlogic,isPending}

    
    
 
}

export default hooks