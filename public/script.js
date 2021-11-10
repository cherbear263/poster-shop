let watcher;

Vue.createApp({
    data() {
        return {
            total: 0,
            cart: [],
            search: 'cat', // default searcch term is cat
            lastSearch: '',
            loading: false,
            results: [],
            listLength: 0,
        };
    },
    computed: {
        products() {
           return this.results.slice(0, this.listLength);
        }
    },
    methods: {
        addToCart(product) {
            this.total += product.price
            const item = this.cart.find(item => item.id === product.id);
            if (item){
                item.qty++;
            }else {
                this.cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    qty: 1
                });
            }

        },
        currency(price) {
                return "$".concat(price.toFixed(2));
        },
        inc(item){
            item.qty ++;
            this.total += item.price
        },
        dec(item){
            item.qty --;
            this.total -= item.price;
            if (item.qty <= 0 ){
                const i = this.cart.indexOf(item);
                this.cart.splice(i, 1); // remove one item at position i in the array     
            }
            
            
        },
        onSubmit(){
            this.results=[]
            this.listLength = 0;
            this.loading = true;
            fetch(`/search?q=${this.search}`)
            .then(response => response.json())
            .then(body => {
                this.lastSearch = this.search;
                this.results = body;
                this.appendResults;
                this.loading = false;
            })
        },
        appendResults(){
            if (this.products.length < this.results.length) {
                this.listLength += 4
            }
        }
    },

    created() {
        //This is a lifecycle hook to simulate pressing the submit button on page load
        this.onSubmit();
    },
    beforeUpdated(){
        //before updating dom (this is a vue lifecycle hook) we should destroy the watcher 
        //sensor for scroll-load
        if(watcher){
            watcher.destroy();
            watcher = null;
        }
        
    },
    updated(){
        //after updating dom, recreate the watcher sensor for scroll-load
        const sensor = document.querySelector("#product-list-bottom")
        watcher = scrollMonitor.create(sensor)
        watcher.enterViewport(this.appendResults)
    }


}).mount("#app");
// watcher will watch the sensor div, and whenever it enters or leaves the viewport it will tell us
