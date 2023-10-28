import { useState } from "react"

const Read = (props) => {
  const hospitals = props.hospitals
  const makeRequest = props.makeRequest
  const [patient,setPatient] = useState('')
  const [test,setTest] = useState('')
  const [other,setOther] = useState('Select')
  const [pending,setPending] = useState(false)
  const [result,setResult] = useState('')
  const [allergies,setAllergies] = useState('')
  const [blood,setBlood] = useState('')

  const handleRead = (e) => {
    e.preventDefault()
    if(other === "Select"){
      alert("Please select a hospital")
      return
    }
    setPending(true)
    const request = {
      method: "Read",
      other: other,
      patient: patient,
      test: test
    }
    makeRequest(request)
    .then(response => {
      console.log(response)
      if(response["error"] !== "") alert(response["error"])
      else{
        setResult(response["Result"])
        setAllergies(response["Allergies"])
        setBlood(response["Blood"])
      }
      setPending(false)
    })
  }

  return (  
    <div className = "Read">
      <p>Read Private Data</p>

      <form onSubmit={handleRead}>

        <label>Patient</label>
        <input type="text" value={patient} onChange={(e)=>setPatient(e.target.value)} required /><br/><br/>

        <label>Test</label>
        <input type="text" value={test} onChange={(e)=>setTest(e.target.value)} required /><br/><br/>

        <label>Hospital</label>
        <select value={other} onChange={(e)=>setOther(e.target.value)} required>
          <option value="Select" key="Select">Select</option>
          {hospitals.map((h) => (
            <option value={h.hospital} key={h.hospital}>{h.hospital}</option>
          ))}
        </select><br/><br/>

        {!pending && <button>Read Private Data</button>}
        {pending && <button disabled>Please Wait...</button>}
        
      </form>

      <p>Result: {result}</p>

      <p>Allergies: {allergies}</p>

      <p>Blood Group: {blood}</p>

    </div>
  );
}

export default Read;
