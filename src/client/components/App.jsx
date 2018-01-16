import React, {Component} from 'react';

import Todo from './Todo.jsx';

import styles from '../less/app.less';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            todos: [],
            newTodo: ''
        };

    }

    componentDidMount() {
        fetch('todos')
            .then(response => response.json())
            .then(data => {
                this.setState({todos: data})
            })
    }

    onSubmit = (e) => {
        e.preventDefault();
        fetch('/todos', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: this.state.newTodo, completed: false})
        })
            .then(res => res.json())
            .then(res => this.setState({todos: res, newTodo: ''}));


    }

    onChange = (e) => {
        this.setState({newTodo: e.target.value});
    }

    delete = (todo) => {
        fetch('/todos/' + todo._id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => this.setState({todos: res}));
    }

    render() {
        return <div className="container">
            <div className="row">
                <h1 className="header">To-Dos</h1>
            </div>
            <div className="row">
                <form name="todo-form" className="todo-form" onSubmit={this.onSubmit}>
                    <fieldset>
                        <input type="text" value={this.state.newTodo} onChange={this.onChange} required
                               placeholder="Type a title"/>
                        <button type="submit" className="todo-form-add-button button button-outline button-small">Add To-Do</button>
                    </fieldset>
                </form>
            </div>

                {this.state.todos.map(i => <div className="row todo-row" key={i._id}>
                    <Todo todo={i} />
                    <button onClick={() => this.delete(i)} className="button button-small column">delete</button>
                </div>)}

        </div>;
    }
}

export default App;