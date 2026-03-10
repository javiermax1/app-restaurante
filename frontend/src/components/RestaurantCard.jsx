import { Link } from 'react-router'
import { Col, Card, Button } from 'react-bootstrap'

const RestaurantCard = ({ restaurant }) => (
    <Col xs={12} sm={6} md={4}>
        <Card className="restaurant-card h-100 shadow-sm border-0">
            <div className="card-img-container">
                <span className="display-1">🏪</span>
            </div>
            <Card.Body className="p-4 d-flex flex-column">
                <h3 className="h4 fw-bold">{restaurant.restaurante}</h3>
                <p className="text-secondary mb-4">
                    <span className="me-2">📍</span>
                    Barrio: {restaurant.barrio}
                </p>
                <Button
                    as={Link}
                    to={`/restaurant/${restaurant.restauranteID}`}
                    variant="dark"
                    className="mt-auto px-4 py-2 w-100 rounded-pill fw-semibold"
                >
                    Ver Detalles
                </Button>
            </Card.Body>
        </Card>
    </Col>
)

export default RestaurantCard
