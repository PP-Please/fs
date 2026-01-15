import axios from 'axios'
import { useState } from 'react'
import DetailedCountry from './DetailedCountry'
import { useEffect } from 'react'

const CountryOutput = ({ output }) => {
    const [name, setName] = useState('')
    const [detailedCountry, setDetailedCountry] = useState(null)
    const [toggledCountry, setToggledCountry] = useState([])

    useEffect(() => {
        const initialState = output.map(country => ({
            ...country,
            toShow: false
        }))
        setToggledCountry(initialState)
    }, [output])

    const getDetailedCountry = (commonName) => {
        if (commonName !== name) {
            setName(commonName)
            axios
                .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${commonName}`)
                .then(res => {
                    setDetailedCountry(res.data)
                }
            )
        }
    }

    const toggleDetailedCountry = (country) => {
        setToggledCountry(toggledCountry.map(c => c.tld === country.tld ? { ...c, toShow: !c.toShow } : c))
        console.log(toggledCountry)
    }

    if (output.length > 10) {
        return (
            <p>Too many matches, specify another filter</p>
        )
    }

    else if (output.length == 1) {
        getDetailedCountry(output[0].name.common)
        if (detailedCountry){
            return (
                <DetailedCountry country={detailedCountry}></DetailedCountry>
            )
        }
    }

    return toggledCountry.map(country => (
  <li key={country.name.common}>
    {country.name.common}
    <button onClick={() => toggleDetailedCountry(country)}>{country.toShow ? 'Hide' : 'Show'}</button>
    {country.toShow && <DetailedCountry country={country} />}
  </li>
))
}


export default CountryOutput