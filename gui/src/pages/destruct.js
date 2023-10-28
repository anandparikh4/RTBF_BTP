import { useState } from "react"

const Destruct = (props) => {
  const makeRequest = props.makeRequest
  const [patient,setPatient] = useState('')
  const [test,setTest] = useState('')
  const [pending,setPending] = useState(false)

  const handleDestruct = (e) => {
    e.preventDefault()
    setPending(true)
    const request = {
      method: "Destruct",
      patient: patient,
      test: test
    }
    makeRequest(request)
    .then(response => {
      console.log(response)
      if(response["error"] != "") alert(response["error"])
      setPending(false)
    })
  }

  return (  
    <div className = "Destruct">
      <p>Destruct Access Control List</p>

      <form onSubmit={handleDestruct}>

        <label>Patient</label>
        <input type="text" value={patient} onChange={(e)=>setPatient(e.target.value)} required /><br/><br/>

        <label>Test</label>
        <input type="text" value={test} onChange={(e)=>setTest(e.target.value)} required /><br/><br/>

        {!pending && <button>Destruct Access Control List</button>}
        {pending && <button disabled>Please Wait...</button>}

      </form>

    </div>
  );
}

export default Destruct;
