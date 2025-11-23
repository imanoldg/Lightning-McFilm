import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lightning McFilm API',
      version: '1.0.0',
      description: 'API del proyecto Lightning McFilm – Películas + Usuarios con MySQL + MongoDB',
      contact: {
        name: 'Rayo McQueen',
        email: 'mcqueen@lightningmcfilm.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js'], // Aquí buscará los comentarios JSDoc
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;