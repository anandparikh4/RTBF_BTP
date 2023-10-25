import { useState } from "react"

const Construct = (props) => {
  const [patient,setPatient] = useState('')
  const [test,setTest] = useState('')
  const [pending,setPending] = useState(false)

  const handleConstruct = (e) => {
    e.preventDefault()
    setPending(true)
    
    // construct acl
    setPending(false)
  }

  return (  
    <div className = "Construct">
      <p>Construct Access Control List</p><br/>

      <form onSubmit={handleConstruct}>

        <label>Patient</label>
        <input type="text" value={patient} onChange={(e)=>setPatient(e.target.value)} required /><br/>

        <label>Test</label>
        <input type="text" value={test} onChange={(e)=>setTest(e.target.value)} required /><br/>

        {!pending && <button>Construct Access Control List</button>}
        {pending && <button disabled>Please Wait...</button>}

      </form>

    </div>
  );
}

export default Construct;
