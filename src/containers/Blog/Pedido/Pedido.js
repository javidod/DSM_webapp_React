import React from 'react';
import axios from '../../../axios';
import { Redirect, NavLink } from 'react-router-dom';
import { Button, Form, Col, InputGroup, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

import './Pedido.css';

class Pedido extends React.Component {
    constructor(props) {
        super(props);
        //console.log(props);
        this.inputElement = React.createRef();
    }

    state = {
        // Lo guardamos en una sola variable para luego enviarlo
        infocliente: {
            nombre: '',
            apellido1: '',
            apellido2: '',
            direccion: '',
            ciudad: '',
            provincia: '',
            CP: '',
            pais: '',
            tarjeta: '',
            cvc: '',
            vencimiento: '',
            email: '',
        },
        validado: false,
        modalShow: false,
    }

    componentDidMount() {
        this.inputElement.current.focus();
    }
    // Función para el formulario
    comprobacionCampos = (event) => {
        //console.log(this.state);
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            // Para que no recargue la página
            event.preventDefault();
            // Realizamos la subida de la información a la base de datos
            this.subirBDD();
            // Mostramos el modal
            this.handleShow();
        }
        this.setState({
            validado: true,
        });

    }

    // Función para subir a la base de datos
    subirBDD() {
        //console.log(this.state.infocliente);
        //console.log(this.props.estadoProductos.listacompra);
        //console.log(this.props.estadoProductos.total);
        const data = {
            infocliente: this.state.infocliente,
            listacompra: this.props.estadoProductos.listacompra,
            total: this.props.estadoProductos.total
        };
        axios.post('/Pedidos.json', data)
            .then(response => {

            });
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
            //console.log(this.props);
            // Pequeño truco para checkear si las props existen sin que salga el warning de "non-used-vars"
            if (this.props.estadoProductos.listacompra && this.props.estadoProductos.total) { }
            //let listacompra = this.props.estadoProductos.listacompra;
            //let total = this.props.estadoProductos.total;

        } catch (errorInfo) {
            // Si no se pueden obtener las propiedades desde productos
            redirect = <Redirect to="/productos" />;
        }
        return (
            <div className="Pedido">
                {/*Si no hay datos del pedido redireccionamos */}
                {redirect}
                {/*Formulario */}
                <Form className="FormularioProducto" noValidate validated={this.state.validado} onSubmit={this.comprobacionCampos}>
                    <Form.Row>
                        <Form.Group as={Col} >
                            <Form.Label><h3>Datos del cliente</h3></Form.Label>
                            <hr size="8px" color="black" />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} md="2" controlId="validationCustom01">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Nombre"
                                value={this.state.infocliente.nombre} ref={this.inputElement} onChange={(event) => this.setState({ infocliente: { ...this.state.infocliente, nombre: event.target.value } })}
                            />
                            <Form.Control.Feedback>Perfecto!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationCustom02">
                            <Form.Label>Primer Apellido</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Segundo apellido"
                                value={this.state.infocliente.apellido1} onChange={(event) => this.setState({ infocliente: { ...this.state.infocliente, apellido1: event.target.value } })}
                            />
                            <Form.Control.Feedback>Perfecto!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationCustomUsername">
                            <Form.Label>Segundo Apellido</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Segundo apellido"
                                    value={this.state.infocliente.apellido2} onChange={(event) => this.setState({ infocliente: { ...this.state.infocliente, apellido2: event.target.value } })}
                                />
                                <Form.Control.Feedback>Perfecto!</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} md="8" controlId="validationCustom01">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Dirección"
                                value={this.state.infocliente.direccion} onChange={(event) => this.setState({ infocliente: { ...this.state.infocliente, direccion: event.target.value } })}
                            />
                            <Form.Control.Feedback>Perfecto!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Introduzca la dirección para realizar el envío.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} md="3" controlId="validationCustom03">
                            <Form.Label>Ciudad</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Ciudad"
                                value={this.state.infocliente.ciudad} onChange={(event) => this.setState({ infocliente: { ...this.state.infocliente, ciudad: event.target.value } })}
                            />
                            <Form.Control.Feedback type="invalid">
                                Introduce una ciudad.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="validationCustom04">
                            <Form.Label>Provincia</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Provincia"
                                value={this.state.infocliente.provincia} onChange={(event) => this.setState({ infocliente: { ...this.state.infocliente, provincia: event.target.value } })}
                            />
                            <Form.Control.Feedback type="invalid">
                                Introduce una provincia válida.
                             </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="validationCustom05">
                            <Form.Label>Código Postal</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Código Postal"
                                value={this.state.infocliente.CP} onChange={(event) => this.setState({ infocliente: { ...this.state.infocliente, CP: event.target.value } })}
                            />
                            <Form.Control.Feedback type="invalid">
                                Introduce un código postal válido.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="validationCustom06">
                            <Form.Label>País</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="País"
                                value={this.state.infocliente.pais} onChange={(event) => this.setState({ infocliente: { ...this.state.infocliente, pais: event.target.value } })}
                            />
                            <Form.Control.Feedback type="invalid">
                                Introduce un código postal válido.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} md="6" controlId="validationCustom20">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Email"
                                value={this.state.infocliente.email} onChange={(event) => this.setState({ infocliente: { ...this.state.infocliente, email: event.target.value } })}
                            />
                            <Form.Control.Feedback type="invalid">
                                Introduce un código postal válido.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} >
                            <Form.Label><h3>Método de pago</h3></Form.Label>
                            <hr size="8px" color="black" />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} md="6" controlId="validationCustom10">
                            <Form.Label>Número de tarjeta</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroupPrepend">VISA</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Número de tarjeta"
                                    value={this.state.infocliente.tarjeta} onChange={(event) => this.setState({ infocliente: { ...this.state.infocliente, tarjeta: event.target.value } })}
                                />
                                <Form.Control.Feedback>Perfecto!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    Introduce una tarjeta para realizar el pago.
                            </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} md="2" controlId="validationCustom11">
                            <Form.Label>CVC</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="CVC"
                                value={this.state.infocliente.cvc} onChange={(event) => this.setState({ infocliente: { ...this.state.infocliente, cvc: event.target.value } })}
                            />
                            <Form.Control.Feedback>Perfecto!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Código CVC en el reverso de la tarjeta.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="3.5" controlId="validationCustom11">
                            <Form.Label>Vencimiento</Form.Label>
                            <Form.Control
                                required
                                type="date"
                                placeholder="Vencimiento"
                                value={this.state.infocliente.vencimiento} onChange={(event) => this.setState({ infocliente: { ...this.state.infocliente, vencimiento: event.target.value } })}
                            />
                            <Form.Control.Feedback>Perfecto!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Fecha vencimiento tarjeta.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <OverlayTrigger
                            key='right'
                            placement='right'
                            overlay={<Tooltip id='tooltip-right'>
                                La presente Política de Privacidad establece los términos en que se usa y protege la información que es proporcionada por los usuarios al momento de utilizar este sitio web. Esta compañía está comprometida con la seguridad de los datos de sus usuarios.
                                </Tooltip>}>
                            <Form.Group>
                                <Form.Check
                                    required
                                    label="Aceptar términos y condiciones."
                                    feedback="Debes aceptar los términos y condiciones de la página."
                                />
                            </Form.Group>
                        </OverlayTrigger>
                    </Form.Row>
                    <Button type='submit'>Realizar pedido</Button>
                </Form>

                {/* Modal */}

                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    show={this.state.modalShow}
                    onHide={() => this.handleShow()}
                >
                    <Modal.Header closeButton onClick={() => this.handleClose()}>
                        <Modal.Title>Gracias !</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Muchas gracias por su pedido. :D</p>
                        <p>Intentaremos realizar el envío lo más rápido posible.</p>
                    </Modal.Body>
                    <div>
                        <Modal.Footer>
                            <NavLink to="/Productos" >
                                <Button variant="primary" >
                                    Realizar un nuevo pedido
                                </Button>
                            </NavLink>
                        </Modal.Footer>
                    </div>
                </Modal>
            </div>
        );
    }
}

// Usamos prop-types para verificación de tipos
Pedido.propTypes = {
    estadoProductos: PropTypes.shape({
        posts: PropTypes.array,
        listacompra: PropTypes.array,
        total: PropTypes.number,
        setShow: PropTypes.bool
      }),
}

export default Pedido;