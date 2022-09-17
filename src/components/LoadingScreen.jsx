import React from 'react'

const LoadingScreen = ({loadingMessage}) => {
  return (
    <h1 
        style={{
            color: 'white',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap'
        }} 
        >
        {loadingMessage}
    </h1>
  )
}

export default LoadingScreen