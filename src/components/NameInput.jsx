import React from 'react'

const NameInput = ({name, setName, setEnter}) => {
    return(
      <div>
        <input 
          onKeyDown = {(e) => /[a-z]/i.test(e.key) } 
          value={name} 
          onChange={e => setName(e.target.value)} type='text' 
        />
        <button onClick={e => setEnter(true)} >Enter</button>
      </div>
    )
}

export default NameInput
