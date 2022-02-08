class Shop {
    constructor(el, items = []) {
        this.el = el
        this.items = items
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

    addToCart(item) {
        console.log(item)
    }
}

class Item {
    constructor(name, price, sizes, image) {
        this.name = name
        this.price = price
        this.sizes = sizes
        this.image = image
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

        Purchase.addEventListener('click', () => {
            this.Shop.addToCart(this)
        })

        let sizes = document.createElement('select')
        for (let size of this.sizes){
            let option = document.createElement('option')
            option.setAttribute('value',size)
            option.innerText = size
            sizes.appendChild(option)
        }

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

document.addEventListener('DOMContentLoaded', (event) => {
    const shop = new Shop( document.getElementById('shop') )

    shop.addItem( new Item('Perry High Athletic T-Shirt','$15.00',['XS','S','M','L','XL'],'img/pts.png') )
    shop.addItem( new Item('Perry High Athletic T-Shirt','$15.00',['XS','S','M','L','XL'],'img/pts.png') )
    shop.addItem( new Item('Perry High Athletic T-Shirt','$15.00',['XS','S','M','L','XL'],'img/pts.png') )
    shop.addItem( new Item('Perry High Athletic T-Shirt','$15.00',['XS','S','M','L','XL'],'img/pts.png') )
    shop.addItem( new Item('Perry High Athletic T-Shirt','$15.00',['XS','S','M','L','XL'],'img/pts.png') )
    shop.addItem( new Item('Perry High Athletic T-Shirt','$15.00',['XS','S','M','L','XL'],'img/pts.png') )
    shop.addItem( new Item('Perry High Athletic T-Shirt','$15.00',['XS','S','M','L','XL'],'img/pts.png') )

    shop.render()

    console.log(shop)    
})