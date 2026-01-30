# Payment App Backend

Backend API para aplicación de pagos, construido con **NestJS**.

## 🏗️ Arquitectura

Este proyecto implementa **Arquitectura Hexagonal** con **Railway Oriented Programming (ROP)** para los casos de uso.

### Estructura del Proyecto

```
src/
├── domain/                    # Capa de Dominio (Núcleo del negocio)
│   ├── entities/             # Entidades del dominio
│   │   ├── product.entity.ts
│   │   ├── customer.entity.ts
│   │   ├── transaction.entity.ts
│   │   └── delivery.entity.ts
│   ├── value-objects/        # Value Objects
│   │   └── credit-card.vo.ts
│   └── exceptions/           # Excepciones del dominio
│       └── domain.exception.ts
│
├── application/              # Capa de Aplicación (Casos de uso)
│   ├── ports/               # Interfaces (Puertos)
│   │   ├── in/             # Puertos de entrada
│   │   │   ├── create-transaction.port.ts
│   │   │   ├── process-payment.port.ts
│   │   │   ├── get-products.port.ts
│   │   │   └── get-transaction.port.ts
│   │   └── out/            # Puertos de salida
│   │       ├── product-repository.port.ts
│   │       ├── customer-repository.port.ts
│   │       ├── transaction-repository.port.ts
│   │       ├── delivery-repository.port.ts
│   │       └── payment-gateway.port.ts
│   └── use-cases/          # Casos de uso (ROP)
│       ├── get-products.use-case.ts
│       ├── create-transaction.use-case.ts
│       ├── process-payment.use-case.ts
│       └── get-transaction.use-case.ts
│
├── infrastructure/          # Capa de Infraestructura (Adaptadores)
│   ├── adapters/
│   │   ├── persistence/    # Adaptadores de persistencia
│   │   │   ├── product.repository.ts
│   │   │   ├── customer.repository.ts
│   │   │   ├── transaction.repository.ts
│   │   │   └── delivery.repository.ts
│   │   ├── http/          # Adaptadores HTTP
│   │   │   └── payment-gateway.adapter.ts
│   │   └── controllers/   # Controladores REST
│   │       ├── products.controller.ts
│   │       ├── customers.controller.ts
│   │       └── transactions.controller.ts
│   ├── database/
│   │   ├── entities/      # Schemas de TypeORM
│   │   ├── mappers/       # Mappers Domain <-> Schema
│   │   └── seeds/         # Datos de prueba
│   ├── config/            # Configuraciones
│   └── modules/           # Módulos de NestJS
│
└── shared/                # Utilidades compartidas
    └── result.ts         # Pattern Result para ROP
```

### Principios Aplicados

- **Hexagonal Architecture (Ports & Adapters)**: Separación clara entre dominio, aplicación e infraestructura
- **Railway Oriented Programming (ROP)**: Manejo funcional de errores con el patrón Result
- **Dependency Inversion**: Las dependencias apuntan hacia el dominio
- **SOLID Principles**: Código mantenible y extensible
- **Clean Code**: Código legible y bien documentado

## 📊 Modelo de Datos

### Diagrama ER

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  Products   │         │ Transactions │         │  Customers  │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)      │         │ id (PK)     │
│ name        │◄────────│ productId    │────────►│ name        │
│ description │         │ customerId   │         │ email       │
│ price       │         │ quantity     │         │ phone       │
│ stock       │         │ productAmt   │         │ address     │
│ imageUrl    │         │ baseFee      │         │ city        │
│ createdAt   │         │ deliveryFee  │         │ createdAt   │
│ updatedAt   │         │ totalAmount  │         │ updatedAt   │
└─────────────┘         │ status       │         └─────────────┘
                        │ paymentTxId  │                │
                        │ paymentRef   │                │
                        │ paymentMethod│                │
                        │ statusMsg    │                │
                        │ createdAt    │                │
                        │ updatedAt    │                │
                        └──────────────┘                │
                               │                        │
                               ▼                        │
                        ┌──────────────┐                │
                        │  Deliveries  │                │
                        ├──────────────┤                │
                        │ id (PK)      │                │
                        │ transactionId│◄───────────────┘
                        │ customerId   │
                        │ productId    │
                        │ quantity     │
                        │ address      │
                        │ city         │
                        │ status       │
                        │ estimatedDate│
                        │ deliveredAt  │
                        │ createdAt    │
                        │ updatedAt    │
                        └──────────────┘
```

### Entidades

#### Products
- `id`: UUID (Primary Key)
- `name`: Nombre del producto
- `description`: Descripción detallada
- `price`: Precio en COP
- `stock`: Unidades disponibles
- `imageUrl`: URL de la imagen
- `createdAt`, `updatedAt`: Timestamps

#### Customers
- `id`: UUID (Primary Key)
- `name`: Nombre completo
- `email`: Email único
- `phone`: Teléfono
- `address`: Dirección de entrega
- `city`: Ciudad
- `createdAt`, `updatedAt`: Timestamps

#### Transactions
- `id`: UUID (Primary Key)
- `transactionNumber`: Número único de transacción
- `customerId`: FK a Customers
- `productId`: FK a Products
- `quantity`: Cantidad comprada
- `productAmount`: Subtotal del producto
- `baseFee`: Tarifa base (1000 COP)
- `deliveryFee`: Tarifa de envío (5000 COP)
- `totalAmount`: Total a pagar
- `status`: PENDING | APPROVED | DECLINED | ERROR
- `paymentTransactionId`: ID de transacción del Payment Gateway
- `paymentReference`: Referencia del Payment Gateway
- `paymentMethod`: Método de pago usado
- `statusMessage`: Mensaje de estado
- `createdAt`, `updatedAt`: Timestamps

#### Deliveries
- `id`: UUID (Primary Key)
- `transactionId`: FK a Transactions
- `customerId`: FK a Customers
- `productId`: FK a Products
- `quantity`: Cantidad a entregar
- `address`: Dirección de entrega
- `city`: Ciudad
- `status`: PENDING | IN_TRANSIT | DELIVERED | CANCELLED
- `estimatedDeliveryDate`: Fecha estimada
- `deliveredAt`: Fecha de entrega
- `createdAt`, `updatedAt`: Timestamps

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd payment-app-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=<tu_usuario>
DB_PASSWORD=<tu_password>
DB_DATABASE=payment_app
DB_SYNCHRONIZE=false
DB_LOGGING=true

PAYMENT_GATEWAY_BASE_URL=<payment_gateway_api_url>
PAYMENT_GATEWAY_PUBLIC_KEY=<tu_llave_publica>
PAYMENT_GATEWAY_PRIVATE_KEY=<tu_llave_privada>
PAYMENT_GATEWAY_EVENTS_KEY=<tu_events_key>
PAYMENT_GATEWAY_INTEGRITY_KEY=<tu_integrity_key>

# Fees
BASE_FEE=1000
DELIVERY_FEE=5000
```

> Consulta el archivo `.env.example` para ver la estructura completa de variables requeridas.

### 4. Crear la base de datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE payment_app;
\q
```

### 5. Ejecutar migraciones

```bash
npm run migration:run
```

### 6. Poblar la base de datos (Seed)

```bash
npm run seed
```

Esto creará productos en la base de datos.

### 7. Iniciar el servidor

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servidor estará disponible en:
- API: http://localhost:3000/api/v1
- Swagger: http://localhost:3000/api/docs

## 📚 API Endpoints

### Swagger Documentation

La documentación completa de la API está disponible en:
**http://localhost:3000/api/docs**

## 🧪 Testing

### Ejecutar tests

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Coverage (última ejecución)

- Stmts: 95.28%
- Branch: 77.77%
- Funcs: 97.32%
- Lines: 94.97%

El reporte HTML se genera en `coverage/`.

### Tarjetas de Prueba 

Para probar pagos en el ambiente sandbox :

| Número de Tarjeta | Resultado |
|-------------------|-----------|
| `4242424242424242` | **APPROVED** (Aprobada) |
| `4111111111111111` | **DECLINED** (Rechazada) |
| Cualquier otro número | **ERROR** |

**Datos de prueba:**
- CVV: Cualquier 3 dígitos (ej: `123`)
- Fecha de expiración: Cualquier fecha futura (ej: `12/28`)
- Titular: Cualquier nombre

## 🔄 Flujo de Negocio

### Proceso de Pago (5 pasos)

1. **Página de Productos** → Cliente ve productos disponibles
   - `GET /api/v1/products`

2. **Información de Pago y Entrega** → Cliente ingresa datos
   - Crear transacción: `POST /api/v1/transactions`

3. **Tokenización (Frontend)** → Se tokeniza la tarjeta 
   - Tokenizar con la API (desde el frontend)
   - Esto es PCI-DSS compliant: los datos de tarjeta nunca pasan por tu backend

4. **Procesamiento** → Se procesa el pago con el token
   - `POST /api/v1/transactions/:id/payment`
   - Se envía el token de tarjeta (no datos sensibles)
   - Se crea la transacción en el Payment Gateway
   - Se actualiza el estado de la transacción
   - Se reduce el stock del producto
   - Se crea el registro de delivery

5. **Estado Final** → Se muestra el resultado
   - `GET /api/v1/transactions/:id`
   - Redirigir a página de productos con stock actualizado

## 🔐 Validaciones Implementadas

### Token de Tarjeta
- ✅ Validación de formato del token (debe comenzar con `tok_`)
- ✅ Validación de nombre del titular (solo letras y espacios)
- ✅ Validación de email del cliente
- ✅ Validación de cuotas (1-36)

### Transacciones
- ✅ Validación de existencia de cliente
- ✅ Validación de existencia de producto
- ✅ Validación de stock disponible
- ✅ Validación de estado de transacción (solo PENDING puede procesarse)
- ✅ Prevención de doble procesamiento

### Datos de Entrada
- ✅ Validación con `class-validator`
- ✅ Transformación automática de tipos
- ✅ Sanitización de datos

> **Seguridad:** Los datos sensibles de tarjeta (número, CVV, fecha) se tokenizan en el frontend directamente, nunca pasan por el backend.

## 🛡️ Manejo de Errores

El proyecto implementa manejo robusto de errores:

1. **Domain Exceptions**: Errores del dominio (stock insuficiente, tarjeta inválida)
2. **Result Pattern**: ROP para manejo funcional de errores
3. **HTTP Exceptions**: Respuestas HTTP apropiadas (400, 404, 500)
4. **Logging**: Registro de errores para debugging

## Documentación de la API

La documentación interactiva de la API está disponible en **Swagger**:

```
http://localhost:3000/api/docs
```

Desde Swagger puedes:
- Ver todos los endpoints disponibles
- Ver los schemas de request/response
- Probar los endpoints directamente

## 🤝 Contribución

Este proyecto fue desarrollado siguiendo las mejores prácticas de:
- Clean Architecture
- SOLID Principles
- Domain-Driven Design
- Test-Driven Development


## Logging

El proyecto incluye logging detallado en todo el flujo de pago:

```
[TransactionsController] Received request to create transaction
[TransactionsController] Transaction created successfully - ID: xxx, Number: TXN-xxx
[ProcessPaymentUseCase] Starting payment process for transaction: xxx
[ProcessPaymentUseCase] Step 1: Fetching transaction from database
[ProcessPaymentUseCase] Step 2: Validating card token format
[ProcessPaymentUseCase] Step 3: Calling Payment Gateway
[PaymentGatewayAdapter] Creating payment gateway transaction - Amount: 150000 (15000000)
[ProcessPaymentUseCase] Step 4: Payment approved, updating transaction
[ProcessPaymentUseCase] Step 5: Updating product stock
[ProcessPaymentUseCase] Stock updated: 100 -> 99 (decreased by 1)
[ProcessPaymentUseCase] Step 6: Creating delivery
[ProcessPaymentUseCase] Step 7: Saving updated transaction
[ProcessPaymentUseCase] Payment process completed successfully
```


