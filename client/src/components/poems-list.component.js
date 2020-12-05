import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';

import Header from './header';
import Footer from './footer';
import About from './about';
import ThemeSwitcher from './theme-switcher';


export default class PoemsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            poems: []
        }
    }


    componentDidMount() {
        axios.get('/poems/')
        .then(response => {
            this.setState({poems: response.data});
        })
        .catch(function (error) {
            console.log(error);
        })
    }


    poemsList() {
        // map each poem to its own Link
        return(this.state.poems.map((poem) =>
            <li key={poem.poem_id}>
                <Link className='link-style' to={'/poem/' + poem.poem_id}>{poem.poem_title}</Link>
            </li>
        ));
    }


    render() {
        return (
            <div>
                <Helmet>
                    <title>Emily Writes Poems</title>
                </Helmet>
                <Header />
                <About />
                <div className='container font-2'>
                   <h3 className='color-accent-2 my-4' align='center'>my poems. ({this.state.poems.length})</h3>
                   <ul>{this.poemsList()}</ul>
                </div>
                <Footer />
                <ThemeSwitcher />
            </div>
        )
    }
}
