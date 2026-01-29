const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async(request, response) => {
    const { username, name, password } = request.body

    if (!password || password.length < 3) {
        return response.status(400).json({ error: 'Invalid password' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

usersRouter.get('/', async(request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})

module.exports = usersRouter
