const finServer = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/';

class Marquee {

    constructor(container) {
        this.container = container;
    }

    async loadData() {
        let res = await fetch(`${finServer}/api/v3/stock/list`);
        let data = await res.json();
        this.data = data;
    }

    createEmptyTicker() {
        const ticker = document.createElement('DIV');
        ticker.classList += 'ticker';
        const tickerList = document.createElement('UL');
        tickerList.classList += 'ticker-items';
        this.container.append(ticker);
        ticker.append(tickerList);
        return tickerList;
    }

    populateTicker(tickerList) {
        let nasdaqPriceys = [];
        for (let stock of this.data) {
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
    }

    async load() {
        await this.loadData();
        let tickerList = this.createEmptyTicker();
        this.populateTicker(tickerList);
    }
}