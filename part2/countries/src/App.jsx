import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import CountryOutput from './components/CountryOutput'

function App() {
  const [value, setValue] = useState('')
  const [countryList, setCountryList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  
  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(res => {
        setCountryList(res.data)
      })
  }, []) 

  useEffect(() => {
    const filtered = countryList.filter(country =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredList(filtered)
  }, [value])


  return (
    <div>
      <form>Find countries: 
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          ></input>
      </form>
      <CountryOutput output={filteredList}></CountryOutput>
    </div>
  )
}


export default App
