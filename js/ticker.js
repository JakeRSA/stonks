const tickerList = document.getElementById('tickerItems');

async function populateTicker() {

    let res = await fetch(`${finServer}/api/v3/stock/list`);
    let data = await res.json();
    let nasdaqPriceys = [];
    for (let stock of data) {
        if (stock.exchange === 'Nasdaq Global Select' &&
            stock.price > 40) {
            nasdaqPriceys.push(stock);
            let tickerItem = document.createElement('LI');

            let itemSymbol = document.createElement('P');
            itemSymbol.innerText = stock.symbol;
            itemSymbol.classList += 'ticker-item-symbol';
            let itemPrice = document.createElement('P');
            itemPrice.innerText = stock.price;
            itemPrice.classList += 'ticker-item-price';
            tickerItem.appendChild(itemSymbol);
            tickerItem.appendChild(itemPrice);
            tickerList.append(tickerItem);
        }
    }

    console.log(nasdaqPriceys.length);
}

window.onload(populateTicker());