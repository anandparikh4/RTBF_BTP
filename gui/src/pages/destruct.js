import { useState } from "react"

const Destruct = (props) => {
  const [patient,setPatient] = useState('')
  const [test,setTest] = useState('')
  const [pending,setPending] = useState(false)

  const handleDestruct = (e) => {
    e.preventDefault()
    setPending(true)
    
    // destruct acl
    setPending(false)
  }

  return (  
    <div className = "Destruct">
      <p>Destruct Access Control List</p><br/>

      <form onSubmit={handleDestruct}>

        <label>Patient</label>
        <input type="text" value={patient} onChange={(e)=>setPatient(e.target.value)} required /><br/>

        <label>Test</label>
        <input type="text" value={test} onChange={(e)=>setTest(e.target.value)} required /><br/>

        {!pending && <button>Destruct Access Control List</button>}
        {pending && <button disabled>Please Wait...</button>}

      </form>

    </div>
  );
}

export default Destruct;
