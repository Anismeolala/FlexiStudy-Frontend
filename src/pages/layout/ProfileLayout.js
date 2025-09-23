import React from 'react'


function ProfileLayout({ children }) {
  return (
   <>
    <div className='container' style={{minHeight: '60vh', marginTop: '30px', marginBottom: '100px'}}> 
    {children}
    </div>

   </>
  )
}

export default ProfileLayout