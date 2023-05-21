import {Outlet} from 'react-router-dom'
import CompanyHeader from './CompanyHeader'
import CompanyFooter from './CompanyFooter'


const CompanyLayout = () => {
  return (
    <>
        <CompanyHeader />
        <div className='company-container'>
            <Outlet />
        </div>
        <CompanyFooter />
    </>
  )
}

export default CompanyLayout