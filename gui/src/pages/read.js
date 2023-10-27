import { useState } from "react"

const Read = (props) => {
  const hospitals = props.hospitals
  const makeRequest = props.makeRequest
  const [patient,setPatient] = useState('')
  const [test,setTest] = useState('')
  const [other,setOther] = useState('Select')
  const [pending,setPending] = useState(false)

  const handleRead = (e) => {
    e.preventDefault()
    if(other == "Select"){
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
      setPending(false)
    })
  }

  return (  
    <div className = "Read">
      <p>Read Private Data</p><br/>

      <form onSubmit={handleRead}>

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

        {!pending && <button>Read Private Data</button>}
        {pending && <button disabled>Please Wait...</button>}
        
      </form>

    </div>
  );
}

export default Read;
