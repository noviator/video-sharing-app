import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import { GoVerified } from 'react-icons/go'
import { MdOutlineCancel } from 'react-icons/md'
import { BsFillPlayFill } from 'react-icons/bs'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'

import axios from 'axios'
import { BASE_URL } from '../../utils'
import { Video } from '../../types'
import useAuthStore from '../../store/authStore'
import LikeButton from '../../components/LikeButton'
import Comments from '../../components/Comments'

interface Iprops {
    postDetails: Video
}

const Detail = ({postDetails}:Iprops) => {
  const [post, setPost] = useState(postDetails);
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [comment, setComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const { userProfile }: any = useAuthStore();

  const router = useRouter();

  const onVideoClick = () => {
    if(playing) {
        videoRef?.current?.pause();
        setPlaying(false);
    } else {
        videoRef?.current?.play();
        setPlaying(true);
    }
  }

  // runs every time a video is muted/unmuted and when a new post is loaded
  useEffect(() => {
      if(post && videoRef?.current) {
          videoRef.current.muted = isVideoMuted;
      }
  } , [post, isVideoMuted]); 

  const handleLike = async (like:boolean) => {
    if(userProfile){
      // update something in the database => PUT request
      const {data} = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like: like
      })

      // setting objects (spread previous state of the post, select the property which we want to update and set it to the new value)
      setPost({...post, likes: data.likes});
    }
  }

  const addComment = async (e:any) => {
    e.preventDefault();
    if(userProfile && comment){
      setIsPostingComment(true);
      // add something to document => PUT request
      const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
        userId: userProfile._id,
        comment: comment
      })
      setPost({...post, comments: data.comments});
      setComment('');
      setIsPostingComment(false);
    }
  }


  if(!post) return null;



  return (
    <div className='flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap'>
      <div className='relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-blurred-img bg-no-repeat bg-cover bg-center'>
        <div className='opacity-90 absolute top-6 left-2 lg:left-6 flex gap-6 z-50'>
          <p className='cursor-pointer' onClick={()=>{router.back()}}>
            <MdOutlineCancel className='text-white text-[35px] hover:opacity-90' />
          </p>
        </div>

        {/* video is inside this div */}
        <div className='relative'>
          <div className='lg:h-[100vh] h-[60vh]'>
            <video src={post?.video?.asset.url}
            ref={videoRef}
            loop
             onClick={onVideoClick}
            >
            </video>
          </div>

          {/* play icon */}
          <div className='absolute top-[45%] left-[40%]  cursor-pointer'>
            {!playing&&(
              <button onClick={onVideoClick}>
                <BsFillPlayFill className='text-white text-6xl lg:text-8xl' />
              </button>
            )}
          </div>
        </div>

        {/* mute unmute functionality*/}
        <div className='absolute bottom-5 lg:bottom-10 right-5 lg:right-10  cursor-pointer'>
          {isVideoMuted ? (
              <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff  className='text-white text-2xl lg:text-4xl'/> 
              </button>
          ) : (
              <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp  className='text-white text-2xl lg:text-4xl'/>
              </button>
          )}
        </div>
      </div>

      {/* post details */}
      <div className='relative w-[1000px] md:w-[900px] lg:w-[700px]'>
        <div className='lg:mt-20 mt-10'>

          <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded'>
                <div className='ml-4 md: w-16 md:h-16 w-20 h-20'>
                  <Link href="">
                      {/* Image cannot be child component of a Link => wrap image in <> */}
                      <>                
                      <Image
                          width={62}
                          height={62}
                          className=' rounded-full'
                          src={post.postedBy?.image}
                          alt='user-profile'
                          layout='responsive'
                          />
                      </>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                      <div className='mt-3 flex flex-col gap-2'>
                          <p className='flex gap-2 items-center md:text-md font-bold text-primary'>
                              {post.postedBy.userName}{` `}
                              <GoVerified className ='text-blue-400 text-md'/>
                          </p>
                          <p className='capitalize font-medium text-xs text-gray-500 hidden md:block'>
                              {post.postedBy.userName}
                          </p>
                      </div>
                  </Link> 
                </div>
            </div>

            {/* Caption */}
            <p className='px-10 text-md text-gray-600'>{post.caption}</p>

            {/* Likes */}
            <div className='mt-10 px-10'>
              {userProfile && (
              <LikeButton
                likes={post.likes}
                // flex='flex'
                handleLike={() => handleLike(true)}
                handleDislike={() => handleLike(false)}
              />)}
            </div>

            {/* comments */}
            <Comments
              comment={comment}
              setComment={setComment}
              addComment={addComment}
              comments={post.comments}
              isPostingComment={isPostingComment}
            />
            
        </div>
      </div>


    </div>
  )
}

// fetch data for the detailed page
// get the id from the url

// first parameter of funcion contains params, which is destructured to get id
// this defines the type of the id { params:{ id:string }
export const getServerSideProps = async ({ params:{ id } } : { params:{ id:string } }) => {
    const {data} = await axios.get(`${BASE_URL}/api/post/${id}`) 

    return {
      props: {postDetails: data}
    }
}

export default Detail