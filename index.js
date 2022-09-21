const express = require('express')
const app = express ()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.json())
app.use(cors())
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req,res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))

const PORT = process.env.PORT || 3001

const newId = () => {
    return Math.floor(Math.random()  * 10000)
}

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    res.send(`<h1>Phonebook</h1><p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        persons = persons.filter(x => x !== person)
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    if (!req.body.name){
        return res.status(400).json({
            error: 'name missing'
        })
    }
    if (!req.body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
  
    if (persons.map(x => x.name).includes(req.body.name)){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        id: newId(),
        name: req.body.name,
        number: req.body.number
    }
    persons = persons.concat(person)
    res.json(person)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
