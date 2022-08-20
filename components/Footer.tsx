import React from 'react'

import { footerList1, footerList2, footerList3 } from '../utils/constants'


const List = ({ items, mt }: { items: string[], mt: Boolean }) => (
  // mt variable is used to set the margin-top of the list - for the first list it is set to false, for the second and third it is set to true
  <div className={`flex flex-wrap gap-2 ${mt && 'mt-5'}`}>
    {items.map((item: string) => (
      <p key={item} className='text-gray-400 text-sm  hover:underline cursor-pointer' >
        {item}
      </p>
    ))}
  </div>
);



const Footer = () => {
  return (
    <div className='mt-6 hidden xl:block'>
        <List items={footerList1} mt={false} />
        <List items={footerList2} mt />
        <List items={footerList3} mt />
        <p className='text-gray-400 text-sm mt-5'>© 2022 VidApp</p>
    </div>
  )
}

export default Footer