const finServer = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com'
const searchForm = document.getElementById('search-form');
const searchBtn = document.getElementById('search-btn');
const symbolInput = document.getElementById('stock-symbol');
const resultsList = document.getElementById('results-list');
const searchSpinner = document.querySelector('.lds-dual-ring');

function getResultData(symbol) {
    let response = fetch(`${finServer}/api/v3/company/profile/${symbol}`)
    .then(res => {
        return res.json();
    })
    .then(data => {
        return {
            img: data.profile.image.toString(),
            percent: data.profile.changesPercentage
        };
    })
    return response;
}

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
    if (!symbolInput.value) {
        return 1;
    }
    for (let result of results) {
        let resultLI = document.createElement('LI');
        let resultA = document.createElement('A');
        let resultIMG = document.createElement('IMG');
        let resultName = document.createElement('P');
        let resultPercent = document.createElement('P');
        
        resultA.href = `./company.html?symbol=${result.symbol}`;
        getResultData(result.symbol).then(resultData => {
            resultIMG.src = resultData.img;
            resultPercent.innerText = resultData.percent;
            if (resultData.percent[1] === '+') {
                resultPercent.classList += 'result-increase';
            } else {
                resultPercent.classList += 'result-decrease';
            }

        });
        resultName.innerText = `${result.symbol} | ${result.name}`;

        resultLI.classList += 'result';
        resultA.appendChild(resultIMG);
        resultA.appendChild(resultName);
        resultA.appendChild(resultPercent);
        resultLI.appendChild(resultA);
        resultsList.appendChild(resultLI);
    }
    resultsList.style.overflowY = 'scroll';
}

function clearResults() {
    resultsList.innerHTML = ''
    resultsList.style.overflowY = 'hidden';
}

const debounce = (func, delay) => {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            func.apply(context, args)
        }, delay)
    }
}

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearResults();
    let results = await getResults(symbolInput.value);
    resultsToList(results);
})

symbolInput.addEventListener('keyup', debounce(() => {
    clearResults();
    let results = getResults(symbolInput.value)
    .then(results => {
        resultsToList(results); 
    })  
}, 800)
)

