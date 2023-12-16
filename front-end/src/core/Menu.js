import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {home, showPage} from "../service/util";

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null
        };
    }
    _retainToken(event) {
        const {token} = event.detail;
        console.log(`retain token`);
        this.setState({token});
    }
    componentDidMount() {
        document.body.addEventListener("retainToken", this._retainToken.bind(this));
    }

    componentWillUnmount() {
        document.body.removeEventListener("retainToken", this._retainToken.bind(this));
    }

    render() {
        const {token} = this.state;
        // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
        return (
            <Navbar bg="dark" data-bs-theme="dark" className="volcanoMenu">
                <Container>
                    <Navbar.Brand href="#" onClick={() => home()}>Home</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#" onClick={() => showPage('about')}>About</Nav.Link>
                        { token && (<Nav.Link href="#" onClick={() => showPage('moderate')}>Moderate</Nav.Link>) }
                        { token && (<Nav.Link href="https://analytics.eu.umami.is/dashboard">Umami cloud</Nav.Link>) }
                    </Nav>
                    <div className="volcanoTitle">Volcano activity</div>
                </Container>
            </Navbar>
        );
    }
}