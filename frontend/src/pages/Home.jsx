import { useState, useEffect } from 'react'
import { Container, Row, Spinner, Alert } from 'react-bootstrap'
import RestaurantCard from '../components/RestaurantCard'

const Home = () => {
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('http://localhost:4000/restaurants')
                if (!response.ok) throw new Error('Error al conectar con el servidor')
                const data = await response.json()
                setRestaurants(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurants()
    }, [])

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
            </Container>
        )
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger" className="text-center">{error}</Alert>
            </Container>
        )
    }

    return (
        <>
            <div className="hero-section fade-in">
                <Container>
                    <h1 className="display-3 fw-bold mb-3">Descubre los mejores sabores</h1>
                    <p className="lead fs-4 opacity-75">Selecciona un restaurante para explorar sus platos, pedidos y clientes.</p>
                </Container>
            </div>

            <Container className="mb-5">
                <Row className="g-4">
                    {restaurants.map((restaurant) => (
                        <RestaurantCard key={restaurant.restauranteID} restaurant={restaurant} />
                    ))}
                </Row>
            </Container>
        </>
    )
}

export default Home
