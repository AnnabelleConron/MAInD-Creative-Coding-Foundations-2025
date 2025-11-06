let number = 0;

// for (initialization; condition; afterthought) {statement}
// for(let number = 0; number < 10; number ++) {
//     console.log(number);
// }

const cats = ["Leopard", "Jaguar", "Tiger", "Lion"];

for(let id = 0; id < cats.length; id ++) {
    console.log(cats[id]);
}

document.addEventListener('keydown', (keyEvent) => {
    console.log(keyEvent.key);
    if(keyEvent.key == ' '){
        console.log("SPACE");
    }
    else if(keyEvent.key == '1'){
        console.log("ONE")
    }
})