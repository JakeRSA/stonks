class SearchResult {
    constructor(container) {
        this.container = container;
        this.createResultDropdown();
    }

    createResultDropdown() {

        this.dropdown = document.createElement('DIV');
        this.dropdown.classList += 'results-dropdown';
        this.resultsList = document.createElement('UL');
        this.resultsList.id = 'results-list'
        this.dropdown.append(this.resultsList);
        this.container.append(this.dropdown);
    }

    getResultData(symbol) {
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

    highlightSearchTerm(string, searchTerm) {
        let i = 0;
        let termStart = 0;
        let innerHTML = '';
        while (i < string.length) {
            termStart = string.toLowerCase().indexOf(searchTerm.toLowerCase(), i);
            if (termStart === -1) {
                innerHTML += string.slice(i);
                break;
            } else {
                innerHTML += string.slice(i, termStart);
                i = termStart;
            }
            innerHTML += `<p class='highlighted'>${string.slice(termStart, termStart + searchTerm.length)}</p>`
            i += searchTerm.length;
        }
        return innerHTML;
    }

    listResults(results) {
        this.resultsList.innerHTML = '';

        if (!results.data) return 1;
        for (let result of results.data) {
            let resultLI = document.createElement('LI');
            let resultA = document.createElement('A');
            let resultIMG = document.createElement('IMG');
            let resultName = document.createElement('P');
            let resultPercent = document.createElement('P');

            resultA.href = `./company.html?symbol=${result.symbol}`;
            this.getResultData(result.symbol).then(resultData => {
                resultIMG.src = resultData.img;
                resultPercent.innerText = resultData.percent;
                if (resultData.percent[1] === '+') {
                    resultPercent.classList += 'result-increase';
                } else {
                    resultPercent.classList += 'result-decrease';
                }
            });

            let highlightSymbol = this.highlightSearchTerm(result.symbol, results.searchTerm);
            let highlightName = this.highlightSearchTerm(result.name, results.searchTerm);
            resultName.innerHTML = `${highlightSymbol} | ${highlightName}`;

            resultLI.classList += 'result';
            resultA.appendChild(resultIMG);
            resultA.appendChild(resultName);
            resultA.appendChild(resultPercent);
            resultLI.appendChild(resultA);
            this.resultsList.appendChild(resultLI);
        }
        this.resultsList.style.overflowY = 'scroll';
    }
}