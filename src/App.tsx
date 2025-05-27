import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState<Array<string>>([])
  const eventSource = useRef<EventSource>(null)

  useEffect(() => {
    eventSource.current = new EventSource("http://localhost:5000/ping")

    eventSource.current.onmessage = (event) => {
      setMessages(messages => [event.data, ...messages])
    }

  }, [])


  return (
    <div>
      <p>🔥 Hono Server Sent Event Chat</p>

      <div>
        <form method="post" action="/ping">
          <input type="text" name="user" placeholder='username' />
          <input type="text" name="message" placeholder='message' />
          <input type="submit" value="küldés" />
        </form>
      </div>

      <div>
        <p>üzenetek</p>
        <ul className='chatwindow'>
          {messages.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>

  )
}

export default App
