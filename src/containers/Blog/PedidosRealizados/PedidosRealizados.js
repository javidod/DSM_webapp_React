import React, { Component } from 'react';
import axios from '../../../axios';
import { Container, Row, Table, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import './PedidosRealizados.css';
import ModalEliminarPedido from '../../../components/ModalEliminarPedido/ModalEliminarPedido';


import { ContextoAutenticado } from "../Blog";

class PedidosRealizados extends Component {
    state = {
        pedidosrealizados: [],
        error: false,
        modalShow: false,
        idbselected: '',
    }

    componentDidMount() {
        axios.get('/Pedidos.json')
            .then(response => {
                let pedidosrealizados = [];
                for (let key in response.data) {
                    if (response.data[key].infocliente.email === this.props.email) {
                        pedidosrealizados.push({
                            ...response.data[key],
                            idb: key,
                        });
                    }
                }
                this.setState({ pedidosrealizados: pedidosrealizados });
            }).catch(error => {
                this.setState({ error: true });
            });
    }

    // Pedido ver ficha completa
    pedidoCompleto = (id) => {
        // this.props.history.push({pathname: '/posts/' + id});
        //this.props.history.push('/posts/' + id);
        console.log(id);

    }

    // Info para un unico pedido
    infoParent = (idb) => {
        let listInfo = idb;
        this.props.callbackFromParent(listInfo);
    }
    // Eliminar pedido
    eliminarPedido = () => {
        if (this.state.idbselected !== null) {
            let idb = this.state.idbselected;
            axios.delete('/Pedidos/' + idb + '.json')
                .then(response => {
                    // Lo hago así para esperar la respuesta, si no recarga sin borrar
                    window.location.replace('');
                });
        }
    }

    // Funciones modal
    handleClose() {
        this.setState({
            modalShow: false,
        });
    }
    handleShow(idb) {
        //Mandamos la info al padre
        this.setState({
            modalShow: true,
            idbselected: idb.idb
        });
    }
    render() {
        let pedidosrealizados = '';
        let nohaypedidos = '';
        if (!this.state.error) {
            pedidosrealizados = this.state.pedidosrealizados.map(({ infocliente, total, idb }) =>
                <tr key={infocliente.nombre + Math.random()}>
                    {/*ID pedido*/}
                    <td className="IDpedido">
                        <div>{idb}</div>
                    </td>
                    {/*Info del cliente*/}
                    <td className="infoCliente">
                        <div>{infocliente.nombre} {infocliente.apellido1} {infocliente.apellido2}</div>
                    </td>
                    {/*Info del total*/}
                    <td className="total">
                        {total} €
                    </td>
                    {/*Ficha completa*/}
                    <td className="accion">
                        <OverlayTrigger
                            key='right'
                            placement='right'
                            overlay={<Tooltip id='tooltip-right'>
                                Ver datos del pedido
                            </Tooltip>}>
                            <NavLink to="/pedidocompleto">
                                <Button variant="dark" onClick={() => this.infoParent({ idb })}>Ver ficha</Button>
                            </NavLink>
                        </OverlayTrigger>

                    </td>
                    {/*Acción*/}
                    <td className="eliminar">
                        <OverlayTrigger
                            key='right'
                            placement='right'
                            overlay={<Tooltip id='tooltip-right'>
                                Eliminar pedido
                            </Tooltip>}>
                            <img width="35px" height="35px" alt="Borrar pedido"
                                onClick={() => this.handleShow({ idb })}
                                src="https://firebasestorage.googleapis.com/v0/b/fir-javier.appspot.com/o/DSM_5_Proyecto_Final%2Frubbish.png?alt=media&token=5ba33fea-86e3-41e0-b3d9-c3a82cdfd44e"></img>
                        </OverlayTrigger>

                    </td>
                </tr>
            )
        }
        if (pedidosrealizados.length === 0) {
            nohaypedidos = <div>No tiene pedidos.</div>
        }
        return (
            <div className="PedidosRealizados">
                <Container>
                    <Row id = "contexto">

                        <ContextoAutenticado.Consumer>
                            {({ email }) => (
                                <h6>
                                    Pedidos de: {email}
                                </h6>
                            )}
                        </ContextoAutenticado.Consumer>

                    </Row>
                    <Row>
                        <Table striped bordered hover className="tabla">
                            <thead>
                                <tr>
                                    <th>ID pedido</th>
                                    <th>Información cliente</th>
                                    <th>Importe</th>
                                    <th>Ficha completa</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidosrealizados}
                            </tbody>
                        </Table>

                    </Row>
                    {nohaypedidos}
                </Container>

                {/* Modal */}
                <ModalEliminarPedido
                    handleShow={() => this.handleShow()}
                    eliminarPedido={() => this.eliminarPedido()}
                    handleClose={() => this.handleClose()}
                    modalShow={this.state.modalShow}
                >
                </ModalEliminarPedido>
            </div>
        );
    }
}

// Usamos prop-types para verificación de tipos
PedidosRealizados.propTypes = {
    email: PropTypes.string,
    setShow: PropTypes.bool,
    callbackFromParent: PropTypes.func
}

export default PedidosRealizados;