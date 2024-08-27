Backend API Bank
================

Este proyecto es un backend para un sistema de gestión bancaria, construido utilizando Spring Boot. Proporciona una API REST para gestionar entidades bancarias como Clientes, Cuentas, Movimientos, entre otros. Además, cuenta con manejo de excepciones, validaciones y generación de reportes en formato JSON y PDF.

Tabla de Contenidos
-------------------

*   [Características](#características)
    
*   [Tecnologías Utilizadas](#tecnologías-utilizadas)
    
*   [Arquitectura](#arquitectura)
    
*   [Endpoints](#endpoints)
    
    *   [Clientes](#clientes)
        
    *   [Cuentas](#cuentas)
        
    *   [Movimientos](#movimientos)
        
    *   [Reportes](#reportes)
        
*   [Manejo de Errores](#manejo-de-errores)
    
*   [Validaciones](#validaciones)
    
*   [Configuración del Proyecto](#configuración-del-proyecto)
    
    *   [Requisitos Previos](#requisitos-previos)
        
    *   [Configuración Local](#configuración-local)
        
*   [Despliegue con Docker](#despliegue-con-docker)
    
    *   [Construcción de la Imagen Docker](#construcción-de-la-imagen-docker)
        
    *   [Ejecución del Contenedor Docker](#ejecución-del-contenedor-docker)
        
*   [Pruebas](#pruebas)
    

Características
---------------

*   **API REST**: Exposición de servicios RESTful para la gestión de entidades bancarias.
    
*   **Manejo de Excepciones**: Implementación de un sistema robusto para la captura y manejo de errores.
    
*   **Validaciones**: Validación de datos de entrada utilizando anotaciones de Spring.
    
*   **Generación de Reportes**: Generación de reportes en formato JSON y PDF.
    
*   **Despliegue en Docker**: Configuración para desplegar la aplicación en un contenedor Docker.
    

Tecnologías Utilizadas
----------------------

*   Java 17
    
*   Spring Boot
    
*   Spring Data JPA
    
*   Spring Security
    
*   Lombok
    
*   H2 Database (desarrollo)
    
*   MySQL (producción)
    
*   JUnit 5
    
*   Gradle
    
*   Docker
    

Arquitectura
------------

Este proyecto sigue la arquitectura de capas con las siguientes capas principales:

1.  **Controller**: Maneja las solicitudes HTTP y las respuestas.
    
2.  **Service**: Contiene la lógica de negocio.
    
3.  **Repository**: Interactúa con la base de datos.
    
4.  **Model**: Contiene las entidades del dominio.
    

Endpoints
---------

### Clientes

#### Obtener todos los clientes

*   **URL**: /api/clients
    
*   **Método**: GET
    
*   **Descripción**: Obtiene una lista de todos los clientes registrados.

  ```json
[
  {
  "id": 1,
  "name": "Santi",
  "gender": "Male",
  "age": 23,
  "identification": "123456789",
  "address": "123 Main St",
  "phone": "555-1234",
  "clientId": "sanagude",
  "password": "password",
  "status": true
}
]
```  

#### Crear un nuevo cliente

*   **URL**: /api/clients
    
*   **Método**: POST
    
*   **Descripción**: Crea un nuevo cliente.
    
*   **Cuerpo de la solicitud**:
```json
{
  "name": "Santi",
  "gender": "Male",
  "age": 23,
  "identification": "123456789",
  "address": "123 Main St",
  "phone": "555-1234",
  "clientId": "sanagude",
  "password": "password",
  "status": true
}

```  
    
*   **Respuesta**:

```json
{
  "id": 1,
  "name": "Santi",
  "gender": "Male",
  "age": 23,
  "identification": "123456789",
  "address": "123 Main St",
  "phone": "555-1234",
  "clientId": "sanagude",
  "password": "password",
  "status": true
}
```  
    

#### Obtener un cliente por ID

*   **URL**: /api/clients/{id}
    
*   **Método**: GET
    
*   **Descripción**: Obtiene los detalles de un cliente por su ID.
    
*   **Respuesta**:
```json
{
    "id": 2,
    "name": "Emanuel",
    "gender": "Masculino",
    "age": 14,
    "identification": "123456789",
    "address": "Calle 51",
    "phone": "3045454545",
    "clientId": "emanuel",
    "password": "1234567",
    "status": true
}
```  
    

#### Eliminar un cliente

*   **URL**: /api/clients/{id}
    
*   **Método**: DELETE
    
*   **Descripción**: Elimina un cliente por su ID.
    

### Cuentas

#### Obtener todas las cuentas

*   **URL**: /api/accounts
    
*   **Método**: GET
    
*   **Descripción**: Obtiene una lista de todas las cuentas.
    
*   **Respuesta**:
```json
[
  {
    "id": 1,
    "accountNumber": "1234567890",
    "accountType": "Ahorros",
    "initialBalance": 1000.0,
    "availableBalance": 900.0,
    "status": true,
    "client": {
      "id": 1,
      "name": "Santiago Agudelo"
    }
  }
]
```  
    

#### Crear una nueva cuenta

*   **URL**: /api/accounts
    
*   **Método**: POST
    
*   **Descripción**: Crea una nueva cuenta.
    
*   **Cuerpo de la solicitud**:
```json
{
  "accountNumber": "1234567890",
  "accountType": "Ahorros",
  "initialBalance": 1000.0,
  "status": true,
  "clientId": 1
}
```  
    
*   **Respuesta**:
```json
{
  "id": 1,
  "accountNumber": "1234567890",
  "accountType": "Ahorrros",
  "initialBalance": 1000.0,
  "availableBalance": 1000.0,
  "status": true,
  "client": {
    "id": 1,
    "name": "Santiago Agudelo"
  }
}
```  
    

#### Obtener una cuenta por ID

*   **URL**: /api/accounts/{id}
    
*   **Método**: GET
    
*   **Descripción**: Obtiene los detalles de una cuenta por su ID.
    
*   **Respuesta**:
```json
{
  "id": 1,
  "accountNumber": "1234567890",
  "accountType": "Ahorros",
  "initialBalance": 1000.0,
  "availableBalance": 1000.0,
  "status": true,
  "client": {
    "id": 1,
    "name": "Santiago Agudelo"
  }
}
```  
    

#### Eliminar una cuenta

*   **URL**: /api/accounts/{id}
    
*   **Método**: DELETE
    
*   **Descripción**: Elimina una cuenta por su ID.
    

### Movimientos

#### Obtener todos los movimientos

*   **URL**: /api/transactions
    
*   **Método**: GET
    
*   **Descripción**: Obtiene una lista de todos los movimientos.
    
*   **Respuesta**
```json
{
        "id": 1,
        "date": "2024-08-26T20:10:00",
        "transactionType": "CREDIT",
        "amount": 200.0,
        "balance": 1200.0,
        "account": {
            "id": 5,
            "accountNumber": "1234556",
            "accountType": "Ahorros",
            "initialBalance": 1000.0,
            "availableBalance": 1100.0,
            "status": true,
            "client": {
                "id": 2,
                "name": "Emanuel",
                "gender": "Masculino",
                "age": 14,
                "identification": "123456789",
                "address": "Calle 51",
                "phone": "3045454545",
                "clientId": "emanuel",
                "password": "1234567",
                "status": true
            }
        }
    }
```  
    

#### Crear un nuevo movimiento

*   **URL**: /api/transactions
    
*   **Método**: POST
    
*   **Descripción**: Crea un nuevo movimiento.
    
*   **Cuerpo de la solicitud**:
```json
{
  "accountId": 1,
  "transactionType": "CREDIT",
  "amount": 200.0,
  "date": "2024-08-26T20:10:00"
}

```  
    
*   **Respuesta**:
```json
{
    "id": 4,
    "date": "2024-08-23T12:34:56",
    "transactionType": "CREDIT",
    "amount": 800.0,
    "balance": 1900.0,
    "account": {
        "id": 5,
        "accountNumber": "1234556",
        "accountType": "Ahorros",
        "initialBalance": 1000.0,
        "availableBalance": 1900.0,
        "status": true,
        "client": {
            "id": 2,
            "name": "Emanuel",
            "gender": "Masculino",
            "age": 14,
            "identification": "123456789",
            "address": "Calle 51",
            "phone": "3045454545",
            "clientId": "emanuel",
            "password": "1234567",
            "status": true
        }
    }
}
```  
    

#### Obtener un movimiento por ID

*   **URL**: /api/transactions/{id}
    
*   **Método**: GET
    
*   **Descripción**: Obtiene los detalles de un movimiento por su ID.
    
    

#### Eliminar un movimiento

*   **URL**: /api/transactions/{id}
    
*   **Método**: DELETE
    
*   **Descripción**: Elimina un movimiento por su ID.
    

### Reportes

#### Generar un reporte en PDF

*   **URL**: /api/reports
    
*   **Método**: GET
    
*   **Descripción**: Genera un reporte de movimientos de cuenta en formato JSON.
    
*   **Parámetros**:
    
    *   clientId: ID del cliente
        
    *   startDate: Fecha de inicio (formato: YYYY-MM-DD)
        
    *   endDate: Fecha de fin (formato: YYYY-MM-DD)
        
    *   format: Formato del reporte (json o pdf)
        
*   **Ejemplo**:
```bash
GET /api/reports?clientId=1&startDate=2024-08-01&endDate=2024-08-31&format=pdf
```
    

Manejo de Errores
-----------------

El sistema cuenta con un manejador global de excepciones que captura y procesa las excepciones comunes, retornando una respuesta adecuada al cliente.

### Ejemplo de error

*   **Código**: 404 Not Found
    
*   **Descripción**: Cuando se intenta acceder a un recurso que no existe.
    
*   **Respuesta**:
```json
{
  "timestamp": "2024-08-26T20:10:00",
  "status": 404,
  "error": "Not Found",
  "message": "Cliente no encontrado",
  "path": "/api/clients/999"
}
```  
    

Validaciones
------------

Se han implementado validaciones para garantizar la integridad de los datos de entrada. Por ejemplo:

*   Campos requeridos.
    
*   Longitud mínima y máxima de cadenas.
    
*   Formato de fechas.
    

Configuración del Proyecto
--------------------------

### Requisitos Previos

*   **Java 17**
    
*   **Gradle**
    
*   **Docker**
    

### Configuración Local

1.  **Clona el repositorio**:
```bash
git clone https://github.com/santihz98/project-full-stack.git
cd project-full-stack/backend-api-bank
```
    
3.  **Configura la base de datos en el archivo application.properties:**
```bash
spring.datasource.url=jdbc:mysql://localhost:3306/bank_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```
    
5.  **Ejecuta la aplicación localmente:**
```bash
./gradlew bootRun
```
  
Despliegue con Docker
---------------------

### Construcción de la Imagen Docker

1.  **Construye el JAR de la aplicación:**
```bash
./gradlew build
```
    
3.  **Crea la imagen Docker:**
```bash
docker-compose build
```
    

### Ejecución del Contenedor Docker

1.  **Ejecuta el contenedor Docker:**
```bash
 docker-compose up -d
```
    
3.  La aplicación estará disponible en http://localhost:8080.
    

Pruebas
-------

Para ejecutar las pruebas unitarias y de integración, utiliza el siguiente comando:
```bash
./gradlew test
```
