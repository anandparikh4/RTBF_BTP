import { useState } from "react"

const Purge = (props) => {
  const [test,setTest] = useState('')
  const [pending,setPending] = useState(false)

  const handlePurge = (e) => {
    e.preventDefault()
    setPending(true)
    
    // purge private data
    setPending(false)
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
