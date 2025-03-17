//Họ và tên: Phan Hoàng Minh Thuận
//MSSV: 2180608436




let Product = function(id, name, price, cost, tax, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.cost = cost;
    this.tax = tax;
    this.quantity = quantity;
};

let Products = [
    new Product(1, "Laptop", 20000, 15000, 0.1, 5),
    new Product(2, "Smartphone", 12000, 9000, 0.08, 10),
    new Product(3, "Tablet", 8000, 6000, 0.07, 7),
    new Product(4, "Headphones", 3000, 2000, 0.05, 15)
];
console.log(Products);



let totalRevenues = Products.map(
    product => product.price * (1 + product.tax) * product.quantity
);
console.log(totalRevenues);



let totalProfit = Products.reduce((sum, product) => 
    sum + ((product.price * (1 + product.tax) - product.cost) * product.quantity), 0
);
console.log(totalProfit);



let lossProducts = Products.filter(
    product => product.price < product.cost
);
console.log(lossProducts);



let allInStock = Products.every(
    product => product.quantity > 0
);
console.log(
    allInStock ? "Tất cả sản phẩm đều còn hàng" : "Có sản phẩm đã hết hàng"
);



let hasHighProfitProduct = Products.some(
    product => product.price >= 1.5 * product.cost
);
console.log(hasHighProfitProduct ? "Có sản phẩm bán lãi nhiều" : "Không có sản phẩm nào bán lãi nhiều");

let promise = new Promise(function(resolve, reject) {
    let rd=Math.floor((Math.random()*10));
    setTimeout(function() {
        if(rd%2==0){
            resolve(null);
        }else if(rd%2==1){
    },1000)
})
promise
.then(
    function(){
        console.log("then");
    }
)
.catch(
    function(){
        console.log("After");
    }
)





Products.sort((a, b) => {
    if (a.price !== b.price) {
        return a.price - b.price; // Sắp xếp theo price tăng dần
    } else if (a.name !== b.name) {
        return a.name.localeCompare(b.name); // Sắp xếp theo name theo thứ tự bảng chữ cái
    } else {
        return a.id - b.id; // Sắp xếp theo id tăng dần
    }
});
console.log(Products);
