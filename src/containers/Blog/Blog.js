import React, { Component } from 'react';
// import axios from 'axios';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import {Nav, Navbar } from 'react-bootstrap';

import './Blog.css';

import Productos from './Productos/Productos';
import PedidosRealizados from './PedidosRealizados/PedidosRealizados';
import Login from './Login/Login';
import Pedido from './Pedido/Pedido';
import PedidoCompleto from './PedidoCompleto/PedidoCompleto';


export const ContextoAutenticado = React.createContext({
    email: ''
});


class Blog extends Component {
    state = {
        auth: false,
        authData: {},
        listacompra: [],
    }

    componentDidMount() {
        // Comento esto para que no pille el token y si recargo la página tenga que volver a logearme

        const token = JSON.parse(localStorage.getItem('token'));
        if (token != null) {
            this.setState({ auth: true });
            this.setState({ authData: { ...token } });
        }
    }

    setAuthentication = (auth, data) => {
        this.setState({ auth: auth, });
        this.setState({ authData: data });
    }

    myCallback = (dataFromChild) => {
        this.setState({
            estadoProductos: dataFromChild
        });
    }

    myCallbackPedidosRealizados = (dataFromChild) => {
        this.setState({
            infoPedidosRealizados: dataFromChild
        });
    }

    cerrarsesion() {
        localStorage.removeItem('token');
        this.setState({
            auth: false,
        });
    }

    render() {
        let login = '';
        let user = '';
        let pedidos = '';
        const valorContext = {
            email: this.state.authData.email
        }
        //console.log(this.state.authData.email);
        if (!this.state.auth) {
            //Si no estás logeado
            login =
                <li><NavLink
                    to="/login"
                    exact
                    activeClassName="my-active"
                    activeStyle={{
                        color: '#fa923f',
                        textDecoration: 'underline'
                    }}><div className="links">Login</div></NavLink></li>
                ;
        } else {
            // Si no estás logeado
            login =
                <li onClick={() => this.cerrarsesion()}>
                    <NavLink
                        to="">
                        <div className="links">Cerrar sesion</div>
                    </NavLink>
                </li>
                ;
            user =
                <li>

                    Logged: {this.state.authData.email}
                </li>
                ;
            pedidos =
                <li>
                    <ContextoAutenticado.Provider value={valorContext}>
                        <NavLink
                            to="/pedidosrealizados"
                            exact
                            activeClassName="my-active"
                            activeStyle={{
                                color: '#fa923f',
                                textDecoration: 'underline'
                            }}><div className="links">Pedidos realizados</div>
                    </NavLink>
                    </ContextoAutenticado.Provider>
                </li>
                ;
        }

        return (
            <div className="Blog">
                <header>
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="Navbar">
                        <Navbar.Brand >
                            <img width="60px" height="60px" alt="Logo" src="https://firebasestorage.googleapis.com/v0/b/fir-javier.appspot.com/o/DSM_5_Proyecto_Final%2Fvideogames.png?alt=media&token=d09dd5f3-21a5-40dd-ab62-d06bd22ed167"></img>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                                <ul>
                                    <li><NavLink
                                        to="/productos"
                                        exact
                                        activeClassName="my-active"
                                        activeStyle={{
                                            color: '#fa923f',
                                            textDecoration: 'underline'
                                        }}><div className="links">Productos</div></NavLink></li>
                                    {pedidos}
                                    {login}
                                    
                                </ul>

                            </Nav>
                            <Nav>
                            {user}
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </header>
                <Switch>
                    <Route path="/productos" render={(props) => <Productos {...props} callbackFromParent={this.myCallback} />} />
                    <Route path="/pedido" render={(props) => <Pedido {...props} estadoProductos={this.state.estadoProductos} />} />

                    <Route path="/pedidosrealizados"
                        render={(props) =>
                            <ContextoAutenticado.Provider value={valorContext}>
                                <PedidosRealizados {...props} email={this.state.authData.email} callbackFromParent={this.myCallbackPedidosRealizados} />
                            </ContextoAutenticado.Provider>
                        }
                    />
                    <Route path="/pedidocompleto" render={(props) => <PedidoCompleto {...props} infoPedidosRealizados={this.state.infoPedidosRealizados} />} />

                    <Route path="/login" render={(props) => <Login {...props} auth={this.state.auth} setAuthentication={this.setAuthentication} />} />
                    <Redirect from="/" to="/productos" />
                </Switch>
            </div>
        );
    }
}

export default Blog;