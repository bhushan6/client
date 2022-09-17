import React from 'react'

const Info = ({borderColor}) => {
  return (
    <div
        style={{
            color: 'white',
            position: 'absolute',
            right: '10px',
            top: '10px'
        }}
    >
        <p 
            style={{
                fontSize: '12px',
                textAlign: 'right'
            }} 
        >
            Press <span style={{borderBottom: `3px solid #${borderColor}`}} className='underline'>'Slash'</span> (/) to open the text box
            <br/>
            &
            <br/>
            <span style={{borderBottom: `3px solid #${borderColor}`}} className='underline'>'Enter'</span> to send a message
        </p>
    </div>
  )
}

export default Info