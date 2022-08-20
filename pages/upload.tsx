import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import axios from 'axios'
import { SanityAssetDocument } from '@sanity/client'

import useAuthStore from '../store/authStore'
import { client } from '../utils/client'
import { topics } from '../utils/constants'
import { BASE_URL } from '../utils'

const Upload = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // if not loading there are 2 states: default state => file not uploaded , other one => file uploaded
    // type is SanityAssetDocument or undefined, in the beginning it is undefined
    const[videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>()

    // check for wrong file type of video
    const [wrongFileType, setWrongFileType] = useState(false)

    const [caption, setCaption] = useState('')
    const [category, setCategory] = useState(topics[0].name)
    const [savingPost, setSavingPost] = useState(false) // tells if we are currently saving the post

    // get user from zustand(local storage) 
    const { userProfile } :{ userProfile: any} = useAuthStore() // type of user is any


    const uploadVideo = async (e:any) => {
        const selectedFile = e.target.files[0]
        const fileTypes = ['video/mp4', 'video/webm', 'video/ogg']

        // check if correct format video is uploaded by user
        if(fileTypes.includes(selectedFile.type)) {
            // upload files to sanity
            client.assets.upload('file', selectedFile,{
                contentType:selectedFile.type,
                filename: selectedFile.name,
            }).then(data => {
                setVideoAsset(data)
                setWrongFileType(false)
            })
        }else{
            setIsLoading(false)
            setWrongFileType(true)
        }

    }

    const handlePost = async () => {
        // caption , category and videoAsset are required fields to post a video

        // we have already uploaded the video to sanity in the above function so videoAsset._id exists
        if(caption && videoAsset?._id && category){
            setSavingPost(true)


            const document = {
                _type:'post',
                caption,
                // we are connecting videoAsset to the post 
                // _ref => reference to the asset in the sanity database
                video:{
                    _type:'file',
                    asset:{
                        _type:'reference',
                        _ref:videoAsset?._id,
                    }
                },
                // connecting video with the user
                userId: userProfile?._id,
                postedBy:{
                    _type:'postedBy',
                    _ref:userProfile?._id,
                },
                topic:category
            }


            await axios.post(`${BASE_URL}/api/post`, document);

            router.push('/') // push to home page after uploading the video
        }
    }


  return (
    <div className='flex w-full h-full absolute left-0 top-[60px] lg:top-[70px] mb-10 pt-10 lg:pt-20 bg-[#F8F8F8] justify-center'>
        <div  className=' bg-white rounded-lg xl:h-[80vh] flex gap-6 flex-wrap justify-center items-center p-14 pt-6'>
            <div>
                <div>
                    <p className='text-2xl font-bold'>Upload Video</p>
                    <p className='text-md text-gray-400 mt-1'>Post a video to your account</p>
                </div>
                <div className=' border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center  outline-none mt-10 w-[260px] h-[460px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100'>
                    {isLoading?(
                        <p>Uploading ...</p>
                    ): (
                        <div>
                            {videoAsset?(
                                <div>
                                    <video src={videoAsset.url}
                                    loop
                                    controls
                                    className='rounded-xl h-[460px] mt-16 bg-black'
                                    >

                                    </video>

                                </div>
                                ):(
                                    <label className='cursor-pointer'>
                                        <div className='flex flex-col items-center justify-center h-full'>
                                            <div className='flex flex-col justify-center items-center'> 
                                                <p className='font-bold text-xl'>
                                                     <FaCloudUploadAlt className='text-gray-300 text-6xl' />
                                                </p>
                                                <p className='text-xl font-semibold'>
                                                    Upload Video
                                                </p>
                                            </div>

                                            <p className='text-gray-400 text-center mt-10 text-sm leading-10'>
                                                MP4 or WebM or ogg <br />
                                                720x1280 resolution or higher <br />
                                                Up to 10 minutes <br />
                                                Less than 2 GB
                                            </p>

                                            <p className='bg-[#F51997] text-center mt-8 rounded text-white text-md font-medium p-2 w-52 outline-none'>
                                                Select File
                                            </p>
                                        </div>
                                        {/* button to upload file on click  */}
                                        <input
                                            type='file'
                                            name='upload-video'
                                            // onChange={(e) => uploadVideo(e)} // both methods are correct
                                            onChange={uploadVideo} // if we call a function and pass an event we can use it like this also
                                            className='w-0 h-0'
                                            />

                                        
                                    </label>
                                )}

                        </div>
                    )}
                    {wrongFileType && (
                        <p className='text-center text-xl text-red-400 font-semibold mt-4 w-[260px]'>
                            please select correct video file type (mp4 or webm or ogg)
                        </p>
                    )}
                </div>
            </div>
                <div className='flex flex-col gap-3 pb-10'>
                    <label className='text-md font-medium '>Caption</label>
                    <input
                        type='text'
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className='rounded lg:after:w-650 outline-none text-md border-2 border-gray-200 p-2'
                    />
                    <label className='text-md font-medium'>Choose a category</label>
                    <select
                        onChange={(e) => { setCategory(e.target.value);}}
                        className='outline-none  border-2 border-gray-200 text-md capitalize lg:w-650 lg:p-4 p-2 rounded cursor-pointer'
                    >
                        {topics.map((topic) => (
                            <option
                                key={topic.name}
                                className=' outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'
                                value={topic.name}
                            > {topic.name} </option>
                        ))}
                    </select>


                    {/* button to upload and discard video */}
                    <div className='flex gap-6 mt-10'>
                        <button
                            // onClick={handleDiscard}
                            type='button'
                            className='border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
                        > 
                            Discard
                        </button>

                        <button
                            onClick={handlePost}
                            type='button'
                            className='bg-[#F51997] text-white border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
                        > 
                            Post
                        </button>
                    </div>
                </div>
        </div>

    </div>
  )
}

export default Upload