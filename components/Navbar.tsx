import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { GoogleLogin, googleLogout } from '@react-oauth/google'
import {AiOutlineLogout} from 'react-icons/ai'
import {BiSearch} from 'react-icons/bi'
import {IoMdAdd} from 'react-icons/io'

import Logo from '../utils/logo.png'
import { createOrGetUser } from '../utils'

import useAuthStore from '../store/authStore'

const Navbar = () => {
  const {userProfile, addUser, removeUser} = useAuthStore();

  return (
    <div className='w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4'>
        <Link href='/'>

          <div className='w-[100px] md:w-[129px] md:h-[30px] h-[38px]v'>
              <Image
                  className='cursor-pointer' 
                  src={Logo} alt="VidApp" 
                  layout='responsive'
                  />
          </div>
        </Link>

          {/* // search form */}
          <div>
            Search
          </div>

          <div>
            {userProfile?
            // upload button
            (<div className='flex gap-5 md:gap-10'>
              <Link href='/upload'>
                <button className='border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2'>
                  <IoMdAdd className='text-xl' />{` `}
                  <span className='hidden md:block'>Upload </span>
                </button>
              </Link>

              {/* show user image */}
              {userProfile.image && (
              <Link href={`/profile/${userProfile._id}`}>
                <div>
                  <Image
                    className='rounded-full cursor-pointer'
                    src={userProfile.image}
                    alt='user'
                    width={40}
                    height={40}
                  />
                </div>
              </Link>)}

              {/* to logout user */}
              <button
                  type='button'
                  className=' border-2 p-2 rounded-full cursor-pointer outline-none shadow-md'
                  onClick={() => {
                    googleLogout();
                    // remove user from local storage(zustand state)
                    removeUser();
                  }}
                >
                  <AiOutlineLogout color='red' fontSize={21} />
              </button>
              {/*  */}
            </div>

            ):(
              <GoogleLogin
              onSuccess={(response) => createOrGetUser(response,addUser)} 
              onError={() => console.log('Login Failed')}
              />
            )}
          </div>

    </div>
  )
}

export default Navbar