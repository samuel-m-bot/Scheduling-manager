import { useGetServicesQuery } from "./servicesApiSlice"
import Services from './Services'

const ServicesList = () => {

  const {
      data: services,
      isLoading,
      isSuccess,
      isError,
      error
  } = useGetServicesQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
      content = <h1 className="errmsg">ERROR:{error?.data?.message}</h1>
  }

  if (isSuccess) {
      const { ids } = services

      const boxContent = ids?.length
          ? ids.map(serviceId => <Services key={serviceId} serviceId={serviceId} />)
          : null

      content = (
        <div className='public__service'>
          {boxContent}
        </div>
      )
  }

  return content
}
export default ServicesList