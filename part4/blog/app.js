const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const logger = require('./utils/logger')
const app = express()
const middleware = require('./utils/middleware')

const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl, { family: 4 })
    .catch((err) => {
        logger.error('failed to connect to MongoDB:', err.message)
    })

app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(middleware.mongooseErrorHandler)

module.exports = app