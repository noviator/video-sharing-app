import React from 'react'
import { useState, useEffect } from 'react'

import { MdFavorite } from 'react-icons/md'
import useAuthStore from '../store/authStore'

interface Iprops {
    handleLike : () => void;
    handleDislike : () => void;
    likes: any[];
}

const LikeButton = ({handleLike,handleDislike, likes}:Iprops) => {
    const [alreadyLiked, setAlreadyLiked] = useState(false);// has user already liked the video
    const {userProfile}:any = useAuthStore();// get user profile from authStore (logged in user)    


    // check if user has already liked the post
    const filterLikes = likes?.filter(like => like._ref === userProfile?._id);


    useEffect(() => {
        if (filterLikes?.length > 0) {
            setAlreadyLiked(true);
        } else {
            setAlreadyLiked(false);
        }
    }, [filterLikes, likes]);

  return (
    <div className='flex gap-6'>
        <div className='mt-4 flex flex-col justify-center items-center cursor-pointer'>
            {alreadyLiked ? (
                <div className='bg-primary rounded-full p-2 md:p-4 text-[#F51997] ' onClick={handleDislike} >
                    <MdFavorite className='text-lg md:text-2xl' />
                </div>
            ):(
                <div className='bg-primary rounded-full p-2 md:p-4 ' onClick={handleLike} >
                    <MdFavorite className='text-lg md:text-2xl' />
                </div>
            )}

            {/* number of likes */}
            <p className='text-md font-semibold '>{likes?.length || 0}</p>

        </div>

    </div>
  )
}

export default LikeButton