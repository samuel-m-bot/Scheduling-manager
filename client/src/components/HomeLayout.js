import {Outlet} from 'react-router-dom'
import HomeHeader from './HomeHeader'
import HomeFooter from './HomeFooter'
import ChatBox from '../features/chat/ChatBox'


const HomeLayout = () => {
  return (
    <>
        <HomeHeader />
        <div className='company-container'>
            <Outlet />
        </div>
        <ChatBox/>
        <HomeFooter />
    </>
  )
}

export default HomeLayout