//Mongoosen käyttöön
const mongoose = require('mongoose')
//Tallenukseen tuevan datan validointii
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

//Tallenukseen tulevan tiedon rakenne/skeema + validointi 
//(tässä nimi pitää olla uniikki sekä numeron pituus väh 8 merkkiä)
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true,
    },
    number: {
        type: String,
        minlength: 8,
        required: true,
    }
})
//Otetaan skeemalle validaattori käyttöön
personSchema.plugin(uniqueValidator)

//Muutetaan id String muotoiseksi, koska muutoin tulee oliona skeemasta
//Poistetaan lisäksi id olio, joka korvattu Stringilla sekä mongon versiointi
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
