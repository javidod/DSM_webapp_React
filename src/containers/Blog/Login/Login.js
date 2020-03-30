import React from 'react';
import axios from '../../../axios';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form, Col } from 'react-bootstrap';

import './Login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.inputElement = React.createRef();
    }
    state = {
        email: '',
        password: '',
        error: false,
        errormsg: '',
    }

    componentDidMount() {
        this.inputElement.current.focus();
    }

    postLoginHandler = () => {
        const authData = {
            email: this.state.email,
            password: this.state.password,
            returnSecureToken: true
        };
        //console.log(authData);
        axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAN4x-RBH1n03HzAopSe15gRDVYYr5x1ks', authData)
            .then(response => {
                //console.log(response)
                localStorage.setItem('token', JSON.stringify(response.data));
                this.props.setAuthentication(true, response.data);
            })
            .catch(err => {
                //console.log(err.response);
                this.props.setAuthentication(false, {});
                this.setState({ error: true });
                this.setState({ errormsg: err.response.data.error.message });
            });
    }

    postRegisterHandler = () => {
        const authData = {
            email: this.state.email,
            password: this.state.password,
            returnSecureToken: true
        };
        //console.log(authData);
        axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAN4x-RBH1n03HzAopSe15gRDVYYr5x1ks', authData)
            .then(response => {
                console.log(response)
                localStorage.setItem('token', JSON.stringify(response.data));
                this.props.setAuthentication(true, response.data);
            })
            .catch(err => {
                //console.log(err.response.data.error.message);
                this.props.setAuthentication(false, {});
                this.setState({ error: true });
                this.setState({ errormsg: err.response.data.error.message });
            });
    }

    render() {

        // Si estás logeado te manda a productos
        let redirect = null;
        if (this.props.auth) {
            redirect = <Redirect to="/productos" />;
        }

        // Si da error te lo muestra
        let error = "";
        if (this.state.error) {
            error =
                <Form.Row>
                    <Form.Group className= "error"as={Col} controlId="validationCustom01">
                        <Form.Label>Error:</Form.Label>
                        {this.state.errormsg}
                    </Form.Group>
                </Form.Row>
        }

        //console.log(this.state.error);
        return (
            <div className="Login o Register">
                {redirect}
                <h1>Login</h1>
                <Form className="FormularioProducto">
                    <Form.Row>
                        <Form.Group as={Col} controlId="validationCustom01">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Email"
                                ref={this.inputElement}
                                value={this.state.email}
                                onChange={(event) => this.setState({ email: event.target.value })}
                            />

                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="validationCustom01">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="password"
                                value={this.state.password}
                                onChange={(event) => this.setState({ password: event.target.value })}
                            />

                        </Form.Group>
                    </Form.Row>
                    <Button variant="dark" onClick={this.postLoginHandler}>ACCEDER</Button>
                    <Button variant="dark" onClick={this.postRegisterHandler}>REGISTRAR</Button>
                    {error}
                </Form>
            </div>
        );
    }
}

// Usamos prop-types para verificación de tipos
Login.propTypes = {
    auth: PropTypes.bool,
    setAuthentication: PropTypes.func,
}

export default Login;
