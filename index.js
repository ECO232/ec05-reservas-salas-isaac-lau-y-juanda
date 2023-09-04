const express = require('express')
const app = express()
const port = 3000

// Use Json middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [];
let rooms = [];
let reserva = [];

let i=1;
while(i<3){
    rooms.push({
        id: i,
        name: "room "+ i,
        location: "10"+i+"L"
    })
    i++
}



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
    let newUser = {
        name:req.body.name,
        last:req.body.last,
        age:req.body.age,
        id:req.body.id,
        email:req.body.email
    }
    users.push(newUser)
    res.send("¡Creación de usuario exitosa!")
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

    users[index].name = req.body.name || users[index].name
    users[index].last = req.body.last || users[index].last
    users[index].age = req.body.age || users[index].age
    users[index].email = req.body.email || users[index].email

    res.send("usuario modificado ")
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })