// Get Quotes From API
const quoteContainer = document.getElementById('quote-container')
const quoteSpan = document.getElementById('quote')
const authorSpan = document.getElementById('author')
const twitterButton = document.getElementById('twitter-button')
const quoteButton = document.getElementById('new-quote-button')
const loaderDiv = document.getElementById('loader')

let quotesArray = []
let quotesLength = 0
let actualIndex = 0
let actualQuote = ''
let fetchQuotesRetries = 0

// Show loading
const showLoadingSpinner = () => {
    loaderDiv.hidden = false
    quoteContainer.hidden = true
}

// Hide Loding
const hideLoadingSpinner = () => {
    quoteContainer.hidden = false
    loaderDiv.hidden = true
}

const getQuotes = async () => {
    showLoadingSpinner()
    if (quotesArray.length !== 0) {
        return [...quotesArray]
    }

    const apiUrl = './quotes.json'

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonData = await response.json();

        quotesArray = [...jsonData]
        quotesLength = jsonData.length
    } catch (err) {
        // Catch Error Here
        quotesArray = []
        quotesLength = 0

        console.error('Error fetching the  quotes', err)

        fetchQuotesRetries++;
        if (fetchQuotesRetries < 10) {
            await getQuotes()
        }

    }
    finally {
        return quotesArray
    }

}

function getRandomQuote(quotesArray) {
    if (quotesLength === 0) {
        return null
    }

    let randomIndex = actualIndex;
    while (randomIndex === actualIndex) {
        randomIndex = Math.floor(Math.random() * quotesLength)
    }

    actualIndex = randomIndex
    return quotesArray[actualIndex]
}

async function getSingleQuote() {
    const quotes = await getQuotes()
    const randomQuote = getRandomQuote(quotes);
    actualQuote = randomQuote

    quoteSpan.textContent = actualQuote.text
    authorSpan.textContent = actualQuote.author || 'Unknown'
    hideLoadingSpinner()

    // Check quote length to determine styling
    if (randomQuote.text.length > 50) {
        quoteSpan.classList.add('long-quote')
    } else {
        quoteSpan.classList.remove('long-quote')
    }
}

getSingleQuote()



const tweetQuote = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${actualQuote.text}-${actualQuote.author}`
    console.log(twitterUrl)
    window.open(twitterUrl, '_blank')
}

// Add event listeners
twitterButton.addEventListener('click', tweetQuote)
quoteButton.addEventListener('click', getSingleQuote)

