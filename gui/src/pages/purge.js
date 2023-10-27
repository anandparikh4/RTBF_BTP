import { useState } from "react"

const Purge = (props) => {
  const makeRequest = props.makeRequest
  const [test,setTest] = useState('')
  const [pending,setPending] = useState(false)

  const handlePurge = (e) => {
    e.preventDefault()
    setPending(true)
    const request = {
      method: "Purge",
      patient: props.username,
      test: test
    }
    makeRequest(request)
    .then(response => {
      console.log(response)
      setPending(false)
    })
  }

  return (  
    <div className = "Purge">
      <p>Purge Private Data</p><br/>

      <form onSubmit={handlePurge}>

        <label>Test</label>
        <input type="text" value={test} onChange={(e)=>setTest(e.target.value)} required /><br/>

        {!pending && <button>Purge Private Data</button>}
        {pending && <button disabled>Please Wait...</button>}

      </form>

    </div>
  );
}

export default Purge;
