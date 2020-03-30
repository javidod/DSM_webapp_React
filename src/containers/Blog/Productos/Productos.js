import React, { Component } from 'react';
import axios from '../../../axios';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

import './Productos.css';


class Productos extends Component {
    state = {
        posts: [],
        listacompra: [],
        total: 0,
        setShow: false,
    }

    componentDidMount() {
        axios.get('/Productos.json')
            .then(response => {
                let posts = [];
                for (let key in response.data) {
                    posts.push({
                        ...response.data[key],
                        idb: key,
                        //Ponemos un nuevo campo a los post para controlar la cantidad de productos elegida
                        cantidad: 0
                    });
                }
                //console.log(posts);
                this.setState({ posts: posts });
            }).catch(error => {
                this.setState({ error: true });
            });
    }

    botonClickSuma = (i) => {
        let posts_aux = this.state.posts;
        posts_aux[i].cantidad = posts_aux[i].cantidad + 1;
        this.setState({
            posts: posts_aux,
        });
        //this.state.posts = posts_aux;
        this.ActualizarListaCompra();
        //console.log(this.state.posts[i].cantidad);
    }

    botonClickResta = (i) => {
        if (this.state.posts[i].cantidad > 0) {
            let posts_aux = this.state.posts;
            posts_aux[i].cantidad = posts_aux[i].cantidad - 1;
            this.setState({
                posts: posts_aux,
            });
            //this.state.posts = posts_aux;
        }
        this.ActualizarListaCompra();
        //console.log(this.state.posts[i].cantidad);
    }

    ActualizarListaCompra() {
        let posts_aux = [...this.state.posts];
        let total_aux = 0;
        let listacompra_aux = [];
        // Recorremos el estado actual de los Posts para hacer la suma y la lista de la compra
        posts_aux.forEach(function (valor, indice, array) {
            if (valor.cantidad > 0) {
                total_aux = total_aux + valor.precio * valor.cantidad;
                // Por comodidad guardamos otra variable en estado, pero no nos interesan todos los valores de los productos
                // Nos quedamos solo con titulo y cantidad
                listacompra_aux.push({
                    idb: indice,
                    titulo: posts_aux[indice].titulo,
                    cantidad: posts_aux[indice].cantidad,
                    precio: posts_aux[indice].precio,
                });
            }
        });
        this.setState({
            total: total_aux,
            listacompra: listacompra_aux,
        });
    }

    handleClose() {
        this.setState({
            setShow: false,
        });
    }
    handleShow() {
        //Mandamos la info al padre
        this.infoParent();
        this.setState({
            setShow: true,
        });
    }

    infoParent = () => {
        let listInfo = this.state;
        this.props.callbackFromParent(listInfo);
    }

    render() {
        let posts = '';
        if (!this.state.error) {
            posts = this.state.posts.map((post) =>
                <div className="Productos" key={post.idb}>
                    <div className="col-sm-3">
                        <img width="125px" height="125px" alt={post.titulo} src={post.imagen}></img>
                    </div>
                    <div className="col-sm-9" >
                        <p><b>Título:</b></p>
                        <h5> {post.titulo}</h5>
                        <h5> Precio: {post.precio} €</h5>
                        <div className="NumeroProductos">
                            <button onClick={() => this.botonClickResta(post.idb)}>-</button>
                            {this.state.posts[post.idb].cantidad}
                            <button onClick={() => this.botonClickSuma(post.idb)}>+</button>
                        </div>
                    </div>
                </div>
            )
        }
        // Contenido del modal
        let textomodal = '';
        let footer = '';

        // Si has seleccionado ningún producto
        if (this.state.total > 0) {
            textomodal = this.state.listacompra.map((producto) =>
                <div className="" key={producto.idb}>
                    <div className="col-sm-6">
                        {producto.titulo}
                    </div>
                    <div className="col-sm-6">
                    {producto.cantidad} x {producto.precio} € = {producto.cantidad*producto.precio} €
                    </div>
                </div>
            )
            footer =
                <div><h5 className="TotalModal">TOTAL: {this.state.total} €</h5>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => this.handleClose()}>
                            Cancelar
                    </Button>
                        <NavLink to="/pedido" >
                            <Button variant="dark" >
                                Continuar
                        </Button>
                        </NavLink>
                    </Modal.Footer>
                </div>
            // Si no has seleccionado algun producto
        } else {
            textomodal = "Su pedido está vacío. Por favor, seleccione algún producto. Gracias :D";
            footer =
                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.handleClose()}>
                        Entendido
                </Button>
                </Modal.Footer>
                ;
        }

        return (
            <div>
                <section className="TodosProductos">
                    {posts}
                    <div className="Total">
                        <div className="div">
                        <h5>TOTAL: {this.state.total} €</h5>
                        </div>
                        <div className="div2">     </div>
                        <div className="div">
                        <Button variant="dark" onClick={() => this.handleShow()}>
                            Realizar pedido
                        </Button>
                        </div>
                    </div>

                    {/* Modal */}

                    <Modal
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        show={this.state.setShow}
                        onHide={() => this.handleShow()}
                    >
                        <Modal.Header closeButton onClick={() => this.handleClose()}>
                            <Modal.Title>Su pedido:</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {textomodal}
                        </Modal.Body>
                        {footer}
                    </Modal>

                </section>
            </div>
        );
    }
}

// Usamos prop-types para verificación de tipos
Productos.propTypes = {
    callbackFromParent: PropTypes.func,
}
export default Productos;