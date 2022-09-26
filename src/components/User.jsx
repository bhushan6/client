import React, {useEffect, useState} from "react"
import { AnimatePresence, motion } from "framer-motion";

const textDecoder = new TextDecoder()

const User = ({userId, socket, name, bg}) => {

    const [pos, setPos] = useState({x: 0, y: 0})
    const [messages, setMessages] = useState({})
  
    useEffect(() => {

      const removeMessage = (id) => {
        setTimeout(() => {
          setMessages(mess => {
            let dummy = {...mess}
            delete dummy[id]
            return dummy
          })
        }, 5000)
      }
  
      const socketMessage = ( event ) => {
        let dataview = new DataView( event.data );

        let id = dataview.getUint8( 0 );
        let command = dataview.getUint8(1)
        if(id === userId){
          if(command === 1){
            let x = dataview.getFloat32(2)* window.innerWidth
            let y = dataview.getFloat32(6)* window.innerHeight
            setPos({x, y})
          }else if(command === 4){
            let newMessage = textDecoder.decode(dataview.buffer.slice(2, dataview.buffer.byteLength))
            let id = Math.random().toString(16).slice(2)
            setMessages(mess => {
              const n = {[id] : newMessage}
              return {...mess, ...n}
            })
            removeMessage(id)
          }
        }
        
      }
  
      socket.addEventListener( 'message', socketMessage);
  
      return () => socket.removeEventListener( 'message', socketMessage);
    }, [userId, socket])

    const variants = {
      default: {
        x: pos.x,
        y: pos.y,
        type: ""
      }
    };
  
    return(
      <motion.div
          variants={variants}
          animate={"default"}
          style={{
            position: 'relative',
            width: '0px',
            height: '0px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0)',
            color:"white",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'visible'
          }}
        >
            <div
              style={{
                // background: "green",
                width: "fit-content",
                height: "fit-content",
                position: "relative",
                top: '13px',
                left: '13px'
              }}
            >
              <div
                style={{
                  // background: "red",
                  width: "40px",
                  height: "40px",
                  position: "relative"
                }}
              >
                <div
                  style={{
                    position: "absolute"
                  }}
                >
                  <svg width="32" height="44" viewBox="0 0 24 36" fill="none">
                    <path
                      fill= {bg? `#${bg}`: 'green'}
                      stroke="white"
                      d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z"
                    ></path>
                  </svg>
                </div>
                <div
                  style={{
                    position: "absolute",
                    // height: "20px",
                    // width: "20px",
                    background: bg? `#${bg}`: 'green',
                    top: "11px",
                    left: "11px",
                    borderRadius: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: '4px',
                    border: "2px solid white"
                  }}
                >
                  <div
                    style={{
                      height: "20px",
                      minWidth: "100px",
                      borderRadius: "20px",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      border: "2px solid black",
                      background: 'white',
                      color: 'black',
                      padding: '2px 5px'
                    }}
                  >
                      {/* <p>{name?.charAt(0).toUpperCase()}</p> */}
                      <p style={{textTransform: 'capitalize', whiteSpace: 'nowrap'}} >{name? name : ""}</p>
                  </div>
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: '34px',
                  left: "20px",
                  paddingLeft: '12px'
                }}
              >
                <AnimatePresence>
                  {Object.entries(messages).map(([id, message]) => {
                    return(
                      <motion.p 
                        initial={{opacity: 0, transform: 'translateY(10px)'}}
                        animate={{opacity: 1,  transform: 'translateY(0px)'}}
                        exit={{opacity: 0, transform: 'translateY(-10px)'}}
                        transition={{opacity: {duration: 0.2}}}
                        key={id}
                        style={{
                          color: 'black',
                          originX: 0,
                          background: bg? `#${bg}`: 'green',
                          padding: '5px',
                          borderRadius: '20px',
                          width: 'fit-content',
                          marginTop: '5px',
                          fontSize: '14px',
                          height: '30px',
                          lineHeight: '16px',
                          whiteSpace: 'nowrap',
                          border: '2px solid white',
                        }}
                      >
                        {message}
                      </motion.p>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
            
        </motion.div>
    )
  }

export default User