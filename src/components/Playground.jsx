import React, {useEffect, useState, useRef, useMemo} from "react"
import User from "./User"
import Cursor from './Cursor'
import Info from "./Info"
import LoadingScreen from "./LoadingScreen"

//1,4,3,8,2

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

const toHexString = (bytes) => {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

const Playground = ({name, color}) => {
    const [connectedUsers, setConnectedUsers] = useState([])
  
    const ws = useRef()

    const [socket, setSocket] = useState()
    const [connected, setConnected] = useState(false)

    const [loadingMessage, setLoadingMessage] = useState("Loading...")

    const view = useMemo(() => {
      const randomColor = color.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      const buf = textEncoder.encode(name);
      return new Uint8Array([0, 3, ...randomColor, ...buf])
    }, [name, color])

    useEffect(() => {
      let t = setTimeout(() => {
        if(!connected) {
          setLoadingMessage("Your 'net is slow af....how tf you still waiting, UGH")
        }
      }, 2000)

      return () => t && clearTimeout(t)
    }, [connected])
  
    useEffect(() => {
  
      ws.current = new WebSocket( 'wss://whimsical-silly-crowd.glitch.me/');
      ws.current.binaryType = 'arraybuffer';
      
      setSocket(ws.current)
  
      const mouseMove = e => {
        const x = parseFloat( e.clientX/window.innerWidth);
        const y = parseFloat( e.clientY/window.innerHeight);

        let command;
        command = new DataView( new ArrayBuffer( 1 + 1 + 4 + 4 ) );
        command.setUint8( 1, 1 );
        command.setFloat32( 2, x );
        command.setFloat32( 6, y );
  
        if ( ws.current.readyState === WebSocket.OPEN ) {
          ws.current.send( command.buffer );
        }
        
      }
  
      ws.current.addEventListener( 'open', function ( event ) {
        setConnected(true)
        ws.current.send( view )
        document.addEventListener('mousemove', mouseMove)      
      });
  
      ws.current.addEventListener( 'close', function ( event ) {
        window.location.reload()
      });
  
      ws.current.addEventListener( 'message', function ( event ) {
        let dataview = new DataView( event.data );
        let id = dataview.getUint8( 0 );
        let command = dataview.getUint8(1)
  
        if(command === 8){
          setConnectedUsers(prev => {
            const dummy = [...prev]
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
            return dummy
          })
        }else if(command === 2){
            ws.current.send(dataview)
        }
      });
  
      return () => {
        ws.current.close()
        document.removeEventListener('mousemove', mouseMove)
      }
    }, [view])
  
    if(!connected){
      return (
        <>
          <LoadingScreen loadingMessage={loadingMessage} />
        </>
      )
    }

  
    return (
      <>
        {connectedUsers.map((user, i) => user && <User key={user.name} bg={user.color} userId={i} socket={ws.current} name={user.name} />)}
        {socket && <Cursor ws={socket} name={name} bg={color} />}
        <Info borderColor={color} />
      </>
    );
  }

  export default Playground