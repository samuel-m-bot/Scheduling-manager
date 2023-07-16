import {Outlet} from 'react-router-dom'
import CompanyHeader from './CompanyHeader'
import CompanyFooter from './CompanyFooter'
import ChatBox from '../features/chat/ChatBox'


const CompanyLayout = () => {
  return (
    <div className='company-layout'>
        <CompanyHeader />
        <div className='company-container'>
            <Outlet />
        </div>
        <ChatBox/>
        <CompanyFooter />
    </div>
  )
}


export default CompanyLayout