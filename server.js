const express = require('express');
const { existTodoID, removeTODO, updateTODO } = require('./helpers/helperFunctions');
let TODOS = require('./models/data');
const PORT = process.env.PORT || 8080;

var cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.static('public'));

app.get('/todos', (req, res) => {
  res.status(200).json(TODOS);
})

app.post('/todos', (req, res) => {
  let {id, text, done} = req.body;
  if(!text || !id){
    res.status(400).send('Missing todo content');
    return;
  }
  
  if(existTodoID(id, TODOS)){
    res.status(409).send('Caution, duplicate todo id!');
    return;
  }

  if(done === undefined){
    done = false;
  }
  let newTodo = {id, text, done};
  TODOS.push(newTodo)
  res.status(201).send(`Todo added : ${JSON.stringify(newTodo)}`)
})

app.delete('/todos/:todoID', (req, res) => {
  const todoIdToDelete = parseInt(req.params.todoID);
  if(existTodoID(todoIdToDelete, TODOS)){
    TODOS = removeTODO(todoIdToDelete, TODOS);
    res.status(204).send();
  }else{
    res.status(404).send('Id does not exist!');
  }
})

app.put('/todos/:todoID', (req, res) => {
  const todoIdToUpdate = parseInt(req.params.todoID);
  let {text, done} = req.body;

  if(existTodoID(todoIdToUpdate, TODOS)){
    const updated = updateTODO(todoIdToUpdate, text, done, TODOS);
    res.status(200).send(`Successfully updated ${JSON.stringify(updated)}`);
  }else{
    res.status(404).send('Id does not exist!');
  }
})

app.listen(PORT, (req, res) => {
  console.log(`Server listening at port: ${PORT}`);
})