
let fn = () => {
  return new Promise((resolve) => {
    setTimeout(_ => {
      resolve({a: 1, b: 'b'})
    }, 1000)
  })
}

let fn2 = () => {
  return new Promise((resolve) => {
    setTimeout(_ => {
      resolve({a: 1, b: 'cc'})
    }, 1000)
  })
}

Promise.all([fn(), fn2()]).then(rs => {
  console.log('rs', rs)
})
console.log(3)