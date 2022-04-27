const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
morgan.token('data', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.get('/info', (req, res) => {
    res.send(`<div>Phonebook has info for ${persons.length} people</div>
    <div>${new Date()}</div>`)
})

app.post('/api/persons', (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if (!req.body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }

    if (persons.map(p => p.name).includes( req.body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    let newId = null
    while (persons.map(p => p.id).includes(newId) || newId === null) {
        newId = Math.floor(Math.random() * 1000000)
    }
    const person = {
        name: req.body.name,
        number: req.body.number,
        id: newId
    }
    persons = persons.concat(person)
    res.json(person)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})