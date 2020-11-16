class SearchForm {

    constructor(container) {
        this.container = container;
        this.createHtmlForm();

        this.formElem.addEventListener('submit', (e) => {
            e.preventDefault();
            this.search(this.input.value);
        })
    }

    searchDebounce = (func, delay) => {
        let debounceTimer;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                func.apply(context, args)
            }, delay)
        }
    }

    createHtmlForm() {
        const form = document.createElement('FORM');
        form.classList.add('search-form');
        this.formElem = form;

        // create label for form input
        const label = document.createElement('LABEL');
        label.for = 'stock-symbol';
        label.innerText = 'Stock Symbol or compnay name';

        //create input element
        const input = document.createElement('INPUT');
        input.placeholder = 'Stock symbol or company name';
        input.id = 'stockSymbol';
        input.name = 'stock-symbol';
        input.autocomplete = 'off';
        this.input = input;

        //create submit button
        const submitBtn = document.createElement('BUTTON');
        submitBtn.type = 'submit';
        submitBtn.id = 'searchBtn';
        submitBtn.innerText = 'Search';
        this.submitBtn = submitBtn;

        // create spinner
        const spinner = document.createElement('DIV');
        spinner.classList.add('lds-dual-ring', 'invisible');
        this.spinner = spinner;

        //place all in page flow
        form.append(label, input, submitBtn, spinner);
        this.container.append(form);
    }

    async search(searchTerm) {
        this.spinner.classList.remove('invisible');
        this.submitBtn.classList.add('invisible');
        let data;
        if (!searchTerm) data = [];
        else {
            let res = await fetch(finServer + `/api/v3/search?query=${searchTerm}&limit=10&exchange=NASDAQ`);
            data = await res.json();
        }
        this.spinner.classList.add('invisible');
        this.submitBtn.classList.remove('invisible');
        return {
            data: data,
            searchTerm: searchTerm
        };
    }

    async onSearch(callback) {
        this.input.addEventListener('keyup', this.searchDebounce(async () => {
            let data = await this.search(this.input.value);
            callback(data);
        }, 800))
    }
}