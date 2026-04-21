# Bitcoin Block Generator (PHP version)

Esta es una utilidad simple para generar bloques en una red Bitcoin **Regtest** directamente desde un navegador web. Migrada de React a PHP para mayor seguridad y facilidad de despliegue.

## Características

- Interface **Premium** y **Responsiva**: Diseño centrado con Glassmorphism y tema oscuro.
- **Backend Seguro**: Las credenciales RPC se gestionan en el servidor, no se envían al navegador.
- **Dockerizado**: Listo para correr en cualquier entorno con Docker.

## Configuración

La aplicación requiere acceso a un nodo Bitcoin corriendo en modo `regtest`. Debes configurar las siguientes variables de entorno:

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `BITCOIN_RPC_URL` | URL del servidor RPC de Bitcoin | `http://127.0.0.1:18443` |
| `BITCOIN_RPC_USER` | Usuario RPC (bitcoin.conf) | `local_rpc` |
| `BITCOIN_RPC_PASSWORD` | Contraseña RPC (bitcoin.conf) | `local_rpc_password` |

## Ejecución con Docker Compose

### Entorno Local (Puerto 8090)
Ideal para desarrollo. Utiliza el puerto **8090**.
```bash
docker-compose up -d
```
Accede en: `http://localhost:8090`

### Entorno de Producción (Sin puertos expuestos)
Ideal para despliegues detrás de un proxy inverso (como Nginx o Traefik).
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Ejecución con Docker (Manual)

## Ejecución Local (Sin Docker)

Requiere PHP 8.1+ con la extensión `curl` habilitada.

1. Apunta tu servidor web (Apache/Nginx) al directorio `public/`.
2. O usa el servidor de desarrollo de PHP:
   ```bash
   export BITCOIN_RPC_USER=...
   export BITCOIN_RPC_PASSWORD=...
   php -S localhost:8000 -t public/
   ```

## Estructura del Proyecto

- `public/`: Contiene el frontend (PHP/CSS) expuesto a la web.
- `src/`: Contiene la lógica de negocio (BitcoinRPC.php) protegida de acceso directo.
- `Dockerfile`: Configuración para despliegue en contenedores.
