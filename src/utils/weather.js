
const request = require('request')

const weather = ({url, token, options}, {latitude, longitude}, callback) => {

    const requestOptions = {
        url: url + token + latitude + ',' + longitude + '?' + options,
        json: true 
    } 

    request(requestOptions, (error, {statusCode, body}) => {

        if (error) {
            callback('Could not connect to weather service: ' + error)
            return
        } else if (statusCode !== 200) {
            callback('Could not get forcast')
            return
        }

        callback(null, {
            summary       : body.hourly.summary,
            temperature   : body.currently.temperature,
            precipitation : body.currently.precipProbability,
        })
    })

} // weather()

module.exports = weather
