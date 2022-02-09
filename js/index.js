


function findByMatchingProperties(set, properties) {
    return set.filter(function (entry) {
        return Object.keys(properties).every(function (key) {
            return entry[key] === properties[key];
        })
    })
}

class Shop {
    constructor(el, items = []) {
        this.el = el
        this.items = items

        this.cart = []

        localforage.getItem('perryCart').then(cart => {
            // if (cart) {
            //     this.cart = cart
            cart ? this.cart = cart : localforage.setItem('perryCart', [])

            this.updateCart()
            this.updateItems()
        })
    }

    addItem(item) {
        item.Shop = this
        this.items.push(item)
    }

    render() {
        for (let item of this.items) {
            item.append(this.el)
        }
    }

    updateItems() {
        for (let item of this.items) {
            item.update()
        }        
    }

    addToCart(item) {
        this.cart.push( item.getCartItem() )
        // console.log(this.cart)

        this.updateCart()
    }
    removeFromCart(item) {
        let find = findByMatchingProperties(this.cart, item.getCartItem())[0]
        this.cart.splice( this.cart.indexOf(find), 1 )
        // console.log(this.cart)

        this.updateCart()
    }

    updateCart() {
        // if (localforage.getItem('perryCart')) localforage.setItem('perryCart', this.cart)
        localforage.getItem('perryCart').then(cart => {
            if (cart) localforage.setItem('perryCart', this.cart).then(cart => {
                // console.log(cart)

                document.getElementById('shcanot').innerText = cart.length
            })
        })
    }
}

class Item {
    constructor(name, price, sizes, image) {
        this.name = name
        this.price = price
        this.sizes = sizes
        this.image = image
        this.quantity = 1

        this.selectedSize = this.sizes[0]
        this.inCart = false

        this.elements = {}

        // this.cartItem = {name: this.name, price: this.price, size: this.selectedSize, quantity: this.quantity}
    }

    update() {
        // this.inCart = this.Shop.cart.indexOf(this.cartItem) > -1
        let find = findByMatchingProperties(this.Shop.cart, this.getCartItem())
        this.inCart = find.length>0

        // console.log(find, this.Shop.cart, this.inCart)

        if (this.inCart) {
            this.elements.Purchase.innerText = 'Remove from Cart'
        } else {
            this.elements.Purchase.innerText = 'Add to Cart'            
        }
    }

    getCartItem() {
        return { name: this.name, price: this.price, size: this.selectedSize, quantity: this.quantity }
    }

    append(el) {     
        let Item = document.createElement('div')
        Item.classList.add('item')

        let Photo = document.createElement('div')
        Photo.classList.add('photo')

        let Image = document.createElement('img')
        Image.setAttribute('src',this.image)

        let Description = document.createElement('div')
        Description.classList.add('description')

        let ItemName = document.createElement('p')
        ItemName.innerText = this.name

        let ItemPrice = document.createElement('p')
        ItemPrice.innerText = this.price

        let Purchase = document.createElement('button')
        Purchase.innerText = 'Add to Cart'

        this.elements.Purchase = Purchase

        Purchase.addEventListener('click', () => {
            if (!this.inCart) {
                this.Shop.addToCart(this)
            } else {
                this.Shop.removeFromCart(this)
            }

            this.update()
        })

        let sizes = document.createElement('select')
        for (let size of this.sizes){
            let option = document.createElement('option')
            option.setAttribute('value',size)
            option.innerText = size
            sizes.appendChild(option)
        }

        sizes.addEventListener('change', e => {
            this.selectedSize = sizes.value
            // this.cartItem.size = this.selectedSize

            // console.log(this.cartItem.size)

            this.update()
        })

        Photo.appendChild(Image)
        Item.appendChild(Photo)

        ItemPrice.appendChild(sizes)
        Description.appendChild(ItemName)
        Description.appendChild(ItemPrice)
        Description.appendChild(Purchase)
        
        Item.appendChild(Description)

        el.appendChild(Item)     
    }
}