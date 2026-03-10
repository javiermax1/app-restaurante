# App Restaurante - Documentación:

## Estructura general del proyecto:

    carpeta backend

    carpeta frontend

### Backend:

    app
    -> Dockerfile
    -> app.js

    data
    -> initData con BBDD
    -> carpeta mysql

    notas

    docker-compose.yml

### Descripción

- Un contenedor con una base de datos mysql llamada restaurante y un esquema de base de datos según ./data/initData/database.sql
- Un contenedor con un phpmyadmin para acceder a la base de datos
  - usuario/pwd por defecto user/admin (se puede modificar en el fichero .env)

  ```
  phpmyadmin:
  
  localhost:9091
  ```

- Un contenedor con una aplicación en node.js que obtiene los datos y los muestra vía API:

  ```
  http://localhost:4000/categories
  http://localhost:4000/restaurants
  http://localhost:4000/dishes
  http://localhost:4000/customers
  http://localhost:4000/orders
  http://localhost:4000/order/1/dishes

  ```

### Ejecución

```
docker compose up -d
```

### Frontend

    npm create vite@latest

    Estructura estandar de carpetas y ficheros de proyecto creado con Vite

### Intalamos React Bootstrap

npm install react-bootstrap bootstrap

### Instalamos gh-pages para publicar en GitHub

npm install gh-pages --save-dev
