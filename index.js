var shortid = require('shortid'); //this creates id's automtically

///import express
const express = require("express");

//create a server
const server = express();

//MiddleWare - teaches express new tricks
server.use(express.json()); // how to parse JSON from the body

//listen for incoming requests

const port = 8000;
server.listen(port, () => console.log(`\n == API running on port ${port} == \n`));

//users Schema

let users = [
    {
        id: 1,
        name: "Jane Doe",
        bio: "Not Tarzan's Wife, another Jane"
    },
    {
        id: 2,
        name: "Robert Doe",
        bio: "Doctor of the paranormal"
    }
]


//GET - function to handle GET requests to /api/

server.get('/api/', (req, res) => {
    res.send("It works"); //sends this message to confirm that the GET to slash works
});


//GET all users

server.get('/api/users', function(req, res){
    
    if(!users){
        res.status(500).json({ errorMessage: "The users information could not be retrieved." });
    }else{
        res.status(200).json(users);
    }
});


//GET users by id

server.get('/api/users/:id', function(req, res){
    const id = req.params.id;

    users = users.find(u => u.id === Number(id));

    if(!users){
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    }else{
        res.status(200).json(users)
    }

});


//POST - function to handle POST requests

server.post('/api/users', function(req, res){
    const user = req.body;

    if(!user.name || !user.bio){
        res.status(400).json({errorMessage: "Please provide name and bio for the user."});
    }else{
        users.push(user);
        res.status(201).json(users);
    }

})


//DELETE - function to handle DELETE requests

server.delete('/api/users/:id', function(req, res){
    const id = req.params.id;
    let idMatch = false;
    
    for(i=0; i < users.length; i++){

        if(users[i].id == Number(id)){
            idMatch = true;
        }
    }

    if(idMatch == true){
        try{
            users = users.filter(u => u.id !== Number(id));
            res.status(200).json(users);
        }catch{
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    }else{
        res.status(500).json({ errorMessage: "The user could not be removed" });
    }
})


//PUT - function to handle PUT requests (edit user)

server.put('/api/users/:id', function(req, res){
    if(req.body.name == "" || req.body.bio == ""){
        res.status({ errorMessage: "Please provide name and bio for the user." });
    }else{
        const id = req.params.id;
        let idMatch = false;
            for(i=0; i < users.length; i++){
                if(users[i].id == Number(id)){
                    idMatch = true;
                    copyId = i; //this will copy the same id entered in the api endpoint so we can update the user with the same id

                }
            }

            if(idMatch == true){
                try{
                    users[copyId].name = req.body.name;
                    users[copyId].bio = req.body.bio;
                    res.status(200).json(users);
                }catch{
                    res.status(404).json({ message: "The user with the specified ID does not exist." });
                }
            }else{
                res.status(500).json({ errorMessage: "The user information could not be modified." });
            }
    }
});
