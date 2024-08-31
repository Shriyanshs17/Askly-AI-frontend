import { Link } from 'react-router-dom'
import './chatList.css'
import { useQuery } from 'react-query'

const ChatList = () => {

  const { isLoading, error, data } = useQuery('userChats', () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`,
        {
         credentials:'include'
        }
       ).then(res =>
         res.json()
       )

  )

  return (
    <div className='chatList'>
        <span className="title">DASHBOARD</span>
        <Link to="/dashboard">Create a new chat</Link>
        <Link to="/">Explore Askly AI</Link>
        <Link to="/">Contact</Link>
        <hr />
        <span>RECENT CHATS</span>
        <div className="list">
          {
       isLoading?"Loading...":error?"Something went wrong!": data?.map(chat=>(
              <Link to={`dashboard/chats/${chat._id}`} key={chat._id}>{chat.title}</Link>
            ))
          }   
        </div>
        <hr />
        <div className="upgrade">
            <img src="/logo.png" alt="" />
            <div className="text">
                <span>Upgradte to Askly AI pro</span>
                <span>Get unlimited access to all features</span>
            </div>
        </div>
    </div>
  )
}

export default ChatList