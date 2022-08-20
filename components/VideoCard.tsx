import React from 'react'
import {Video} from '../types'
import {NextPage} from 'next'
import {useState, useEffect, useRef} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {HiVolumeUp, HiVolumeOff} from 'react-icons/hi'
import {BsFillPlayFill, BsFillPauseFill, BsPlay} from 'react-icons/bs'
import {GoVerified} from 'react-icons/go'

interface Iprops {
    post : Video;
}

// another way to define the type of props (see NoResults.tsx)
const VideoCard:NextPage<Iprops> = ({post}) => {
    const [isHover, setIsHover] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    
    // inside <> is the type of the variable
    const videoRef = useRef<HTMLVideoElement>(null); // create a ref to the video element (used to control the video) (it's like document.getElementById('video') in HTML)


    const onVideoPress = () => {
        // ? is used so that the app doesn't crash if the video is not loaded yet (videoRef is null)    
        if(playing) {
            videoRef?.current?.pause();
            setPlaying(false);
        } else {
            videoRef?.current?.play();
            setPlaying(true);
        }
    }

    // runs every time a video is muted/unmuted
    useEffect(() => {
        if(videoRef?.current) {
            videoRef.current.muted = isVideoMuted;
        }
    } , [isVideoMuted]); 
    

  return (
    <div className='flex flex-col border-b-2 border-gray-200 pb-6'>
        <div>
            <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded'>
                <div className='md: w-16 md:h-16 w-10 h-10'>
                    <Link href={`/profile/${post.postedBy._id}`}>
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
                    <Link href={`/profile/${post.postedBy._id}`}>
                        <div className='flex items-center gap-2'>
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
        </div>

        {/* // video card */}
        <div className='lg:ml-20 flex gap-4 relative'>
            <div
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)} 
                className='rounded-3xl'>
                 <Link href={`/detail/${post._id}`}>
                    <video
                        loop
                        className='lg:w-[600px] h-[300px] md:h-[400px] lg:h-[530px] w-[200px] rounded-2xl cursor-pointer bg-gray-100'
                        ref={videoRef}
                        src={post.video.asset.url}
                    ></video>
                 </Link>


                {/* // if hovering over video show play/pause button and a mute button */}
                {/* // 4 buttons play, pause, mute, unmute */}
                
                {isHover && (
                    <div className='absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] lg:w-[600px] p-3'>
                        {playing ? (
                            <button onClick={onVideoPress}>
                                <BsFillPauseFill className='text-black text-2xl lg:text-4xl'/> 
                            </button>
                        ) : (
                            <button onClick={onVideoPress}>
                                <BsFillPlayFill className='text-black text-2xl lg:text-4xl'/>
                            </button>
                        )}

                        {isVideoMuted ? (
                            <button onClick={() => setIsVideoMuted(false)}>
                                <HiVolumeOff  className='text-black text-2xl lg:text-4xl'/> 
                            </button>
                        ) : (
                            <button onClick={() => setIsVideoMuted(true)}>
                                <HiVolumeUp  className='text-black text-2xl lg:text-4xl'/>
                            </button>
                        )}
                    </div>
                    )}
            </div>
        </div>
    </div>
  )
}

export default VideoCard