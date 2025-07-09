import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChatPage } from './pages/ChatPage'
import { Layout } from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ChatPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App