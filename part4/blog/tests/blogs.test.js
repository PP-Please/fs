const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async() => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('testing', 10)
    const user = new User({ username: 'testing', passwordHash })

    await user.save()

    const blogsWithUser = helper.blogs.map(blog => ({
        ...blog,
        user: user._id
    }))

    await Blog.insertMany(blogsWithUser)
})

// * SKIPPED TESTS
describe.skip('legacy tests using hardcoded blogs', () => {
    const blogs = [
        {
            _id: '5a422a851b54a676234d17f7',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 7,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            __v: 0
        },
        {
            _id: '5a422b891b54a676234d17fa',
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a422ba71b54a676234d17fb',
            title: 'TDD harms architecture',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
            likes: 0,
            __v: 0
        },
        {
            _id: '5a422bc61b54a676234d17fc',
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 2,
            __v: 0
        }
    ]
    test('dummy returns one', () => {
        const blogs = []

        const result = listHelper.dummy(blogs)
        assert.strictEqual(result, 1)
    })

    describe('total likes', () => {
        const listWithOneBlog = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 5,
                __v: 0
            }
        ]

        test('when list has only one blog, equals the likes of that', () => {
            const result = listHelper.totalLikes(listWithOneBlog)
            assert.strictEqual(result, 5)
        })

        test('with mutliple blogs', () => {
            const result = listHelper.totalLikes(blogs)
            assert.strictEqual(result, 36)
        })

        const noBlogs = []
        test('with no blogs', () => {
            const result = listHelper.totalLikes(noBlogs)
            assert.strictEqual(result, 0)
        })
    })

    describe('blog with highest likes', () => {
        test('when given multiple blogs', () => {
            const result = listHelper.favouriteBlog(blogs)
            assert.deepStrictEqual(result,
                {
                    _id: '5a422b3a1b54a676234d17f9',
                    title: 'Canonical string reduction',
                    author: 'Edsger W. Dijkstra',
                    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
                    likes: 12,
                    __v: 0
                }
            )
        })

        test('when given no blogs', () => {
            const result = listHelper.favouriteBlog([])
            assert.deepStrictEqual(result, {})
        })

    })

    describe('give author with most blogs', () => {
        test('where there is one winner', () => {
            const result = listHelper.mostBlogs(blogs)
            assert.deepStrictEqual(result, {
                author: 'Robert C. Martin',
                blogs: 3
            })
        })
    })

    describe('give author with most likes', () => {
        test('where there is one winner', () => {
            const result = listHelper.mostLikes(blogs)
            assert.deepStrictEqual(result, {
                author: 'Edsger W. Dijkstra',
                likes: 17
            })
        })
    })
})

describe('tests for GET /api/blogs', () => {
    test('return list of blogs', async() => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('return list with same length as expected', async() => {
        const res = await api.get('/api/blogs')
        assert.strictEqual(res.body.length, helper.blogs.length)
    })

    test('return specific blog in list of blogs', async() => {
        const res = await api.get('/api/blogs')
        const contents = res.body.map(blog => blog.title)
        assert(contents.includes('Go To Statement Considered Harmful'))
    })

    test('check that each blog has an id (not an _id) as a property', async() => {
        const res = await api.get('/api/blogs')
        const blogs = res.body

        // ? https://stackoverflow.com/questions/39282873/object-hasownproperty-yields-the-eslint-no-prototype-builtins-error-how-to
        blogs.forEach(blog => {
            assert(Object.hasOwn(blog, 'id'))
            assert(!Object.hasOwn(blog, '_id'))
        })
    })
})

describe('tests for POST /api/blogs', () => {
    test('Successfully added a new blog - increment count by 1, returned added blog details', async() => {
        const newBlog = {
            title: 'A new blog',
            author: 'KC',
            url: 'www.google.com',
            likes: 0
        }

        const user = await helper.createNewUser()

        await api
            .post('/api/blogs')
            .send({ ...newBlog, userId: user._id })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const res = await api.get('/api/blogs')
        const contents = res.body.map(blog => blog.title)
        assert.strictEqual(res.body.length, helper.blogs.length + 1)
        assert(contents.includes('A new blog'))
    })

    test('Check that a missing given likes parameter defaults to 0', async() => {
        const newBlog = {
            title: 'A new blog',
            author: 'KC',
            url: 'www.google.com',
        }

        const user = await helper.createNewUser()

        await api
            .post('/api/blogs')
            .send({ ...newBlog, userId: user._id })

        const res = await api.get('/api/blogs')
        const contents = res.body.map(({ title, likes }) => ({ title, likes }))
        assert.strictEqual(contents.some(
            blog => blog.title === 'A new blog' && blog.likes === 0
        ), true)
    })

    test('Check that missing title or url property triggers 400 response', async() => {
        const blogWithoutTitle = {
            author: 'KC',
            url: 'www.google.com',
        }

        const user = await helper.createNewUser()

        await api
            .post('/api/blogs')
            .send({ ...blogWithoutTitle, userId: user._id })
            .expect(400)

        const blogWithoutUrl = {
            title: 'A new blog',
            author: 'KC',
        }

        await api
            .post('/api/blogs')
            .send({ ...blogWithoutUrl, userId: user._id })
            .expect(400)
    })
})

describe('tests for DELETE /api/blogs/:id', () => {
    test('Succeeds with status code 204 with proper id', async() => {
        const blogs = await helper.getBlogsInDb()
        const blogToDelete = blogs[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const updatedDb = await helper.getBlogsInDb()
        const ids = updatedDb.map(blog => blog.id)
        assert(!ids.includes(blogToDelete.id))
        assert.strictEqual(updatedDb.length, helper.blogs.length - 1)
    })
})

describe('tests for PUT /api/blogs/:id', () => {
    test('Successful update of blog post', async() => {
        const blogs = await helper.getBlogsInDb()
        const blogToUpdate = {
            ...blogs[0],
            title: 'updated title',
            likes: '101101'
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)

        const updatedDb = await helper.getBlogsInDb()
        const updatedBlog = updatedDb.find(blog => blog.title === 'updated title')
        assert.ok(updatedBlog)
        assert.strictEqual(updatedBlog.likes, 101101)
    })
})

after(async() => {
    await mongoose.connection.close()
})
