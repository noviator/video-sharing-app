import React from 'react'

interface Iprops {
    text: string;
}
// another way to define the type of props (see VideoCard.tsx)
const NoResults = ({text}:Iprops) => {
  return (
    <div>NoResults</div>
  )
}

export default NoResults