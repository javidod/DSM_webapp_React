import React from 'react';
import {Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

import './ModalEliminarPedido.css';

class ModalEliminarPedido extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        return (
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                show={this.props.modalShow}
                onHide={this.props.handleShow}
            >
                <Modal.Header closeButton onClick={this.props.handleClose}>
                    <Modal.Title>Estás apunto de eliminar el pedido.</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        ¿Estás seguro de querer eliminar el pedido?
                    </p>
                </Modal.Body>
                <div>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.props.handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="dark" onClick={this.props.eliminarPedido} >
                            Borrar
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        );
    }
}

ModalEliminarPedido.propTypes = {
    modalShow: PropTypes.bool,
    eliminarPedido: PropTypes.func,
    handleClose: PropTypes.func,
    handleShow: PropTypes.func,
}

export default ModalEliminarPedido;
