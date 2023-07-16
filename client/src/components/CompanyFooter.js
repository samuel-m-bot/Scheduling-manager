import useAuth from "../hooks/useAuth"

const CompanyFooter = () => {

    const { firstName, surname, status } = useAuth()

    const content = (
        <footer className="company-footer">
            <p>Current User: {firstName} {surname} </p>
            <p>Status: {status} </p>
        </footer>
    )
    return content
}
export default CompanyFooter