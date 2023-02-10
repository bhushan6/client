import React from 'react'

const colors = ['4AE0BF', '0168F3', 'DD0069', '5F1CA5', 'd054ab', 'ee4722', '48ff07', 'ee4722']
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]
const color = getRandomColor()
const NameInput = ({name, setName, setEnter, setColor}) => {

  const inputRef = React.useRef()

  const submit = () => {
    name !== '' && setEnter(true)
  }

  const keyPressed = e => {
    if(e.code === 'Enter'){
      submit()
    }
  }

  React.useEffect(() => {
    inputRef.current?.focus()
    setColor(color)
    
    document.addEventListener('keypress', keyPressed)

    return () => document.removeEventListener('keypress', keyPressed)
  }, [])


    return(
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'start',
          height: '100vh',
          width: '500px',
          flexDirection: 'column',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          gap: '20px'
        }}
      >
        <div
          style={{
            // width: '500px'
          }}
        >
          <h1 style={{color: 'white'}} >
            Useless App
          </h1>
          <p 
            className='subText' 
            style={{color: 'white'}} 
          >
            Please enter your name to get started
          </p>
        </div>
        <div 
          style={{
            background: `#${color}`,
            padding: '10px',
            borderRadius: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            border: '2px solid white'
          }}
        >
          <input 
            ref={inputRef}
            style={{
              background : 'transparent',
              outline: 'none',
              border: 'none',
              padding: '0 10px'
            }}
            placeholder={'Enter your name...'}
            onKeyDown = {(e) => /[a-z]/i.test(e.key) } 
            value={name} 
            onKeyUp = {e => keyPressed(e)}
            onChange={e => setName(e.target.value.trim())} type='text' 
          />
          <button
            className='form-btn'
            style={{
              background : 'transparent',
              outline: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={e => submit()} >
              Enter
            </button>
        </div>

        <div
          className='credits'
        >
          <p>Made (stole) by Bhushan</p>
        </div>
      </div>
    )
}

export default NameInput
