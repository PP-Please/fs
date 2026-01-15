import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notif, setNotif] = useState(null)

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
          setNotif({message: `Added ${newName}`, type: `success`})
          setNewName('')
          setNewNumber('')
          setTimeout(() => {
            setNotif(null)
          }, 3000);
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
        .catch(err => {
          setNotif({message: `Information of ${name} has already been removed from the server`, type: `error`})
          setTimeout(() => {
            setNotif(null)
          }, 3000);
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
      {/* <div>debug: {newName}</div> */}
      <Notification notification={notif}></Notification>
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