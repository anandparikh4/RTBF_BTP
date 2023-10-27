import { useState } from "react"

/* 
      const request = {
        method: "Login",
      }
      makeRequest(request)
      .then(response => {
        // console.log(response)
      })
*/

const Write = (props) => {
  const hospitals = props.hospitals
  const makeRequest = props.makeRequest
  const [patient,setPatient] = useState('')
  const [test,setTest] = useState('')
  const [other,setOther] = useState('Select')
  const [result,setResult] = useState('Select')
  const [allergies,setAllergies] = useState('')
  const [blood,setBlood] = useState('')
  const [pending,setPending] = useState(false)

  const handleWrite= (e) => {
    e.preventDefault()
    if(other == "Select") alert("Please select a hospital")
    else if(result == "Select") alert("Please select a result")
    if(other == "Select" || result == "Select") return
    setPending(true)
    const request = {
      method: "Write",
      other: other,
      patient: patient,
      test: test,
      result: result,
      allergies: allergies,
      blood: blood
    }
    makeRequest(request)
    .then(response => {
      console.log(response)
      setPending(false)
    })
  }

  return (  
    <div className = "Write">
      <p>Write Private Data</p><br/>

      <form onSubmit={handleWrite}>

        <label>Patient</label>
        <input type="text" value={patient} onChange={(e)=>setPatient(e.target.value)} required /><br/>

        <label>Test</label>
        <input type="text" value={test} onChange={(e)=>setTest(e.target.value)} required /><br/>

        <label>Hospital</label>
        <select value={other} onChange={(e)=>setOther(e.target.value)} required>
          <option value="Select" key="Select">Select</option>
          {hospitals.map((h) => (
            <option value={h.hospital} key={h.hospital}>{h.hospital}</option>
          ))}
        </select><br/>

        <label>Result</label>
        <select value={result} onChange={(e)=>setResult(e.target.value)} required>
          <option value="Select">Select</option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
        </select><br/>

        <label>Allergies</label>
        <textarea value={allergies} onChange={(e)=>setAllergies(e.target.other)} required /><br/>

        <label>Blood Group</label>
        <input type="text" value={blood} onChange={(e)=>setBlood(e.target.value)} required /><br/>

        {!pending && <button>Write Private Data</button>}
        {pending && <button disabled>Please Wait...</button>}
        
      </form>

    </div>
  );
}

export default Write;
