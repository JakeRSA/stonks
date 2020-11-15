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

    listResults(results) {
        this.resultsList.innerHTML = '';

        if (!results) {
            console.log('no data');
            return 1;

        }
        for (let result of results) {
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
            resultName.innerText = `${result.symbol} | ${result.name}`;

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