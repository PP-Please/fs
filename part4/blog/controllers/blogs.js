const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})

blogsRouter.post('/', async(request, response) => {
    const user = await User.findById(request.body.userId)
    // if (!user) return response.status(400).json({ error: 'missing or invalid user ID' })

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
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
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