const express = require('express')
const app = express()
const port = 3000


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors'); 
app.use(cors())



const {validateUser} = require('./schemas/users')


let users = [];
let rooms = [];
let reservas = [];


//rooms 
let i=1;
    while(i<3){
        let newRoom = {
            name: "room "+ i,
            id: i,
            location: "10"+i+"L"
        }
        i++
        rooms.push(newRoom)
    }

    
//user

users.push({
    nombre: "Bubu",
    apellido: "Valencia",
    id: "1013463590",
})



//reserva
reservas.push({
    id_user: "1013463590",
    id_room: "1",
    hour: "2:00",
    id: "1"
})


//gets
app.get('/', (req, res)=>{
    res.send("Bienvenidos a la API de usuarios")
})

app.get('/rooms', (req, res)=>{
    res.send({"rooms":rooms})
})

app.get('/users', (req, res)=>{
    res.send({"users":users})
})

app.get('/reservas', (req, res)=>{
    res.send({"users":users})
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



//post
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


//delete
app.delete('/users/:id', (req, res)=>{
    const idToDelete = req.params.id;
    let indexToDelete = users.findIndex(user=>user.id==idToDelete)
    let userDeleted = users.splice(indexToDelete, 1)

    res.send("Se eliminó correctamente el usuario con id: " + userDeleted[0].id)
    borrarreserva(userDeleted);
})


app.delete('/reservas/:id', (req, res)=>{
    const idToDelete = req.params.id;
    let indexToDelete = users.findIndex(user=>user.id==idToDelete)
    let reservaDeleted = users.splice(indexToDelete, 1)

    res.send("Se eliminó correctamente reservas con id: " + reservaDeleted[0].id)
})

app.delete('/rooms/:id', (req, res)=>{
    const idToDelete = req.params.id;
    let indexToDelete = rooms.findIndex(user=>user.id==idToDelete)
    let roomsDeleted = rooms.splice(indexToDelete, 1)

    res.send("Se eliminó correctamente rooms con id: " + roomsDeleted[0].id)
})

function borrarreserva(userDeleted){
    app.delete('/reservas/:id_user', (req, res)=>{
        const idToDelete = req.params.id;
        let indexToDelete = reservas.findIndex(reserva=>reserva.id==idToDelete)
        let reservaDeleted = reservas.splice(indexToDelete, 1)
    
        res.send("Se eliminó correctamente el usuario y la sala: " + reservaDeleted[0].id)
    })
}



//put
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


//patch
app.patch('/users/:id', (req, res)=>{
    let index = users.findIndex(user => user.id == req.params.id)

    if (index !== -1) {

        const requestKeys = Object.keys(req.body);

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