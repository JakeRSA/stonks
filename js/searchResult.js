class SearchResult {
    constructor(container) {
        this.container = container;
        this.createResultDropdown();
    }

    createResultDropdown() {

        this.dropdown = document.createElement('DIV');
        this.dropdown.classList.add('results-dropdown');
        this.resultsList = document.createElement('UL');
        this.resultsList.id = 'resultsList'
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

    compareListener(button, companyData) {
        button.addEventListener('click', () => {
            console.log(companyData)
        })
    }

    listResults(results) {
        this.resultsList.innerHTML = '';
        this.resultsList.classList.remove('enable-scroll');
        if (results.data.length < 1) return 1;

        for (let result of results.data) {
            let resultLI = document.createElement('LI');
            let resultDIV = document.createElement('DIV');
            let resultIMG = document.createElement('IMG');
            let resultName = document.createElement('A');
            let resultPercent = document.createElement('A');
            let resultCompare = document.createElement('BUTTON');

            resultDIV.classList.add('result-body');
            resultName.href = `./company.html?symbol=${result.symbol}`;
            resultPercent.href = `./company.html?symbol=${result.symbol}`;
            this.getResultData(result.symbol).then(resultData => {
                resultIMG.src = resultData.img;
                resultPercent.innerText = resultData.percent;
                if (resultData.percent[1] === '+') {
                    resultPercent.classList.add('result-increase');
                } else {
                    resultPercent.classList.add('result-decrease');
                }
            });
            try {
                let highlightSymbol = this.highlightSearchTerm(result.symbol, results.searchTerm);
                let highlightName = this.highlightSearchTerm(result.name, results.searchTerm);
                resultName.innerHTML = `${highlightSymbol} | ${highlightName}`;
                resultCompare.innerText = 'compare';
                resultCompare.classList.add('compare-btn');
                this.compareListener(resultCompare, result);
                resultLI.classList.add('result');
                resultDIV.appendChild(resultIMG);
                resultDIV.appendChild(resultName);
                resultDIV.appendChild(resultPercent);
                resultLI.appendChild(resultDIV);
                resultLI.appendChild(resultCompare);
                this.resultsList.appendChild(resultLI);
            } catch (e) {
                console.log(`Cannot load result: ${e}`)
            };
        }
        if (results.data.length > 4) this.resultsList.classList.add('enable-scroll');
    }
}