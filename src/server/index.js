const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/todos');
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('connection to the db was successful'));

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);



app.get('/todos', (req, res) => {
    Todo.find((err, todos) => {
        if (err) return res.send(err);

        res.send(todos);
    });
});

app.post('/todos', (req, res) => {
    let todo = req.body;
    let t = new Todo(todo);

    console.log(todo);

    t.save((err) => {
        if (err) return res.send(err);

        res.status(201);
        Todo.find((err, todos) => {
            if (err) return res.send(err);
            res.send(todos);
        });
    });
});

app.put('/todos/:id', (req, res) => {

    Todo.findOneAndUpdate({_id : req.params.id}, req.body, {new : true}, (err, todo) => {
       if (err) return res.send(err);

       res.json(todo);
    });
});

app.delete('/todos/:id', (req, res) => {

    Todo.remove({_id : req.params.id}, (err, todo) => {
        if (err) return res.send(err);

        res.status(201);
        Todo.find((err, todos) => {
            if (err) return res.send(err);
            res.send(todos);
        });
    });
});


app.use(express.static(__dirname +'./../../')); //serves the index.html
app.listen(3000, () => console.log('todos app listening on port 3000.'));
