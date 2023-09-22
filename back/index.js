const express = require('express')
const app = express()
const port = 3000

// Use Json middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//const cors = require('cors'); 
//app.use(cors())



const {validateUser} = require('./schemas/users')

// Esto no es REST pero mientras tantillo
let users = []
let rooms = []
let reserva 
users.push({
    name: "Pepito",
    last: "Perez",
    age: 26,
    id: "1130613425",
    email: "pperez@u.icesi.edu.co"
})

app.get('/users/:id', (req, res)=>{
    console.log("params:", req.params)
    const requestID = req.params.id
    let requiredUser = null;
    for (let index = 0; index < users.length; index++) {
        console.log(users[index].id === requestID, users[index].id, requestID)
        if(users[index].id === requestID){
            requiredUser = users[index];
        }
    }
    console.log(requiredUser)
    res.json(requiredUser)
})


app.get('/users', (req, res)=>{
    if(req.query.age){
        users = users.filter(
            (user)=>{return user.age == req.query.age}
        )
    }
    res.send({"users":users})
})

app.post('/users', (req, res) => {

    const userValidationResult = validateUser(req.body)    
    console.log("result", userValidationResult.error)

    if(userValidationResult.error){
        return res.status(400).send(
            {message:JSON.parse(userValidationResult.error.message)}
        )
    }

    let newUser = {
        name:userValidationResult.data.name,
        last:userValidationResult.data.last,
        age:userValidationResult.data.age,
        id:userValidationResult.data.id,
        email:userValidationResult.data.email
    }
    users.push(newUser)    
    res.status(201).send({"message":"Creación Exitosa!", "user":newUser})
})

app.get('/', (req, res)=>{
    res.send("Bienvenidos a la API de usuarios")
})

app.delete('/users/:id', (req, res)=>{
    const idToDelete = req.params.id;
    let indexToDelete = users.findIndex(user=>user.id==idToDelete)
    let userDeleted = users.splice(indexToDelete, 1)
    //console.log("user delete: ", userDeleted)
    res.send("Se eliminó correctamente el usuario con id: " + userDeleted[0].id)
})

app.put('/users/:id',(req, res)=>{
    let index = users.findIndex(user => user.id == req.params.id)
    let newUser = {
        name:req.body.name,
        last:req.body.last,
        age:req.body.age,
        id:req.body.id,
        email:req.body.email
    }
    users[index]=newUser
    res.send("usuario reemplazado " + newUser )
})

app.patch('/users/:id', (req, res)=>{
    let index = users.findIndex(user => user.id == req.params.id)

    /* A pie 🦶*/
    //users[index].name = req.body.name || users[index].name
    //users[index].last = req.body.last || users[index].last
    //users[index].age = req.body.age || users[index].age
    //users[index].email = req.body.email || users[index].email

    /* Para generalizarlo ⭐*/
    if (index !== -1) {
        // Obtén las claves del cuerpo de la solicitud
        const requestKeys = Object.keys(req.body);
        // Itera sobre las claves y verifica si existen en el objeto
        requestKeys.forEach(key => {
            if (users[index][key] !== undefined) {
                users[index][key] = req.body[key];
            }
        });
        res.send("Usuario modificado para las claves: " + requestKeys.join(', '));
    } else {
        res.status(404).send("Usuario no encontrado");
    }
});

app.use("", (req, res)=>{
    res.status(404).send("No encontramos el recurso solicitado")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})