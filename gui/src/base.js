import { useState, useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Login from './login.js'
import Profile from './profile.js'

const databaseEndpoint = "http://localhost:8000/Hospitals"

const Base = () => {
  const [hospitals, setHospitals] = useState(null)
  const [username, setUsername] = useState('')
  const [usertype, setUsertype] = useState(null)
  const [hospital, setHospital] = useState('Select')

  async function makeRequest(params){
    params["username"] = username
    params["hospital"] = hospital
    const promise = axios.post("http://localhost:" + process.env.REACT_APP_BACKEND_PORT , params)
    const dataPromise = promise.then((response) => response.data)
    return dataPromise
  }

  useEffect(() => {
    fetch(databaseEndpoint)
      .then(res => {
        return res.json()
      })
      .then((data) => {
        setHospitals(data)
      })
  }, [])

  return (
    <Router>
      <div className="Base">
        <Switch>

          <Route path="/profile">
            {usertype && <Profile makeRequest={makeRequest} usertype={usertype} username={username} hospital={hospital} hospitals={hospitals}/>}
          </Route>

          <Route exact path="/">
            {hospitals && <Login makeRequest={makeRequest} hospitals={hospitals} username={username} setUsername={setUsername} hospital={hospital} setHospital={setHospital} setUsertype={setUsertype} />}
          </Route>

        </Switch>
      </div>
    </Router>
  )
}

export default Base;
