const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const foundUser = await User.findOne({ email }).exec()

    if(!foundUser){
        console.log("EMAIL")
        return res.status(401).json({ message: 'Unauthorized'})
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if(!match){
        console.log("PASSWORD")
        return res.status(401).json({ message: 'Unauthorized'})
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": { //name
                "id": foundUser._id,
                "email": foundUser.email,
                "role": foundUser.role,
                "firstName": foundUser.firstName,
                "surname": foundUser.surname
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h'}
    )

    const refreshToken = jwt.sign(
        {"id": foundUser._id, "email": foundUser.email},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '5d'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ accessToken, role: foundUser.role })
})

const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized'})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if(err) return res.status(403).json({ message: 'Forbidden'})

            const foundUser = await User.findOne({ email: decoded.email})

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized'})

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                        "role": foundUser.role,
                        "firstName": foundUser.firstName,
                        "surname": foundUser.surname
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            )

            res.json({ accessToken })
        })
    )
})

const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.json({ message: 'Cookie cleared' })
})

module.exports = {
    login,
    refresh,
    logout
}