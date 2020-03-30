import React, { Component } from 'react';
import axios from '../../../axios';
import { Redirect, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

import ModalEliminarPedido from '../../../components/ModalEliminarPedido/ModalEliminarPedido';
import './PedidoCompleto.css';


class PedidoCompleto extends Component {
    state = {
        pedidoCompleto: null,
        error: false,
        modalShow: false,
    }

    componentDidMount() {
        if (this.props.infoPedidosRealizados) {
            let idb = this.props.infoPedidosRealizados.idb;
            axios.get('/Pedidos.json?orderBy="$key"&equalTo="' + idb + '"')
                //axios.get('/Pedidos.json')
                .then(response => {
                    let pedidoCompleto = [];
                    for (let key in response.data) {
                        pedidoCompleto.push({
                            ...response.data[key],
                            idb: key
                        });
                    }
                    //console.log(pedidosrealizados);
                    this.setState({ pedidoCompleto: pedidoCompleto });
                }).catch(error => {
                    this.setState({ error: true });
                });
        }
    }

    // Eliminar pedido
    eliminarPedido = () => {
        if (this.state.pedidoCompleto) {
            let id = this.state.pedidoCompleto[0].idb;
            //console.log(this.state.pedidoCompleto[0].idb);
            axios.delete('/Pedidos/' + id + '.json')
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
    handleShow() {
        //Mandamos la info al padre
        this.setState({
            modalShow: true,
        });
    }
    render() {
        let redirect = '';
        try {
            // Pequeño truco para checkear si las props existen sin que salga el warning de "non-used-vars"
            if (this.props.infoPedidosRealizados.idb) {
                //this.cargarPedidoCompleto();
            }
        } catch (errorInfo) {
            // Si no se pueden obtener las propiedades desde productos
            redirect = <Redirect to="/pedidosrealizados" />;
        }
        let pedidoCompleto = '';
        //console.log(this.state.pedidoCompleto);
        // Si no hay error y pedidoCompleto no está vacío -> Cuidado, que pedidoCompleto al cargar está vacío
        if (!this.state.error && this.state.pedidoCompleto) {
            pedidoCompleto = this.state.pedidoCompleto.map(({ infocliente, listacompra, total, idb }) =>
                <Container className="ContenedorPedidoCompleto" key={infocliente.nombre}>
                    <Row>
                        <Col>
                            <div><h3>Datos del cliente</h3></div>
                            <hr color="black" />
                        </Col>
                    </Row>
                    <Row>
                        {/*Info del cliente*/}
                        <Col>
                            <div>{infocliente.nombre} {infocliente.apellido1} {infocliente.apellido2}</div>
                            <div>{infocliente.direccion}</div>
                            <div>{infocliente.ciudad}, {infocliente.CP} ({infocliente.provincia})</div>
                            <div>{infocliente.pais}</div>
                            <div>{infocliente.email}</div>
                            <br></br>
                        </Col>
                        <Col>
                            <div>Pago mediante VISA, tarjeta:</div>
                            <div>{infocliente.tarjeta}</div>
                            <div>{infocliente.vencimiento}</div>
                            <div>XXX</div>
                        </Col>
                    </Row>
                    <Row>
                        {/*Lista de la compra*/}
                        <Col>
                            <div><h3>Datos del pedido</h3></div>
                            <hr color="black" />
                            {listacompra.map((producto) =>
                                <div key={producto.idb}>
                                    <div><b>{producto.titulo}</b></div>
                                    <div> {producto.cantidad} x {producto.precio} € = {producto.cantidad*producto.precio} €</div>
                                    <br></br>
                                </div>
                                
                            )}
                        </Col>
                    </Row><Row>
                        {/*Total*/}
                        <Col>
                            <div><h3>Total</h3></div>
                            <hr color="black" />
                            <div className="totalPedidoCompleto"><h4>{total} €</h4></div>
                        </Col>
                    </Row>

                </Container>
            )
        }
        return (
            <div>

                <div className="PedidosRealizados">
                    {redirect}
                    {pedidoCompleto}
                </div>
                <div className="Botones">
                    <div className="div">
                        <NavLink to="/pedidosrealizados">
                            <Button variant="dark" >Volver</Button>
                        </NavLink>
                    </div>
                    <div className="div2">     </div>
                    <div className="div">
                        <OverlayTrigger
                            key='right'
                            placement='right'
                            overlay={<Tooltip id='tooltip-right'>
                                Eliminar pedido
                            </Tooltip>}>
                            <Button variant="dark" onClick={() => this.handleShow()} >Eliminar pedido</Button>
                        </OverlayTrigger>
                    </div>
                </div>

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

PedidoCompleto.propTypes = {
    idb: PropTypes.string
}

export default PedidoCompleto;