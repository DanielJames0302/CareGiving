import React, { useState } from 'react'
import './admin-dashboard.css'
import CertificateRequests from './certificate-requests';
import CreateActivityForm from './create-activity-form';



const AdminDashboard  = () => {
  const [option, setOption] = useState(0)

  return (
    <div className='admin-dashboard'>
       <div className="admin-dashboard-wrapper">
          <div className='admin-dashboard-content-left'>
             <div className='menu-list'>
                <button className={option===0 ? 'option-btn chosen' : 'option-btn'} onClick={() => setOption(0)}> Certificate Requests</button>
                <button className={option===1 ? 'option-btn chosen' : 'option-btn'} onClick={() => setOption(1)}> Create Activity</button>

             </div>
          </div>
          <div className='admin-dashboard-content-right'>
            {option === 0 ? <CertificateRequests /> : null}
            {option === 1 ? <CreateActivityForm /> : null}
          </div>
       </div>
    </div>
  )
}

export default AdminDashboard
