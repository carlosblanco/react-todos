import React, {Component} from 'react';

import styles from '../less/todo.less';

class Todo extends Component {
    constructor(props) {
        super(props);

        this.state = props.todo;

    }

    toggleChange = () => {
        this.setState({
            completed: !this.state.completed
        }, () => {

            fetch('/todos/' + this.state._id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            })
                .then(res => {
                    console.log(res);
                    if (res.ok) {
                        return res.json();
                    }else{
                        Promise.reject(new Error(`HTTP Error ${res.status}`));
                    }
                })
                .then(res => {
                    this.setState(res);
                });
        });
    }

    render() {
        const completed = (this.state.completed) ? 'completed' : '';
        return <span className="column" onClick={this.toggleChange}>
            <input type="checkbox" checked={this.state.completed}  className="todo-checkbox"/>
            <span className={completed + " todo-title"} >{this.state.title}</span>
        </span>
    }
}


export default Todo;
