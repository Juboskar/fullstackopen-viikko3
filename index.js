require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
morgan.token('data', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.find({ id: id }).then(result => {
        if (result) {
            res.json(result)
        } else {
            res.status(404).end()
        }
    })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findOneAndRemove({ id: req.params.id })
        .then(result => {
            res.status(204).end()
        })
        .catch(error => console.log(error))
})


app.get('/info', (req, res) => {
    Person.find({}).then(result => {
        res.send(`<div>Phonebook has info for ${result.length} people</div>
    <div>${new Date()}</div>`)
    })
})

app.post('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        const persons = result
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

        if (persons.map(p => p.name).includes(req.body.name)) {
            return res.status(400).json({
                error: 'name must be unique'
            })
        }

        let newId = null
        while (persons.map(p => p.id).includes(newId) || newId === null) {
            newId = Math.floor(Math.random() * 1000000)
        }
        const person = new Person({
            name: req.body.name,
            number: req.body.number,
            id: newId
        })
        person.save().then(p => {
            res.json(p)
        })
    })
})

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})