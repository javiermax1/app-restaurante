import { Navbar, Container } from 'react-bootstrap'

const Header = () => (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-3 mb-0">
        <Container>
            <Navbar.Brand href="/" className="d-flex align-items-center fw-bold">
                <span className="fs-3 me-2">🥘</span>
                <span className="text-warning">App</span><span className="text-white">Restaurante</span>
            </Navbar.Brand>
        </Container>
    </Navbar>
)

export default Header
