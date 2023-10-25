import { useState } from "react"
import { useHistory } from 'react-router-dom'

const Login = (props) => {
  const hospitals = props.hospitals
  const username = props.username
  const setUsername = props.setUsername
  const hospital = props.hospital
  const setHospital = props.setHospital
  const setUsertype = props.setUsertype
  const history = useHistory()
  const [password,setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    var found = false
    var valid = false
    if(hospital == "Select"){
      alert("Please select a Hospital")
      return
    }
    if(username == "admin") setUsertype("admin")
    else setUsertype("patient")
    for(var i=0;i<hospitals.length;i++){
      if(hospitals[i].hospital != hospital) continue
      if(username == "admin"){
        found = true
        if(hospitals[i].admin == password) valid = true
      }
      if(found) break
      for(var u in hospitals[i].users){
        if(u == username){
          found = true
          if(hospitals[i].users[u] == password) valid = true
          break
        }
      }
      break
    }
    if(!found) alert("Invalid username")
    else if (!valid) alert("Invalid password")
    else{
      history.push('/profile')
    }
  }

  async function handleTrial(e){
    e.preventDefault()

    const obj = {
      message: "Frontend Connected"
    }

    fetch("http://localhost:" + process.env.REACT_APP_BACKEND_PORT,{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(obj)
    })
    .then(res => {
      return res.json()
    })
    .then((data)=>{
      console.log(data["message"])
    })
  }

  return (
    <div className="Login">
      <h2>Welcome To RTBF</h2>
      {/* <h3>{process.env.REACT_APP_BACKEND_PORT}</h3> */}
      <form onSubmit={handleLogin}>
        <label>Username</label>
        <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} required></input><br/>
        <label>Password</label>
        <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)} required></input><br/>
        <label>Hospital</label>
        <select value={hospital} onChange={(e)=>setHospital(e.target.value)} required>
          <option value="Select">Select</option>
          {hospitals.map((h) => (
            <option value={h.hospital} key={h.hospital}>{h.hospital}</option>
          ))}
        </select><br/>
        <button>Login</button>
      </form><br/>
      <button onClick={handleTrial}>Trial</button>
    </div>
  );
}

export default Login;
