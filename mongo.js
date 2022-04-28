const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}


const password = process.argv[2]

const url =
    `mongodb+srv://juboskar:${password}@cluster0.psjqe.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', noteSchema)

if (process.argv.length === 3) {
    console.log('phonebook: ')
    Person.find({}).then(result => {
        result.forEach(p => {
            console.log(p.name + ' ' + p.number)
        })
        mongoose.connection.close()
    })
}

else {

    const name = process.argv[3]
    const number = process.argv[4]

    const note = new Person({
        name: name,
        number: number,
    })

    note.save().then(result => {
        console.log(`added ${name} number ${number}`)
        mongoose.connection.close()
    })
}
