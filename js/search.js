const finServer = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com'
const searchForm = document.getElementById('search-form');
const searchBtn = document.getElementById('search-btn');
const symbolInput = document.getElementById('stock-symbol');
const resultsList = document.getElementById('results-list');
const searchSpinner = document.querySelector('.lds-dual-ring');

async function getResults(searchTerm) {
    searchSpinner.style.display = 'inline-block';
    searchBtn.style.display = 'none';
    let res = await fetch(finServer + `/api/v3/search?query=${searchTerm}&limit=10&exchange=NASDAQ`);
    let data = await res.json();
    searchSpinner.style.display = 'none';
    searchBtn.style.display = 'inline';
    return data;
}

function resultsToList(results) {
    for (let result of results) {
        let resultLI = document.createElement('LI');
        resultLI.innerHTML = 
        `<a href="./company.html?symbol=${result.symbol}">
        ${result.name} (${result.symbol})
        </a>`;
        resultLI.classList += 'result';
        resultsList.appendChild(resultLI);
    }
}

function clearResults() {
    resultsList.innerHTML = ''
}

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearResults();
    let results = await getResults(symbolInput.value);
    resultsToList(results);
})

