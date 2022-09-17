import React, {useEffect, useState, useRef, useMemo} from "react"
import User from "./User"
import Cursor from './Cursor'

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

const colors = ['4AE0BF', '0168F3', 'DD0069', '5F1CA5', 'd054ab', 'ee4722', '48ff07', 'ee4722']
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]
const toHexString = (bytes) => {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

const randomColor = getRandomColor()

const Playground = ({name}) => {
    const [connectedUsers, setConnectedUsers] = useState([])
  
    const ws = useRef()

    const [socket, setSocket] = useState()

    const view = useMemo(() => {

      const color = randomColor.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      const buf = textEncoder.encode(name);
      return new Uint8Array([0, 3, ...color, ...buf])
    }, [name])
  
    useEffect(() => {
  
      ws.current = new WebSocket( 'wss://realtime-chat-server.glitch.me/');
      ws.current.binaryType = 'arraybuffer';
      
      setSocket(ws.current)
  
      const mouseMove = e => {
        const x = parseInt( e.clientX );
        const y = parseInt( e.clientY );
  
        let command;
        command = new DataView( new ArrayBuffer( 1 + 1 + 2 + 2 ) );
        command.setUint8( 1, 1 );
        command.setUint16( 2, x );
        command.setUint16( 4, y );
  
        if ( ws.current.readyState === WebSocket.OPEN ) {
          ws.current.send( command.buffer );
        }
        
      }
  
      ws.current.addEventListener( 'open', function ( event ) {
        
        ws.current.send( view )
        
        document.addEventListener('mousemove', mouseMove)      
      });
  
      ws.current.addEventListener( 'close', function ( event ) {
        alert("CLOSED!!!!!!!!!!!!!!!!!!")
      });
  
      ws.current.addEventListener( 'message', function ( event ) {
        let dataview = new DataView( event.data );
        let id = dataview.getUint8( 0 );
        let command = dataview.getUint8(1)
  
        if(command === 0){
       
        }else if(command === 8){
          setConnectedUsers(prev => {
            const dummy = [...prev]
            console.log(dummy[id], "REMOVED", command, id, dataview);
            dummy[id] = null
            return dummy
          })
        }else if(command === 3){
          setConnectedUsers(prev => {
            const dummy = [
              ...prev, 
            ]
            dummy[id] = {
              name : textDecoder.decode(dataview.buffer.slice(5, dataview.buffer.byteLength)),
              color: toHexString([dataview.getUint8(2), dataview.getUint8(3), dataview.getUint8(4)])
            }
            console.log(dummy, "ADDED");
            return dummy
          })
        }
  
      });
  
      return () => {
        ws.current.close()
        document.removeEventListener('mousemove', mouseMove)
      }
    }, [view])
  
  
    return (
      <>
        {connectedUsers.map((user, i) => user && <User key={user.name} bg={user.color} userId={i} socket={ws.current} name={user.name} />)}
        {socket && <Cursor ws={socket} name={name} bg={randomColor} />}
      </>
    );
  }

  export default Playground