import { useState } from "react"

const Grant = (props) => {
  const hospitals = props.hospitals
  const [patient,setPatient] = useState('')
  const [test,setTest] = useState('')
  const [other,setOther] = useState('Select')
  const [manner,setManner] = useState('Select')
  const [pending,setPending] = useState('')

  const handleGrant = (e) => {
    e.preventDefault()
    setPending(true)
    if(other == "Select") alert("Please select a hospital")
    else if(manner == "Select") alert("Please select access control type")
    if(other == "Select" || manner == "Select") return;

    // grant access control
    setPending(false)
  }

  return (  
    <div className="Grant">
      <p>Grant Access Control</p>

      <form onSubmit={handleGrant}>

        <label>Patient</label>
        <input type="text" value={patient} onChange={(e)=>setPatient(e.target.value)} required /><br/>

        <label>Test</label>
        <input type="text" value={test} onChange={(e)=>setTest(e.target.value)} required/><br/>

        <label>Hospital</label>
        <select value={other} onChange={(e)=>setOther(e.target.value)} required>
          <option value="Select" key="Select">Select</option>
          {hospitals.map((h) => (
            <option value={h.hospital} key={h.hospital}>{h.hospital}</option>
          ))}
        </select><br/>

        <label>Access Type</label>
        <select value={manner} onChange={(e)=>setManner(e.target.value)} required>
          <option value="Select" key="Select">Select</option>
          <option value="r" key="Read">Read</option>
          <option value="w" key="Write">Write</option>
          <option value="rw" key="Read/Write">Read/Write</option>
        </select><br/>

        {!pending && <button>Grant Access Control</button>}
        {pending && <button>Please Wait...</button>}
      
      </form>

    </div>
  );
}

export default Grant;
