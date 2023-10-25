import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Login from './login.js'
import Profile from './profile.js'

const databaseEndpoint = "http://localhost:8000/Hospitals"

const Base = () => {
  const [hospitals, setHospitals] = useState(null)
  const [username, setUsername] = useState('')
  const [usertype, setUsertype] = useState(null)
  const [hospital, setHospital] = useState('Select')

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
            {usertype && <Profile usertype={usertype} username={username} hospital={hospital} hospitals={hospitals}/>}
          </Route>

          <Route exact path="/">
            {hospitals && <Login hospitals={hospitals} username={username} setUsername={setUsername} hospital={hospital} setHospital={setHospital} setUsertype={setUsertype} />}
          </Route>

        </Switch>
      </div>
    </Router>
  )
}

export default Base;
