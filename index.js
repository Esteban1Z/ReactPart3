const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
const app = express()

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
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


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send('Phonebook has info for ' + persons.length + ' people <br>' + new Date())
})

app.get('/api/persons/:id', (request, response) => {
  const id=Number(request.params.id)
  const person=persons.find(person=> person.id === id)

  if (!person) {
    return response.status(404).send({error: 'person not found'})
  }

  response.json(person)

})

app.delete('/api/persons/:id', (request, response) => { 
const id = Number(request.params.id)
persons = persons.find(persons=> persons.id === id)

response.status(204).end()
})

const randomId = () => {
  return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (request, response) => {
const body = request.body
if (!body.name) {
  return response.status(400).json({ 
    error: 'name missing' 
  })
}

else if (!body.number) {
  return response.status(400).json({ 
    error: 'number missing' 
  })
}

else if(persons.some(person => person.name === body.name)) {
  // Check if name already exists
  return response.status(400).json({ 
    error: 'name must be unique' 
  })
}

const person = {
  id: randomId(),
  name: body.name,
  number: body.number
}

persons = persons.concat(person)
response.json(person)

})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


