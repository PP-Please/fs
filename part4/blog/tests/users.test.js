const { test, describe, after, beforeEach } = require('node:test')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
// const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async() => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('testing', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
})

describe('tests for creating new user POST /api/users', () => {
    test('successfully added a user', async() => {
        const usersInitial = await helper.getUsersInDb()
        console.log('Initial users before POST:', usersInitial.map(u => u.username))

        const newUser = {
            username: 'username1',
            name: 'user',
            password: 'password123'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await helper.getUsersInDb()
        console.log('Users after POST:', usersAfter.map(u => u.username))
        assert.strictEqual(usersAfter.length, usersInitial.length + 1)

        const usernames = usersAfter.map(user => user.username)
        assert(usernames.includes(newUser.username))
    })

    test('400 status code for invalid username/password', async() => {
        const invalidScenarios = [
            [{ username: '', name: 'user', password: 'password123' }],
            [{ username: 'ab', name: 'user', password: 'password123' }],
            [{ username: 'username1', name: 'user', password: '' }],
            [{ username: 'username1', name: 'user', password: 'ab' }],
        ]

        await Promise.all(
            invalidScenarios.map(user =>
                api.post('/api/users').send(user).expect(400)
            )
        )
    })

    test('400 status code for duplicate username', async() => {
        let newUser = {
            username: 'username1',
            name: 'user',
            password: 'password123'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        newUser = {
            username: 'username1',
            name: 'user',
            password: 'password12345'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })
})

describe('tests for viewing all users GET /api/users', () => {
    test('successful retrieval of single user root', async() => {
        const user = await helper.getUsersInDb()
        const res = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.deepStrictEqual(res.body, user)
    })
})

after(async() => {
    await mongoose.connection.close()
})