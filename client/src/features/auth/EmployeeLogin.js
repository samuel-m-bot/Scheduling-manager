import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'

import usePersist from '../../hooks/usePersist'

const EmployeeLogin = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, password])


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken, role } = await login({ email, password }).unwrap()
            console.log("PASSED TEST")
            // Check if role is not 'admin' or 'employee'
            if (role !== 'admin' && role !== 'employee') {
                console.log("failded TEST")
                window.alert("Only admins and employees are authorized for this login.")
                navigate('/')
                throw new Error('Only admins and employees are authorized for this login.')
                
            }
    
            dispatch(setCredentials({ accessToken, role }))  // pass role into setCredentials
            setEmail('')
            setPassword('')
            navigate('/company')  // adjust navigation based on role
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Email or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.message || err.data?.message);
            }
            errRef.current.focus();
        }
    }
    

    const handleEmailInput = (e) => setEmail(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = (e) => setPersist(prev => !prev)


    const errClass = errMsg ? "errmsg" : "offscreen"

    if (isLoading) return <p>Loading...</p>

    const content = (
        <>
            <header className='public__header'>
                <nav class="nav-bar">
                    <div class="nav-section left">
                        <Link to="/"><h1>Quick Fix</h1></Link>
                    </div>
                    <div class="nav-section center">
                        <Link to="/">Home</Link>
                    </div>
                    <div class="nav-section right">
                        <select id="language-selector">
                            <option value="english" selected>English</option>
                            <option value="spanish">Español</option>
                            <option value="french">Français</option>
                        </select>
                    </div>
                </nav>
            </header>
            <section className="userLoginSection">
            <div>
                    <h1>Employee Login</h1>
                </div>
                <main className="userLoginMain">
                    <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                    <form className="userLoginForm" onSubmit={handleSubmit}>
                            <label htmlFor="email" className='userLoginLabel'>Email:</label>
                            <input
                                className="userLoginInput"
                                type="text"
                                id="email"
                                ref={userRef}
                                value={email}
                                onChange={handleEmailInput}
                                autoComplete="off"
                                required
                            />

                            <label htmlFor="password" className='userLoginLabel'>Password:</label>
                            <input
                                className="userLoginInput"
                                type="password"
                                id="password"
                                onChange={handlePwdInput}
                                value={password}
                                required
                            />
                            <button className="userLoginSubmitButton">Sign In</button>

                            <label htmlFor="persist" className="userLoginPersistLabel">
                                <input
                                    type="checkbox"
                                    className="form__checkbox"
                                    id="persist"
                                    onChange={handleToggle}
                                    checked={persist}
                                />
                                Trust This Device
                            </label>
                        </form>
                </main>
                <footer>
                    <Link to="/">Back to Home</Link>
                </footer>
            </section>
        </>
    )

    return content
}
export default EmployeeLogin