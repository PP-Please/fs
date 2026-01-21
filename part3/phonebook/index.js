require('dotenv').config()
const Person = require('./models/person')

const express = require('express')
const app = express()

const morgan = require('morgan')

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(res => {
        response.json(res)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(res => {
            response.json(res)
        })
        .catch((err) => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
        .then(newPerson => {
            response.json(newPerson)
        })
        .catch(err => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findById(request.params.id)
        .then((person) => {
            if (!person) { return response.status(404).end() }

            person.name = name
            person.number = number

            return person.save().then((updatedPerson) => {
                response.json(updatedPerson)
            })
        })
        .catch((err) => next(err))
})

app.get('/info', (request, response) => {
    Person.find({}).then((res) => {
        const info = `
            Phonebook has info for ${res.length} people <br><br>
            ${new Date()}
        `
        response.send(info)
    })
})


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})