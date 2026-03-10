import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import RestaurantDetails from './pages/RestaurantDetails'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
