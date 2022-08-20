import type { NextPage } from 'next'
import axios from 'axios'
import {Video} from '../types' // import the type definition for the Video type
import VideoCard from '../components/VideoCard'
import NoResults from '../components/NoResults'

interface Iprops {
  videos: Video[]
}


const Home = ({videos } : Iprops) => {
  // videos is of type Iprops (defined above)
  console.log(videos)
  return (
    <div className='flex flex-col gap-10 videos h-full'>
      {
        videos.length ? 
        videos?.map((video: Video) => (
            <VideoCard post={video}  key={video._id} />
          )) 
          : <NoResults text={`No Videos`} />
      }
    </div>
  );
}

// fetch data in next.js
// used to fetch new videos each time the page is loaded
export const getServerSideProps = async () => {
   const {data} = await axios.get('http://localhost:3000/api/post')
   
   // props gets automatically passed to the page (Home)  and can be accessed in the page using this.props.posts  
   return{
      props: {
        videos: data
      }
   }
}

export default Home
