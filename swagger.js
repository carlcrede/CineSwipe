const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/moviedb.router.js',
    './routes/user.js','./routes/auth/auth.js',
    './routes/ipInfo.router.js','./routes/session.js',]

swaggerAutogen(outputFile, endpointsFiles)