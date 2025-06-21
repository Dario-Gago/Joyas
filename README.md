# 💎 My Precious Spa - API REST

¡Bienvenido a la API RESTful de **My Precious Spa**! Esta solución moderna permite gestionar el inventario de joyas de manera eficiente, segura y escalable. Incluye paginación, filtrado avanzado, ordenamiento dinámico y respuestas con estructura HATEOAS para facilitar la integración con aplicaciones cliente.

---

## 🚀 Dependencias

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Express](https://expressjs.com/) (backend web framework)
- [pg](https://www.npmjs.com/package/pg) (cliente PostgreSQL para Node.js)
- [pg-format](https://www.npmjs.com/package/pg-format) (formateo seguro de queries SQL)
- [dotenv](https://www.npmjs.com/package/dotenv) (manejo seguro de variables de entorno)

---

## ⚙️ Instalación rápida

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd Joyas
   ```
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Configura las variables de entorno:**
   - Crea un archivo `.env` en la raíz del proyecto.
   - Ejemplo de configuración:
     ```env
     DB_USER=postgres
     DB_HOST=localhost
     DB_NAME=joyas
     DB_PASS=tu_contraseña_aquí
     DB_PORT=5432
     ```
   - **Recuerda:** Si tu usuario de PostgreSQL no tiene contraseña, deja `DB_PASS=` vacío.
4. **Inicializa la base de datos:**
   ```bash
   psql -U postgres -f db/init.sql
   ```

---

## ▶️ Ejecución del servidor

Inicia el servidor con:
```bash
node index.js
```
El backend estará disponible en: [http://localhost:3000](http://localhost:3000)

---

## 📚 Endpoints principales

### 1. `GET /joyas`
- Devuelve una estructura HATEOAS de las joyas.
- **Query params:**
  - `limits`: Limita la cantidad de joyas por página.
  - `page`: Página a consultar.
  - `order_by`: Ordena las joyas, ejemplo: `stock_ASC`.

### 2. `GET /joyas/filtros`
- Filtra joyas por:
  - `precio_min`, `precio_max`, `categoria`, `metal`.

### 3. `GET /joyas/joya/:id`
- Devuelve una joya específica por su ID.

---

## 🛡️ Seguridad y buenas prácticas
- Consultas SQL parametrizadas para evitar SQL Injection.
- Middleware de logging: cada consulta queda registrada en consola.
- Manejo robusto de errores con `try/catch` y middleware global.

---

## 🗄️ Inicialización de la base de datos

Ejecuta este script en PostgreSQL para crear la base y poblarla con datos de ejemplo:

```sql
CREATE DATABASE joyas;
\c joyas;
CREATE TABLE inventario (
  id SERIAL,
  nombre VARCHAR(50),
  categoria VARCHAR(50),
  metal VARCHAR(50),
  precio INT,
  stock INT
);
INSERT INTO inventario VALUES
(DEFAULT, 'Collar Heart', 'collar', 'oro', 20000 , 2),
(DEFAULT, 'Collar History', 'collar', 'plata', 15000 , 5),
(DEFAULT, 'Aros Berry', 'aros', 'oro', 12000 , 10),
(DEFAULT, 'Aros Hook Blue', 'aros', 'oro', 25000 , 4),
(DEFAULT, 'Anillo Wish', 'aros', 'plata', 30000 , 4),
(DEFAULT, 'Anillo Cuarzo Greece', 'anillo', 'oro', 40000 , 2);
```

---

## 🧪 Ejemplos de uso (puedes probar en Postman)

- Listar joyas con paginación y orden:
  - `GET /joyas?limits=3&page=2&order_by=stock_ASC`
- Filtrar joyas:
  - `GET /joyas/filtros?precio_min=25000&precio_max=30000&categoria=aros&metal=plata`
- Obtener una joya por ID:
  - `GET /joyas/joya/1`

---

## 👨‍💻 Autores
Desarrollado por **Darío Gago** y **Alberto Cid** para el desafío de My Precious Spa de DesafioLatam.