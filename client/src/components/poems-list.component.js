import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';

import Header from '../utils/header';
import Footer from '../utils/footer';
import ThemeSwitcher from '../utils/theme-switcher';
import About from '../utils/about';

import Feature from './feature.component';


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
        return (this.state.poems.map((poem) =>
            <li key={poem.poem_id}>
                <Link className='link-style' to={'/poem/' + poem.poem_id}>{poem.poem_title}</Link>
            </li>
        ));
    }


    render() {
        // While loading
        if (!this.state.poems.length) { return null; }

        // Poems list found
        if (this.state.poems) {
            return (
                <div>
                    <Helmet>
                        <title>Emily Writes Poems</title>
                    </Helmet>
                    <Header />
                    <About />
                    <div className='container font-2'>
                       <h3 className='color-accent-2 my-4' align='center'>my poems. ({this.state.poems.length})</h3>
                       <Feature />
                       <ul>{this.poemsList()}</ul>
                    </div>
                    <Footer />
                    <ThemeSwitcher />
                </div>
            );
        }
    }
}
