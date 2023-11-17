import React, {Component} from 'react';
import {elastic as BurgerMenu} from 'react-burger-menu'; // https://github.com/negomi/react-burger-menu

import './react-burger.css';
import ApiV0 from '../service/ApiV0.js';

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {menuOpen: false};
    }

    handleStateChange (state) {
        this.setState({menuOpen: state.isOpen})
    }
    closeMenu () {
        this.setState({menuOpen: false})
    }
    toggleMenu () {
        this.setState(state => ({menuOpen: !state.menuOpen}))
    }
    goToPage(page) {
        this.closeMenu();
        ApiV0.showPage(page)
    }

    render() {
        // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
        return (<>
            <BurgerMenu
                pageWrapId="app-main-content"
                outerContainerId="app-main-container"
                isOpen={this.state.menuOpen}
                onStateChange={(state) => this.handleStateChange(state)}
                width={220}>
                <button id="home" className="menu-item" onClick={() => this.goToPage("home")}>Home</button>
                <button id="about" className="menu-item" onClick={() => this.goToPage("about")}>About</button>
            </BurgerMenu>
        </>);
    }
}