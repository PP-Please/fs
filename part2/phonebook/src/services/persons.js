import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const req = axios.get(baseUrl)
    console.log('successfully added data from db')
    return req.then(response => response.data)
}

const createUser = (newObj) => {
    const req = axios.post(baseUrl, newObj)
    return req.then(response => response.data)
}

const deleteUser = (id) => {
    const targetUrl = `${baseUrl}/${id}`
    const req = axios.delete(targetUrl, id)
    return req.then(response => response.data)
}

const updateUser = (changedPerson, id) => {
    const targetUrl = `${baseUrl }/${id}`
    const req = axios.put(targetUrl, changedPerson)
    return req.then(response => response.data)
}

export default { getAll, createUser, deleteUser, updateUser }