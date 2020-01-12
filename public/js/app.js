console.log('Client-side javscript running!')

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault()

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''

    const location = search.value

    const url = '/weather?address=' + location

    fetch(url).then((response) => {
        response.json().then((data) => {
            if (data.hasOwnProperty('error')) {
                messageTwo.textContent = ''
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = ''
                messageTwo.textContent = data.location + ' - ' + data.forcast
            }
        })
    })    
})