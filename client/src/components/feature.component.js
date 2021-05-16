import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class FeaturedPoem extends Component{
    constructor(props) {
        super(props);
        this.state  = {
            poem_title : '',
            poem_id : '',
            featured_text : ''
        }
    }

    getFeature() {
        axios.get('/poems/feature/')
        .then(response => {
            if (response.data != null) {
                this.setState({
                    poem_title : response.data.poem_title,
                    poem_id : response.data.poem_id,
                    featured_text : response.data.featured_text
                });
            }
        });
    }

    componentDidMount(){
        this.getFeature();
    }

    render(){
        if (!this.state.poem_id) { return null; }

        if (this.state.poem_id) {
            return (
                <div className="feature-alert align-center">
                    <b>currently featured poem.</b><br />
                    <Link className="featured-poem link-style" to={'/poem/' + this.state.poem_id}>{this.state.poem_title}</Link><br />
                    <i>{this.state.featured_text}</i>
                </div>
            );
        }
    }
}
