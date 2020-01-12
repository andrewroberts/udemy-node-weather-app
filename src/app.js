// http://www.google.com

// npm
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const request = require('request')

// Built-in
const app = express()

// Local
const geocode = require('./utils/geocode')
const weather = require('./utils/weather')

const port = process.env.PORT || 3000

// Config
const MAPBOX = {
    url     : 'https://api.mapbox.com/geocoding/v5/mapbox.places/', // + 'Los%20Angeles.json?
    token   : 'pk.eyJ1IjoiYW5kcmV3cm9iZXJ0cyIsImEiOiJjazR3dnl2OXIwYWxzM2VxNnF4OGhlOHhhIn0.k8XJJZfV5ksM7HqouUy9vw',
    options : 'limit=1'
}

const DARKSKY = {
    url     : 'https://api.darksky.net/forecast/',
    token   : '5a0964688f9ca47c37a589b49d0b2a98/', // 52.11285,-4.08039?'
    options : 'units=si'
}

// Express paths
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew Roberts'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Roberts'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help!',
        name: 'Andrew Roberts',
        message: 'Bit early to look here yet!'
    })
})

app.get('/weather', (req, res) => {

    const query = req.query

    if (!query.hasOwnProperty('address')) {
        return res.send({
            error: 'Please provide an address'
        })
    }

    const address = req.query.address

    if (typeof address !== 'string') {
        return res.send({
            error: 'Location name has to be a string'
        })
    }

    if (address === '') {
        return res.send({
            error: 'Please specify a location'
        })
    }

    geocode(MAPBOX, address, (error, mapData) => {

        if (error) {
            return res.send({error})
        }

        weather(DARKSKY, mapData, (error, {summary, temperature, precipitation} = {}) => {

            if (error) {
                return res.send({error})
            }

            const forcast = 
                summary + 'Temperature is ' + temperature + ' ' + 
                    'degrees, and ' + precipitation + '% chance of rain.'

            res.send({
                forcast: forcast,
                location: mapData.placeName,
                address: address
            })
        }) 
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help 404',
        name: 'Andrew Roberts',
        message: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Roberts',
        message: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log('Listening on port ' + port)
})