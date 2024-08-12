
import express from "express";
import bodyParser from "body-parser";
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import serviceAccount from "./config/firebaseServiceAccount.json" with {type: 'json'}

const app = express()
const PORT = process.env.PORT || 3010

// Configuracion de firebase
initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore()
const usuarioCollection = db.collection('usuarios')

app.use(bodyParser.json())

// Operaciones CRUD
app.post('/usuarios', async (req, res) => {
    try {
        const newUser = req.body
        const userRef = await usuarioCollection.add(newUser)
        res.status(201).json({
            id: userRef.id,
            ...newUser
        })
    } catch (error) {
        res.status(400).json({
            error: 'No se puede crear el usuario'
        })
    }
})

app.get('/usuarios', async (req, res) => {
    try {
        const collUsuarios = await usuarioCollection.get()
        const usuarios = collUsuarios.docs.map( usu => ({
            id: usu.id,
            ...usu.data()
        }))
        res.status(200).json({
            id: usuarios.id,
            ...usuarios
        })
    } catch (error) {
        res.status(400).json({
            error: 'No se puede mostrar los usuarios'
        })
    }
})

app.get('/usuarios/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const usuario = await usuarioCollection.doc(userId).get()
        if(!usuario) {
            res.status(404).json({
                error: 'El usuario no fue encontrado'
            })
        } else {
            res.status(200).json({
                id: usuario.id,
                ...usuario
            })
        }
    } catch (error) {
        res.status(400).json({
            error: 'No se puede mostrar el usuario'
        })
    }
})

app.delete('/usuarios/:id', async (req, res) => {
    try {
        const userId = req.params.id
        await usuarioCollection.doc(userId).delete()
        res.status(200).json({
            message: 'El usuario fue borrado'
        })
    } catch (error) {
        res.status(400).json({
            error: 'No se puede borrar el usuario'
        })
    }
})

app.put('/usuarios/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const updateUser = req.body
        const respuesta = await usuarioCollection.doc(userId).set(updateUser, {
            merge: true
        })
        console.log(respuesta);
        res.status(200).json({
            id: updateUser.id,
            ...updateUser
        })
    } catch (error) {
        res.status(400).json({
            error: 'No se puede actualizar el usuario'
        })
    }
})

// Inicializar el servidor
app.listen(PORT, () => {
    console.log(`SERVER ACTIVE IN ${PORT} PORT`)
})