import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Navbar from './navbar.js'
import Construct from './pages/construct.js'
import Destruct from './pages/destruct.js'
import Grant from './pages/grant.js'
import Revoke from './pages/revoke.js'
import Read from './pages/read.js'
import Write from './pages/write.js'
import Purge from './pages/purge.js'

const Profile = (props) => {

  const usertype = props.usertype
  const username = props.username
  const hospital = props.hospital
  const hospitals = props.hospitals
  
  return(
    <div className="Profile">
      <Router>
        <Navbar usertype={usertype}/>
        <div className="Pages">
          <Switch>

            <Route exact path = "/profile">
              <h2>Logged in as: {username} from {hospital}</h2>
              <a href="/">Logout</a>
            </Route>

            <Route exact path="/profile/construct">
              <Construct usertype={usertype} username={username} hospital={hospital}/>
            </Route>

            <Route exact path="/profile/destruct">
              <Destruct usertype={usertype} username={username} hospital={hospital}/>
            </Route>

            <Route exact path="/profile/grant">
              <Grant usertype={usertype} username={username} hospital={hospital} hospitals={hospitals}/>
            </Route>

            <Route exact path="/profile/revoke">
              <Revoke usertype={usertype} username={username} hospital={hospital} hospitals={hospitals}/>
            </Route>

            <Route exact path="/profile/read">
              <Read usertype={usertype} username={username} hospital={hospital} hospitals={hospitals}/>
            </Route>

            <Route exact path="/profile/write">
              <Write usertype={usertype} username={username} hospital={hospital} hospitals={hospitals}/>
            </Route>

            <Route exact path="/profile/purge">
              <Purge usertype={usertype} username={username} hospital={hospital}/>
            </Route>

          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default Profile;
