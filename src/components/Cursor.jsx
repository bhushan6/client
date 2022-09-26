import React from "react";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const textEncoder = new TextEncoder()
// const textDecoder = new TextDecoder()

const Cursor = ({ws, name, bg}) => {
    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0
      });

    const [isInputOpen, setIsInputOpen] = useState(false)

    const [messages, setMessages] = useState({})

    const inputRef = useRef()

    const inputValue = useRef()

    const setInputValue = e => {
      inputValue.current = e.target.value
    }

    useEffect(() => {

      const removeMessage = (id) => {
        setTimeout(() => {
          setMessages(mess => {
            const dummy = {...mess}
            delete dummy[id]
            return dummy
          })
        }, 5000)
      }

        document.body.style.cursor = 'none'
        const mouseMove = (e) => {
          setMousePosition({
            x: e.clientX,
            y: e.clientY
          });
        };

        const keyPressed = e => {
          if(e.code === 'Tab'){
            e.preventDefault()
          }if(e.code === 'Slash'){
            if(inputRef.current !== document.activeElement) e.preventDefault()
            inputRef.current && inputRef.current.focus()
          }else if(e.code === 'Enter'){
            if(inputRef.current === document.activeElement && inputValue.current) {
                const buf = textEncoder.encode(inputValue.current);
                const data= new Uint8Array([0, 4, ...buf])
                ws?.send( data );

                const id = Math.random().toString(16).slice(2)
                const n = {[id] : inputValue.current}
                setMessages(mess => ({...mess, ...n}))
                removeMessage(id)
                inputRef.current.value = ''
                inputValue.current = null
            }
          }
        }
    
        window.addEventListener("mousemove", mouseMove);
        document.addEventListener('keypress', keyPressed)
    
        return () => {
          window.removeEventListener("mousemove", mouseMove);
          document.removeEventListener('keypress', keyPressed)
        };
    }, [ws]);

    const variants = {
        default: {
          x: mousePosition.x,
          y: mousePosition.y,
          type: ""
        }
      };

  return (
      <motion.div
        className="cursor"
        variants={variants}
        animate={"default"}
        style={{
          // background: 'yellow',
          width: "fit-content",
          height: "fit-content",
          paddingLeft: '10px',
          zIndex: '1000000000000000'
        }}
      >
        <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              // background: 'red'
            }}
          >
            <svg width="32" height="44" viewBox="0 0 24 36" fill="orange">
              <path 
                fill={`#${bg}`}
                stroke="white" 
                d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z">
              </path>
            </svg>
          </div>

        <div
          style={{
            width: '100%',
            padding: '5px',
            position: 'absolute',
            right: '-35px',
            bottom: '20px'
          }}
        >
          <AnimatePresence  >
            {Object.entries(messages).map(([id, message], i) => {
              return(
                  <motion.p 
                    initial={{opacity: 0, transform: 'translateY(10px)'}}
                    animate={{opacity: 1,  transform: 'translateY(0px)'}}
                    exit={{opacity: 0, transform: 'translateY(-10px)'}}
                    transition={{opacity: {duration: 0.2}}}
                    style={{
                      color: 'black',
                      originX: 0,
                      background: `#${bg}`,
                      padding: '5px',
                      borderRadius: '20px',
                      width: 'fit-content',
                      margin: '5px 0',
                      fontSize: '14px',
                      height: '30px',
                      lineHeight: '16px',
                      border: '2px solid white',
                      whiteSpace: 'nowrap'
                    }}
                    key={id}
                  >
                    <span>{message}</span>
                  </motion.p>
              )
            })}
          </AnimatePresence>
        </div>

        <div
          style={{
            position: "relative",
            width: "max-content",
            height: "32px",
            background: `#${bg}`,
            padding: '5px',
            borderRadius: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            top: '10px'
          }}
        >
          
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "5px",
              transform: "translate(0%,-50%)",
              background: "white",
              width: "20px",
              height: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              pointerEvents: "none",
              border: '2px solid black',
              fontWeight: '700'
            }}
          >
            <p style={{fontWeight: '700'}} >{name?.charAt(0).toUpperCase()}</p>
          </div>
          <input
            ref={inputRef}
            type='text' 
            onChange={setInputValue}
            onFocus={() => {
              setIsInputOpen(true)
              inputRef.current.value = ''
            }}
            onBlur={() => {
              setIsInputOpen(false)
              setMessages({})
              
            }}
            placeholder="Type a message...."
            onKeyDown = {(e) => /[a-z]/i.test(e.key) }
            style={{
              width: isInputOpen? '150px' : '10px',
              height: "20px",
              borderRadius: "20px",
              transition: "all 0.5s ease-in",
              paddingTop: '10px',
              paddingBottom: '10px',
              paddingRight: '10px',
              paddingLeft: !isInputOpen ? "10px" : "30px",
              outline: 'none',
              border: 'none',
              background: 'transparent',
            }}
          />
        </div>
      </motion.div>
  );
}

export default Cursor

