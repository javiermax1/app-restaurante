// carga de los módulos necesarios:
// const express = require('express')
// const cors = require('cors')
// const mysql = require('mysql2')
// const dotenv = require('dotenv')

const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()

// create an Express app -> es el servidor web de Node.js que escucha las peticiones
const app = express()
// configuro cors para permitir peticiones desde cualquier origen
app.use(cors())
const port = 3000
let db

// Function to establish a connection with retries
// connexión con intentos de reconexión
function connectWithRetry() {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  // Attempt to connect
  // intento de conexión
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err)
      // Retry after 5 seconds
      console.log('Retrying in 5 seconds...')
      setTimeout(connectWithRetry, 5000)
    } else {
      console.log('Connected to MySQL database')
    }
  })
}

// Start the connection with retries
connectWithRetry()

// ENDPOINTS rutas de acceso a los datos
// Define your endpoints

// SQL query a respuesta.json
// Get all categories
app.get('/categories', (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results) // enviar los resultados en la respuesta res.satus(200)
    }
  })
})

// Get all restaurants
app.get('/restaurants', (req, res) => {
  db.query('SELECT * FROM restaurantes', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get all dishes
app.get('/dishes', (req, res) => {
  db.query('SELECT * FROM platos', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get all customers
app.get('/customers', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get all orders
app.get('/orders', (req, res) => {
  db.query('SELECT * FROM pedidos', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get all dishes for a specific order
app.get('/order/:orderId/dishes', (req, res) => {
  const orderId = req.params.orderId
  db.query(
    'SELECT pl.platoID, pl.plato, pl.descripcion, pl.precio, pp.cantidad FROM platospedidos pp JOIN platos pl ON pp.platoID = pl.platoID WHERE pp.pedidoID = ?',
    [orderId],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
      } else {
        res.json(results)
      }
    },
  )
})

// --- OPTIMIZED ENDPOINTS ---

// Get specific restaurant detail
app.get('/restaurants/:id', (req, res) => {
  db.query('SELECT * FROM restaurantes WHERE restauranteID = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results[0] || null)
    }
  })
})

// Get dishes for a specific restaurant
app.get('/restaurants/:id/dishes', (req, res) => {
  db.query('SELECT * FROM platos WHERE restauranteID = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get orders for a specific restaurant with Customer Info (JOIN)
app.get('/restaurants/:id/orders', (req, res) => {
  const query = `
    SELECT p.*, cl.nombre, cl.apellido1, cl.apellido2, cl.sexo, cl.poblacion
    FROM pedidos p
    JOIN clientes cl ON p.clienteID = cl.clienteID
    WHERE p.restauranteID = ?
  `
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      // Map it to look like the client-side enriched format
      const enrichedOrders = results.map(row => ({
        ...row,
        customer: {
          nombre: row.nombre,
          apellido1: row.apellido1,
          apellido2: row.apellido2,
          sexo: row.sexo,
          poblacion: row.poblacion
        }
      }))
      res.json(enrichedOrders)
    }
  })
})

// ---------------------------

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
