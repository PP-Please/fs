const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async(request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) return response.status(400).json({ error: 'missing or invalid user ID' })

    const blog = new Blog({
        ...request.body,
        user: user._id
    })

    const uploadedBlog = await blog.save()
    user.blogs = user.blogs.concat(uploadedBlog._id)
    await user.save()

    response.status(201).json(uploadedBlog)
})

blogsRouter.delete('/:id', async(request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) return response.status(400).json({ error: 'missing or invalid user ID' })

    const blog = await Blog.findById(request.params.id)
    if (!blog) return response.status(404).json({ error: 'Blog not found' })

    if (blog.user.toString() === user._id.toString()) {
        await Blog.findByIdAndDelete(blog._id)
        response.status(204).end()
    } else {
        response.status(403).json({ error: 'User not authorized to delete this blog' })
    }
})

blogsRouter.put('/:id', async(request, response) => {
    const blog = new Blog(request.body)

    const blogToUpdate = await Blog.findById(request.params.id)
    if (!blogToUpdate) {
        return response.status(404).end()
    }

    const updatedBlog = await blog.save()
    response.json(updatedBlog)
})

module.exports = blogsRouter