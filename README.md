# Lightning McFilm ⚡🎬

**Tu cine a toda velocidad – KA-CHOW!**

Lightning McFilm es una plataforma de películas inspirada en el rayo más rápido de Radiator Springs.  
Catálogo completo, listas personales (favoritas, vistas, pendientes), perfil de usuario, PWA instalable y diseño McQueen total.

## Requisitos previos (Software que necesitas instalar)

1. **Docker Desktop** (incluye Docker Compose)  

2. **Git** (opcional, para clonar el repo)  

3. **Navegador moderno** (Chrome recomendado para probar PWA)

## Servicios que hay que arrancar

Con Docker, **todo se arranca con UN SOLO COMANDO**.  
No necesitas arrancar nada manualmente.

Los servicios son:
- `frontend` → React + Vite (PWA)
- `gateway` → API Gateway (Node.js)
- `user_service` → Backend FastAPI (usuarios, listas, auth)
- `movie-service` → Servicio de películas (MongoDB)
- `db` → Base de datos (conectada a tu MySQL local o contenedor)

## Dependencias que hay que instalar

**NINGUNA MANUALMENTE** gracias a Docker.  
Docker se encarga de todo (Node, Python, MySQL, etc.).

Solo necesitas Docker Desktop instalado.

## Cómo arrancar la parte servidora

1. Abre PowerShell o CMD en la carpeta raíz del proyecto (donde está `docker-compose.yml`)

2. Ejecuta el comando
