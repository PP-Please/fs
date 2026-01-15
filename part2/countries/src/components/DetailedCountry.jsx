const DetailedCountry = ({ country }) => {
    const languages = Object.values(country.languages)
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>
                Capital: {country.capital}<br></br>
                Area: {country.area}
            </p>
            <h2>Languages</h2>
            <ul>
                {languages.map((language, index) => (
                    <li key={index}>{language}</li>
                ))}
            </ul>
            <img src={country.flags.png}></img>
        </div>
    )
}

export default DetailedCountry