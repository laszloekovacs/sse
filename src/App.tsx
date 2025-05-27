import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState<Array<string>>([])
  const eventSource = useRef<EventSource>(null)

  useEffect(() => {
    eventSource.current = new EventSource("/api/chat")

    eventSource.current.onmessage = (event) => {
      setMessages(messages => {
        const history = messages.slice(0, 14)
        return [event.data, ...history]
      })
    }

  }, [])


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    await fetch("/api/chat", {
      method: "POST",
      body: formData,
    })
  }



  return (
    <div>
      <p>🔥 Hono Server Sent Event Chat</p>

      <div>
        <form method="post" onSubmit={handleSubmit}>
          <input type="text" name="user" placeholder='username' required />
          <input type="text" name="message" placeholder='message' required />
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
