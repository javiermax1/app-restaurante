import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router'
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  Button,
  Modal,
  ListGroup,
  Spinner,
  Alert,
  Badge,
} from 'react-bootstrap'
import DataTable from 'react-data-table-component'

const RestaurantDetails = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('platos')
  const [restaurant, setRestaurant] = useState(null)
  const [dishes, setDishes] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const API_URL = import.meta.env.VITE_API_URL

        const [resRest, resDishes, resOrders, resCustomers] = await Promise.all([
          fetch(`${API_URL}/restaurants`),
          fetch(`${API_URL}/dishes`),
          fetch(`${API_URL}/orders`),
          fetch(`${API_URL}/customers`),
        ])

        if (!resRest.ok || !resDishes.ok || !resOrders.ok || !resCustomers.ok) {
          throw new Error(
            'No se pudo establecer conexión con el sistema central',
          )
        }

        const [restaurantsData, dishesData, ordersData, customersData] =
          await Promise.all([
            resRest.json(),
            resDishes.json(),
            resOrders.json(),
            resCustomers.json(),
          ])

        // Filtrado en el cliente basado en la nueva estructura lógica
        const restaurantData = restaurantsData.find(
          (r) => String(r.restauranteID) === String(id),
        )
        if (!restaurantData) throw new Error('Restaurante no encontrado')

        const filteredDishes = dishesData.filter(
          (d) => String(d.restauranteID) === String(id),
        )
        const filteredOrders = ordersData
          .filter((o) => String(o.restauranteID) === String(id))
          .map((order) => ({
            ...order,
            customer: customersData.find(
              (c) => String(c.clienteID) === String(order.clienteID),
            ),
          }))

        setRestaurant(restaurantData)
        setDishes(filteredDishes)
        setOrders(filteredOrders)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const dishColumns = useMemo(
    () => [
      {
        name: 'Plato',
        selector: (row) => row.plato,
        sortable: true,
        grow: 2,
        cell: (row) => <div className="fw-bold py-2">{row.plato}</div>,
      },
      {
        name: 'Descripción',
        selector: (row) => row.descripcion || 'Sin descripción',
        wrap: true,
        style: { color: '#6c757d', fontSize: '0.9rem' },
      },
      {
        name: 'Precio',
        selector: (row) => row.precio,
        sortable: true,
        center: true,
        cell: (row) => {
          const precio = parseFloat(row.precio)
          return (
            <Badge bg="primary" className="p-2 fs-6">
              {isNaN(precio) ? '0.00' : precio.toFixed(2)} €
            </Badge>
          )
        },
      },
    ],
    [],
  )

  const orderColumns = useMemo(
    () => [
      {
        name: 'ID',
        selector: (row) => row.pedidoID,
        sortable: true,
        width: '80px',
        cell: (row) => <Badge bg="dark">#{row.pedidoID}</Badge>,
      },
      {
        name: 'Fecha',
        selector: (row) => row.fecha,
        sortable: true,
        cell: (row) => <span>{new Date(row.fecha).toLocaleDateString()}</span>,
      },
      {
        name: 'Cliente',
        selector: (row) => `${row.customer?.nombre} ${row.customer?.apellido1}`,
        sortable: true,
        grow: 2,
        cell: (row) => (
          <div>
            <div className="fw-bold">
              {row.customer?.nombre} {row.customer?.apellido1}{' '}
              {row.customer?.apellido2}
            </div>
          </div>
        ),
      },
      {
        name: 'Localidad',
        selector: (row) => row.customer?.poblacion,
        sortable: true,
      },
      {
        name: 'Sexo',
        selector: (row) => row.customer?.sexo,
        sortable: true,
        cell: (row) => (
          <Badge
            bg={row.customer?.sexo === 'M' ? 'danger' : 'info'}
            pill
            className="fw-normal"
          >
            {row.customer?.sexo === 'M' ? 'Femenino' : 'Masculino'}
          </Badge>
        ),
      },
      {
        name: 'Detalle Pedido',
        button: true,
        cell: (row) => (
          <Button
            size="sm"
            variant="outline-dark"
            onClick={() => handleViewOrderDishes(row.pedidoID)}
            className="rounded-pill px-3"
          >
            Ver Platos
          </Button>
        ),
      },
    ],
    [],
  )

  const [selectedOrderDishes, setSelectedOrderDishes] = useState([])
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [loadingOrderDishes, setLoadingOrderDishes] = useState(false)

  const handleViewOrderDishes = async (orderId) => {
    try {
      setLoadingOrderDishes(true)
      const API_URL = import.meta.env.VITE_API_URL
      const response = await fetch(`${API_URL}/order/${orderId}/dishes`)
      if (!response.ok) throw new Error('No se pudieron cargar los platos')
      const data = await response.json()
      setSelectedOrderDishes(data)
      setShowOrderModal(true)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoadingOrderDishes(false)
    }
  }

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f8f9fa',
        borderBottomWidth: '2px',
      },
    },
    rows: {
      style: {
        fontSize: '1rem',
        '&:not(:last-of-type)': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: '#eee',
        },
      },
    },
  }

  if (loading)
    return (
      <Container className="text-center my-5">
        <Spinner animation="grow" variant="primary" />
      </Container>
    )
  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error}{' '}
          <Link to="/" className="alert-link">
            Volver
          </Link>
        </Alert>
      </Container>
    )

  return (
    <Container className="mb-5 fade-in">
      <Row className="mb-5 align-items-end">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <Link
              to="/"
              className="btn btn-outline-dark rounded-circle me-3 p-2 d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
            >
              ←
            </Link>
            <h1 className="display-4 fw-bold m-0">{restaurant.restaurante}</h1>
          </div>
          <div className="badge bg-light text-dark border p-2 rounded-pill px-3 shadow-sm">
            <span className="me-1">📍</span> {restaurant.barrio}, Zaragoza
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Nav
            variant="pills"
            className="mb-4 bg-white p-2 rounded-pill shadow-sm d-inline-flex"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
          >
            <Nav.Item>
              <Nav.Link eventKey="platos" className="rounded-pill px-4 py-2">
                🥘 Nuestra Carta
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="pedidos" className="rounded-pill px-4 py-2">
                📜 Pedidos y Clientes
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            <DataTable
              columns={activeTab === 'platos' ? dishColumns : orderColumns}
              data={activeTab === 'platos' ? dishes : orders}
              pagination
              highlightOnHover
              responsive
              customStyles={customStyles}
              noDataComponent={
                <div className="p-5 text-center text-muted">
                  No se encontraron registros.
                </div>
              }
              paginationComponentOptions={{
                rowsPerPageText: 'Filas por página:',
                rangeSeparatorText: 'de',
                noRowsPerPage: false,
              }}
            />
          </Card>
        </Col>
      </Row>

      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Detalle de Platos del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {loadingOrderDishes ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <ListGroup variant="flush">
              {selectedOrderDishes.length > 0 ? (
                selectedOrderDishes.map((dish, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center py-3 border-light">
                    <div>
                      <h6 className="mb-0 fw-bold">{dish.plato}</h6>
                      <small className="text-muted">{dish.descripcion || 'Sin descripción'}</small>
                    </div>
                    <Badge bg="primary" pill className="p-2 px-3">
                      {parseFloat(dish.precio).toFixed(2)} €
                    </Badge>
                  </ListGroup.Item>
                ))
              ) : (
                <div className="text-center p-4 text-muted">No hay platos registrados en este pedido.</div>
              )}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="dark" onClick={() => setShowOrderModal(false)} className="rounded-pill px-4">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default RestaurantDetails
