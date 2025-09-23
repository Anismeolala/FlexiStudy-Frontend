import React from 'react'
import Header from '../../components/Header/Header'
import { Outlet } from 'react-router-dom'

function UserLayout() {
  return (
   <>
   <Header/>
   <div style={{minHeight: "65vh"}}>
    <Outlet/>
   </div>
   </>
  )
}

export default UserLayout