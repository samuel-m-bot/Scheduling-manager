import { useGetServicesQuery,servicesApiSlice } from "./servicesApiSlice"
import Services from './Services'



const ServicesList = ({isEdit, isBook}) => {
  
  const {
      data: services,
      isLoading,
      isSuccess,
      isError,
      error
  } = useGetServicesQuery()

  let content

  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isError) {
    content = <h1 className="errmsg">ERROR: {error?.data?.message}</h1>
  } else if (isSuccess) {
    const { ids } = services
  
    const boxContent = ids?.length
      ? ids.map(serviceId => <Services key={serviceId} serviceId={serviceId} isEdit={isEdit} isBook={isBook} />)
      : null
  
    content = (
      <div className='service__container'>
        {boxContent}
      </div>
    )
  } else {
    content = <p>Unknown state</p>
  }
  return content
}
export default ServicesList