const Items = []

function addItem(name,price,sizes,image) {
    let Item = {name:name,price:price,sizes:sizes,image:image,}
    Items.push(Item)
}

addItem('Poop','69dollares',['XS','S','M','L','XL'],'img/phh.png')

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('all stuff done :ok_hand:')
    const Shop = document.getElementById('shop')
    // appendItemelement(Shop,Items[0])
    for (let item of Items){
        appendItemelement(Shop,item)
    }
});

function appendItemelement(l,item) {
    let Item = document.createElement('div')
    Item.classList.add('item')
    let Photo = document.createElement('div')
    Photo.classList.add('photo')
    let Image = document.createElement('img')
    Image.setAttribute('src',item.image)
    let Description = document.createElement('div')
    Description.classList.add('description')
    let ItemName = document.createElement('p')
    ItemName.innerText = item.name
    let ItemPrice = document.createElement('p')
    ItemPrice.innerText = item.price
    let Purchase = document.createElement('button')
    Purchase.innerText = 'Add to Cart'
    Photo.appendChild(Image)
    Item.appendChild(Photo)
    Description.appendChild(ItemName)
    Description.appendChild(ItemPrice)
    Description.appendChild(Purchase)
    Item.appendChild(Description)
    l.appendChild(Item)
}
