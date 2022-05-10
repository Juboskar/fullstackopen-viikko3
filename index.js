require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
morgan.token('data', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    res.json(result)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.find({ id: req.params.id }).then(result => {
    if (result.length > 0) {
      res.json(result)
    } else {
      throw new Error('not found')
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findOneAndRemove({ id: req.params.id })
    .then(result => {
      if (result) {
        res.status(204).end()
      } else {
        throw new Error('id not found')
      }
    })
    .catch(error => next(error))
})


app.get('/info', (req, res) => {
  Person.find({}).then(result => {
    res.send(`<div>Phonebook has info for ${result.length} people</div>
    <div>${new Date()}</div>`)
  })
})

app.post('/api/persons', (req, res, next) => {
  Person.find({}).then(result => {
    const persons = result

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
    }).catch(error => next(error))
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  }

  Person.findOneAndUpdate({ id: req.params.id }, person,
    { new: true, runValidators: true, context: 'query' })
    .then(updated => {
      res.json(updated)
    }).catch(error => next(error))
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

const errorHandler = (error, req, res, next) => {

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)