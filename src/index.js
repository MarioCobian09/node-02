import express from "express";
import bodyParser from "body-parser";
// import { initializeApp, cert } from 'firebase-admin'
// import serviceAccount from "ruta";

const app = express()
const PORT = process.env.PORT || 3010

// Configuracion de firebase

// Operaciones CRUD

// Inicializar el servidor
app.listen(PORT, () => {
    console.log(`SERVER ACTIVE IN ${PORT} PORT`)
})