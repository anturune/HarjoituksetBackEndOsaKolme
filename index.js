

const express = require('express')
//Logitukseen
const morgan = require('morgan')
//cors:lla mahdollistetaan backendin ja fronendin kommunikointi
//Koska eri origineissa Front endin origin portti 3000 ja backendin portti 3001
const cors = require('cors')
const app = express()

//Otetaan middlwaret käyttöön, ensimmäisenä pitää ottaa käyttöön express
app.use(express.json())
//tarkastaa Express GET-tyyppisten HTTP-pyyntöjen yhteydessä ensin löytyykö 
//pyynnön polkua vastaavan nimistä tiedostoa hakemistosta build. 
//Jos löytyy, palauttaa express tiedoston.
app.use(express.static('build'))
app.use(cors())

//Tehdään kustomoitu logitus, jossa on mukana POST actionin body eli sisältö joka
//lähetetään palvelimelle
morgan.token('body', (req, res) => JSON.stringify(req.body))

//Otetaan logitus käyttöön, tässä alku on 'tiny' + määritelty body
//voisi käyttää myös app.use(morgan('tiny')), mutta silloin ei saada mukaan
//POST actionin bodya=palvelimelle lähetettävä data
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


//Määritellään taulukko sisältöineen testausta varten
let persons = [
    {
        id: 1,
        name: "Arto Hellasssa",
        number: "04040404044",
    },
    {
        id: 2,
        name: "Kirsi Hellas",
        number: "04040404044",
    },
    {
        id: 3,
        name: "Uolevi Hellas",
        number: "04040404044",
    }
]


//haetaan taulukon koko ja lisätään tämä päivämäärä
app.get('/info', (req, res) => {
    const deitti = new Date()
    const taulukonKoko = persons.length
    //Selaimeen palauttamista varten määritellääntagit ja sen sellaiset
    res.send(`<p>Phonebook has info for ${taulukonKoko} people</p> <p> ${deitti} </p>`)

})
//Haetaan kaikki henkilöt
app.get('/api/persons', (req, res) => {
    console.log('GET all persons')
    res.json(persons)
})

//Luodaan ID jokaiselle personille
const generateId = () => {
    //Luodaan random numero halutulta väliltä
    min = Math.ceil(4);
    max = Math.floor(100000000);
    return Math.floor(Math.random() * (max - min) + min)
}

//Uuden personsin tallennus kantaan
app.post('/api/persons', (request, response) => {

    const body = request.body
    const name = body.name
    const personName = persons.find(person => {
        console.log(person.name, typeof person.name, name, typeof name, person.name === name)
        return person.name === name
    })

    //Jos jo nimi olemassa, annetaan status code 409 Conflict
    if (personName) {
        console.log('Person is already in phonebook!')
        return response.status(409).json({
            error: 'name must be unique'

        })
    }
    console.log('POST header', request.headers)
    //Tsekataan, että nimi annettu
    if (!body.name || !body.number) {
        console.log('Name or number missing')
        return response.status(400).json({
            error: 'Name or number missing'

        })
    }
    //Uusi person olio
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),

    }
    //Uuden Personin lisääminen Persons taulukkoon
    persons = persons.concat(person)

    response.json(person)
})
//ID:n perusteella uuden hakeminen kannasta
app.get('/api/persons/:id', (request, response) => {
    //Muotoillaan id numeroksi
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})
//Personin deletoiminen kannasta
app.delete('/api/persons/:id', (request, response) => {
    //Muotoillaan id numeroksi
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})
//Määritellään sovelluksen portti ilman Herokua
//const PORT = 3001
//app.listen(PORT, () => {
    //console.log(`Server running on port ${PORT}`)
//})

//Portti määritys Herkoua varten
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})