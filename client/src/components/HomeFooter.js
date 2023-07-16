import useAuth from "../hooks/useAuth"

const HomeFooter = () => {

    const { firstName, surname, status } = useAuth()

    const content = (
        <footer className="home-footer">
            <p>Current User: {firstName} {surname} </p>
            <p>Status: {status} </p>
        </footer>
    )
    return content
}
export default HomeFooter