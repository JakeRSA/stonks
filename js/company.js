const finServer = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com';
const urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get('symbol');
const nameElem = document.getElementById('companyName');
const symbolElem = document.getElementById('companySymbol');
const websiteElem = document.getElementById('companySite');
const imgElem = document.getElementById('companyImg');
const priceElem = document.getElementById('companyPrice');
const changeElem = document.getElementById('companyChangePercent');
const descElem = document.getElementById('companyDesc');
const ctx = document.getElementById('chart');
const mainSpinner = document.getElementById('mainSpinner');
const loadingWrapper = document.getElementById('loadingWrapper');
const cardElems = document.querySelectorAll('#mainWrapper *');

async function companyProfile(symbol) {
    for (elem of cardElems) {
        elem.style.visibility = 'hidden';
    }
    mainSpinner.style.visibility = 'visible';
    mainSpinner.style.display = 'inline';
    let res = await fetch(`${finServer}/api/v3/company/profile/${symbol}`);
    let data = await res.json();
    mainSpinner.style.display = 'none';
    loadingWrapper.remove();
    for (elem of cardElems) {
        elem.style.visibility = 'visible';
    }
    let profile = data.profile;
    nameElem.innerText = profile.companyName;
    symbolElem.innerText = symbol;
    websiteElem.innerText = profile.website;
    websiteElem.href = profile.website;
    imgElem.src = profile.image;
    priceElem.innerText = '$' + profile.price.toFixed(2);
    changeElem.innerText = profile.changesPercentage.slice(1, profile.changesPercentage.length - 1);
    if (profile.changesPercentage[1] === '+') {
        changeElem.style.color = 'rgb(89, 255, 117)';
    } else {
        changeElem.style.color = 'rgb(255, 75, 105)';
    }
    descElem.innerText = profile.description

}

async function companyHistory(symbol) {
    let res = await fetch(`${finServer}/api/v3/historical-price-full/${symbol}?serietype=line`);
    let data = await res.json();
    let timeSeries = data.historical;
    let xVals = [];
    let yVals = [];
    let startPoint = timeSeries.length - 1;
    if (startPoint > 365) {
        startPoint = 365;
    }
    for (let i = startPoint; i >= 0; i--) {
        let xVal = timeSeries[i].date;
        let yVal = timeSeries[i].close;
        yVals.push(yVal);
        xVals.push(xVal);
    }
    return [xVals, yVals];
}

companyProfile(symbol);
companyHistory(symbol).then((data) => {
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data[0],
            datasets: [{
                data: data[1],
                lineTension: 0,
                pointRadius: 0,
                borderCapStyle: 'round',
                backgroundColor: 'rgba(0, 217, 192, 1)',
                borderColor: 'rgba(0, 217, 192, 1)',
                hoverBackgroundColor: 'rgba(255, 217, 192, 1)',
                label: 'Price'

            }]
        },
        options: {
            legend: {
                display: false
            },
            tooltips: {
                mode: 'nearest',
                intersect: false
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        autoSkipPadding: 20
                    }
                }]
            }
        }
    });
});