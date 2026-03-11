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


  Ruta del servidor en producción:
  https://restaurants.arasaac.org/

  ```

### Ejecución

```
docker compose up -d
```

### Frontend

    npm create vite@latest

    Estructura estándar de carpetas y ficheros de proyecto creado con Vite

### Intalamos React Bootstrap

npm install react-bootstrap bootstrap

### Instalamos React Router

npm install react-router-dom

### Instalamos gh-pages para publicar en GitHub

npm install gh-pages --save-dev

---

## Configuración final de enrutado antes de la publicación en GitHub con gh-pages

El acceso a los datos, cuando subais el proyecto a github es:
https://51.210.22.156:4000/restaurants

Como hacer que en dev nos funcione en local y en producción apunte a un servidor:

EN LOCAL / DESARROLLO:

1. Define the API URL in .env
   Create environment files in the root of the project.

.env
VITE_API_URL=https://localhost:4000/api.env.production

EN REMOTO / PRODUCCIÓN:

.env.production
#VITE_API_URL=https://api.example.com
#VITE_API_URL=https://51.210.22.156:4000

VITE_API_URL=https://restaurants.arasaac.org

Usar variables en el código para el fetch:
const API_URL = import.meta.env.VITE_API_URL;

fetch(`${API_URL}/users`)
fetch(`${API_URL}/restaurants`)

.then(res => res.json())
.then(data => console.log(data));

import.meta.env ->
Se reemplaza la ruta automáticamente durante la construcción / compilación.

Una vez todo esté configurado y las rutas funcionen correctamente, procederemos a lnzar los comandos de compilación que están definidos en el package.json

vite.config.js
añadimos la linea: base:'/app-restaurante/',

`export default defineConfig({
  plugins: [react()],
  base: '/app-restaurante/',
})`

Ejecutamos `npm run dev` para comprobar que funciona bien en desarrollo.

`"predeploy": "npm run build",
"deploy": "gh-pages -d dist",`

npm run predeploy
npm run deploy

Una vez ejecutados los comandos:

git ads -A
git commit -m "listo para despliegue en GH"

git push origin main

En GitHub:

vamos a nuetro repositorio /app-restauante/

Settings -> Pages

Your site is live at https://javiermax1.github.io/app-restaurante/
Last deployed by @javiermax1 javiermax1 51 minutes ago
