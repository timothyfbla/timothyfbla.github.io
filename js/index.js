


function findByMatchingProperties(set, properties) {
    return set.filter(function (entry) {
        return Object.keys(properties).every(function (key) {
            return entry[key] === properties[key];
        })
    })
}

class Shop {
    constructor(items = []) {
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

        // console.log(item.getCartItem())

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

class ShopDisplay extends Shop {
    constructor(el) {
        super()
        this.el = el
    }

    render() {
        for (let item of this.items) {
            item.append(this.el)
        }
    }
}

class CartDisplay extends Shop {
    constructor(el) {
        super()
        this.el = el
    }

    updateCart() {
        // if (localforage.getItem('perryCart')) localforage.setItem('perryCart', this.cart)
        localforage.getItem('perryCart').then(cart => {
            if (cart) localforage.setItem('perryCart', this.cart).then(cart => {
                // console.log(cart)
                this.render()
                document.getElementById('shcanot').innerText = cart.length
            })
        })
    }
    
    render() {
        // for (let item of this.items) {
        //     item.append(this.el)
        // }       
        localforage.getItem('perryCart').then(cart => {
            this.el.innerHTML = ''

            let c = cart || []

            for (let item of c) {
                let citem = new CartItem(item.name, item.price, item.size, item.image)
                this.addItem(citem)
                citem.append(this.el)

                // console.log(citem)
            }

            if (c.length===0) {
                let nothing = document.createElement('p')
                nothing.innerText = 'No items in cart'
                this.el.appendChild(nothing)
            } else {
                let checkout = document.createElement('button')
                checkout.setAttribute('id', 'checkout')
                checkout.innerText = 'Check Out'
                checkout.addEventListener('click',() => {
                    window.location.replace("checkout.html");
                })

                this.el.appendChild(checkout)
            }
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

    getCartItem() {
        return { name: this.name, price: this.price, size: this.selectedSize, image: this.image, quantity: this.quantity }
    }
}

class ShopItem extends Item {
    constructor(name, price, sizes, image) {
        super(name, price, sizes, image)
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

class CartItem extends Item {
    constructor(name, price, size, image) {
        super(name, price, size, image)
        this.size = size
    }
    
    // update() {
    //     // this.inCart = this.Shop.cart.indexOf(this.cartItem) > -1
    //     let find = findByMatchingProperties(this.Shop.cart, this.getCartItem())
    //     this.inCart = find.length>0

    //     // console.log(find, this.Shop.cart, this.inCart)

    //     if (this.inCart) {
    //         this.elements.Purchase.innerText = 'Remove from Cart'
    //     } else {
    //         this.elements.Purchase.innerText = 'Add to Cart'            
    //     }
    // }

    getCartItem() {
        return { name: this.name, price: this.price, size: this.size, image: this.image, quantity: this.quantity }
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
        ItemName.innerText = `${this.name} [${this.sizes}]`

        let ItemPrice = document.createElement('p')
        ItemPrice.innerText = this.price

        let Purchase = document.createElement('button')
        Purchase.innerText = 'Remove from Cart'

        this.elements.Purchase = Purchase

        Purchase.addEventListener('click', () => {
            this.Shop.removeFromCart(this)
        })

        Photo.appendChild(Image)
        Item.appendChild(Photo)

        Description.appendChild(ItemName)
        Description.appendChild(ItemPrice)
        Description.appendChild(Purchase)
        
        Item.appendChild(Description)

        el.appendChild(Item)     
    }
}