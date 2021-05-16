require('dotenv').config();
const path = require('path');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const poemRoutes = express.Router();

let Poem = require('./poem.model');
let PoemCollection = require('./poem-collection.model');
let Feature = require('./feature.model');

app.use(cors());
app.use(bodyParser.json());

let PORT = process.env.PORT || 5000;
let DB_URI = process.env.CONNECTION_URI;
let NODE_ENV = app.get('env');

console.log(NODE_ENV);

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('>> Successfully established MongoDB connection!'))
.catch(err => console.error('>> Could not connect to MongoDB!'))


// Get all poems
poemRoutes.route('/').get(function(req, res) {
    console.log('>> Fetching all poems')
    Poem.find({}, '-_id', function(err, poems) {
       if(err) { console.log(err); }
       else { res.json(poems); }
    })
    .sort({ poem_title : 1}) // sort by ascending alphabetical
    .collation({ locale: 'en'}); // case-insensitive collation
});


// Search for poem by ID
poemRoutes.route('/poem/:poem_id').get(function(req, res) {
    console.log('>> Querying for poem: ' + req.params.poem_id);
    Poem.findOne({ poem_id: req.params.poem_id}, '-_id', function(err, poem) {
        if(err) { console.log(err); return res.send(err); }
        else if (poem === null) { console.log('>> Error: poem not found'); return res.status(404); }
        else { res.json(poem); }
    });
});


// Search for collections a given poem is in
poemRoutes.route('/collection_by_poem/:poem_id').get(function(req, res) {
    console.log('>> Querying for poem collection(s) for poem: ' + req.params.poem_id);
    PoemCollection.find({ poem_ids : { $in: [req.params.poem_id] } }, '-_id', function(err, colls) {
        if(err) { return res.send(err); }
        else if (colls === null) { console.log('>> No collections found'); return res.status(404); }
        else { res.json(colls); }
    });
});


// Search for collection by ID
poemRoutes.route('/collection/:collection_id').get(function(req, res) {
    console.log('>> Querying for poem collection by ID: ' + req.params.collection_id);
    PoemCollection.findOne({ collection_id : req.params.collection_id }, '-_id', function(err, coll) {
        if(err) { return res.send(err); }
        else if (coll === null) { console.log('>> Error: poem collection not found'); return res.status(404); }
        else { res.json(coll); }
    });
});


// Get the current feature
poemRoutes.route('/feature/').get(function(req, res) {
    console.log('>> Querying for current feature');
    Feature.findOne( { currently_featured : true }, '-_id -currently_featured', function(err, feat) {
       if(err) { console.log(err); }
       else if (feat === null) { console.log('>> No current feature') }
       else { res.json(feat); }
    });
});


app.use(express.static(path.join(__dirname, "client", "build")))
app.use('/poems', poemRoutes)

app.get("*", (req, res) => {
    if(NODE_ENV=='development') {
        res.sendFile(path.join(__dirname, "client", "public", "index.html"))
    } else {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    }
});


app.listen(PORT, function() {
    console.log('>> Server is running on port ' + PORT);
});
