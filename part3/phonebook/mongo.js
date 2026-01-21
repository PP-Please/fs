const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('usage: node mongo.js <password> [<name> <number>]')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://kelvincheng2009_db_user:${password}@cluster0.zbmit2i.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 }).
    catch(() => console.log('Failed to connect to server. Invalid password given'))

const schema = new mongoose.Schema({
    name: String,
    number: String,
    id: String
})

const Person = mongoose.model('Person', schema)

if (process.argv.length === 3) {
    Person.find({}).then(res => {
        console.log('phonebook:')
        res.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

else {
    const newPerson = new Person({
        name,
        number,
        id: Math.floor(Math.random() * 123456789).toString()
    })

    newPerson.save().then(() => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}




