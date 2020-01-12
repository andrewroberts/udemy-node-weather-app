const request = require('request')

const geocode = (config, address, callback) => {

    const options = {
        url: config.url + encodeURIComponent(address) + '.json?access_token=' + config.token + '&' + config.options,
        json: true
    }
    
    request(options, (error, response) => {

        if (error) {
            callback('Could not connect to location service: ' + error)
            return
        } else if (response.body.features.length === 0) {
            callback('Could not find location: "' + address + '"')
            return
        }

        const features = response.body.features[0]
        const latLong = features.center

        callback(null, {
            latitude: latLong[1],
            longitude: latLong[0],
            placeName: features.place_name
        })
    })

} // geocode()

module.exports = geocode
