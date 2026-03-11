import { useState, useEffect, useMemo } from 'react'
import { Container, Row, Spinner, Alert, Button, Badge } from 'react-bootstrap'
import RestaurantCard from '../components/RestaurantCard'

const Home = () => {
  const [restaurants, setRestaurants] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL
        const [resRest, resCat] = await Promise.all([
          fetch(`${API_URL}/restaurants`),
          fetch(`${API_URL}/categories`),
        ])

        if (!resRest.ok || !resCat.ok)
          throw new Error('Error al conectar con el servidor')

        const [restaurantsData, categoriesData] = await Promise.all([
          resRest.json(),
          resCat.json(),
        ])

        setRestaurants(restaurantsData)
        setCategories(categoriesData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredRestaurants = useMemo(() => {
    if (!selectedCategory) return restaurants
    return restaurants.filter(
      (r) => String(r.categoriaID) === String(selectedCategory),
    )
  }, [restaurants, selectedCategory])

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
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <>
      <div className="hero-section fade-in">
        <Container>
          <h1 className="display-3 fw-bold mb-3">
            Descubre los mejores sabores
          </h1>
          <p className="lead fs-4 opacity-75">
            Selecciona un restaurante para explorar sus platos, pedidos y
            clientes.
          </p>
        </Container>
      </div>

      <Container className="mb-4">
        <div className="d-flex flex-wrap gap-2 justify-content-center mb-5">
          <Button
            variant={selectedCategory === null ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedCategory(null)}
            className="rounded-pill px-4"
          >
            Todos
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.categoriaID}
              variant={
                selectedCategory === String(cat.categoriaID)
                  ? 'primary'
                  : 'outline-primary'
              }
              onClick={() => setSelectedCategory(String(cat.categoriaID))}
              className="rounded-pill px-4"
            >
              {cat.categoria}
            </Button>
          ))}
        </div>

        <div className="d-flex align-items-center mb-4">
          <Badge bg="dark" className="p-2 px-3 rounded-pill fw-normal">
            {filteredRestaurants.length} Restaurantes encontrados
          </Badge>
        </div>

        <Row className="g-4 mb-5">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.restauranteID}
              restaurant={restaurant}
            />
          ))}
        </Row>
      </Container>
    </>
  )
}

export default Home
