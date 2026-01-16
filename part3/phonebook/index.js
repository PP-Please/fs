const express = require('express')
const app = express()

const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())
app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'missing name or number'
        })
    }

    const alreadyExists = persons.find(person => person.name === body.name)
    if (alreadyExists) {
        return response.status(409).json({
            error: 'this user already exists'
        })
    }

    const newPerson = {
        id: Math.floor(Math.random() * 123456789).toString(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)

    response.json(newPerson)

})
app.get('/info', (request, response) => {
    const info = `
        Phonebook has info for ${persons.length} people <br><br>
        ${new Date()}
    `
    response.send(info)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})