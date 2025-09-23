import React from 'react'
import SideBar from '../../components/SideBar/SideBar'
import './AdminLayout.css' // Tạo file CSS mới này

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <SideBar />          
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout