
//Otetaan ympäristömuuttujat käyttöön, jossa mongodb URI ja salasana ja portti
//Ks. .env file
require('dotenv').config()

//Tuodaan models polusta/kansiosta person.js index.js:n käyttöön
//HUOM! TÄMÄN PITÄÄ OLLA require('dotenv').config() JÄLKEEN
const Person = require('./models/person')

//----------------MIDDLEWAREJEN MÄÄRITYKSET ALKAA---------------------

const express = require('express')
//Logitukseen
const morgan = require('morgan')
//cors:lla mahdollistetaan backendin ja fronendin kommunikointi
//Koska eri origineissa Front endin origin portti 3000 ja backendin portti 3001
const cors = require('cors')
const app = express()
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
//Error handelerin middlewaren määritys
//Otetaan käyttöön vasta koodin lopussa, ennen porttimäärityksiä
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
//----------------MIDDLEWAREJEN MÄÄRITYKSET LOPPUU--------------------

//-------MIDLLEWAREJEN KÄYTTÖÖN OTTO ALKAA, HUOM IHAN LOPUSSA VIELÄ KAKSI, JUURI ENNEN PORTTIMÄÄRITYKSIÄ-----------
//-------HUOM! Tätä käyttöönottojärjestysä pitää noudattaa, että kaikki toimii oikein-----------

//tarkastaa Express GET-tyyppisten HTTP-pyyntöjen yhteydessä ensin löytyykö 
//pyynnön polkua vastaavan nimistä tiedostoa hakemistosta build. 
//Jos löytyy, palauttaa express tiedoston.
app.use(express.static('build'))
//Otetaan middlwaret käyttöön
app.use(express.json())
app.use(cors())

//Tehdään kustomoitu logitus, jossa on mukana POST actionin body eli sisältö joka
//lähetetään palvelimelle
morgan.token('body', (req, res) => JSON.stringify(req.body))

//Otetaan logitus käyttöön, tässä alku on 'tiny' + määritelty body
//voisi käyttää myös app.use(morgan('tiny')), mutta silloin ei saada mukaan
//POST actionin bodya=palvelimelle lähetettävä data
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//---------MIDLLEWAREJEN KÄYTTÖÖN OTTO LOPPUU, HUOM IHAN LOPUSSA VIELÄ KAKSI, JUURI ENNEN PORTTIMÄÄRITYKSIÄ---------


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
    //console.log('GET all persons')
    //res.json(persons)
    //Kun käytetään Mongoa, niin näin
    Person.find({}).then(people => {
        res.json(people)
    })
})

//Luodaan ID jokaiselle personille
//Eitarvita kun tietokantayhteys Mongoon, koska tietokanta hoitaa
//ID:n generoinnin
//const generateId = () => {
//Luodaan random numero halutulta väliltä
//min = Math.ceil(4);
//max = Math.floor(100000000);
//return Math.floor(Math.random() * (max - min) + min)
//}

//Uuden personsin tallennus kantaan
//HUOM!! "next", jotta virheenkäsittelijä, joka määritelty yllä toimii
app.post('/api/persons', (request, response, next) => {

    const body = request.body
    const name = body.name
    //const personName = persons.find(person => {
    //console.log(person.name, typeof person.name, name, typeof name, person.name === name)
    //return person.name === name
    //})

    //Jos jo nimi olemassa, annetaan status code 409 Conflict
    //if (personName) {
    //console.log('Person is already in phonebook!')
    //return response.status(409).json({
    //error: 'name must be unique'

    //})
    //}
    console.log('POST header', request.headers)
    //Tsekataan, että nimi annettu
    if (!body.name || !body.number) {
        console.log('Name or number missing')
        return response.status(400).json({ error: 'Name or number missing' })
    }
    //Uusi person olio, jos ei käytetä Mongoa
    //const person = {
    //name: body.name,
    //number: body.number,
    //id: generateId(),
    //}
    //Uuden Personin lisääminen Persons taulukkoon
    //persons = persons.concat(person)

    //Mongoa varten luodaan Person objekti scheeman mukaisesti
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    //response.json(person)
    //person.save().then(savedPerson => {
    //response.json(savedPerson)
    //})

    person
        .save()
        .then(savedPerson => savedPerson.toJSON())
        .then(savedAndFormattedPerson => {
            response.json(savedAndFormattedPerson)
        })
        .catch(error => next(error))
})

//Päivitetään tiedot tietokantaan
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }
    //HUOM! { new: true } tarvitaan, jotta palautuu frontendiin
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

//ID:n perusteella uuden hakeminen kannasta
app.get('/api/persons/:id', (request, response, next) => {
    //Muotoillaan id numeroksi
    //const id = Number(request.params.id)
    //const person = persons.find(person => person.id === id)
    //if (person) {
    //response.json(person)
    //} else {
    //response.status(404).end()
    //}

    //Tämän muotoisena koodina, kun on kiinnin tietokannassa
    //Tässä sovelluksessa kiinni Mongossa. 
    //Lisäksi virheiden käsittely
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        //Virheen catchaus suoraan tälle get actionille
        //.catch(error => {
        //console.log(error)
        //response.status(400).send({ error: 'malformatted id' })
        //})

        //Virheen catchaus Middlewarella
        .catch(error => next(error))
})



//Personin deletoiminen kannasta, next lisätty, koska virheenkäsittely Middlewarella
app.delete('/api/persons/:id', (request, response, next) => {
    //Muotoillaan id numeroksi
    //const id = Number(request.params.id)
    //persons = persons.filter(person => person.id !== id)

    //response.status(204).end()

    //Poistaminen kun käytössä Mongo
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

//Olemattomien osoitteiden Middleware tänne Ihan loppuun
app.use(unknownEndpoint)

//Middleware virheiden käsittelyyn käyttö tänne Ihan loppuun
app.use(errorHandler)

//Määritellään sovelluksen portti ilman Herokua
//const PORT = 3001
//app.listen(PORT, () => {
//console.log(`Server running on port ${PORT}`)
//})

//Portti määritys Herkoua varten
//const PORT = process.env.PORT || 3001
//app.listen(PORT, () => {
//console.log(`Server running on port ${PORT}`)
//})



//Portti määritys kun käytetään Mongoa
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})