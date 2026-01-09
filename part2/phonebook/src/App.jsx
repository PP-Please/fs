import { useState } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const addDetails = (event) => {
    event.preventDefault()
    const doesExist = persons.find(person => person.name === newName)
    if (doesExist) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const newObj = {
        name: newName,
        number: newNumber
      }
  
      setPersons(persons.concat(newObj))
      setNewName('')
      setNewNumber('')
    }
  }

  const updateName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const updateNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const updateFilter = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <div>debug: {newName}</div>
      <h2>Phonebook</h2>
      <Filter filterValue={newFilter} onFilterChange={updateFilter}></Filter>
      <h2>add a new</h2>
      <PersonForm
        onSubmit={addDetails}
        nameValue={newName}
        nameOnChange={updateName}
        numberValue={newNumber}
        numberOnChange={updateNumber}
      ></PersonForm>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={newFilter}></Persons>
    </div>
  )
}

export default App