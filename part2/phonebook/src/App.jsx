import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addDetails = (event) => {
    event.preventDefault()
    const doesExist = persons.find(person => person.name === newName)
    if (doesExist) {
      if (window.confirm(`${doesExist.name} is already added to phonebook, replace the old number with a new one?`)) {
          const changedPerson = {...doesExist, number: newNumber}
          personsService
            .updateUser(changedPerson, doesExist.id)
            .then(res => {
              setPersons(persons.map(person => person.id === doesExist.id ? res : person))
              setNewName('')
              setNewNumber('')
            })
        }
    } else {
      const newObj = {
        name: newName,
        number: newNumber
      }
      
      personsService
        .createUser(newObj)
        .then(returned => {
          setPersons(persons.concat(returned))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const deletePerson = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .deleteUser(id)
        .then(res => {
          setPersons(persons.filter(person => person.id !== id));
        })
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
      <Persons persons={persons} filter={newFilter} onDelete={deletePerson}></Persons>
    </div>
  )
}

export default App