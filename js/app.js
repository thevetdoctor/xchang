function sw(){
  if(navigator.serviceWorker){
    console.log('Browser supports service worker');

    navigator.serviceWorker.register('./sw.js', {scope: '/'}).then((response) => {
      console.log('Success: serviceWorker registered')
      console.log('Scope:', response.scope, 'State:', response.active.state)
    })
    .catch((err) => {
      console.log('Error: serviceWorker not registered', err);
    });
  }
}
sw();

/////////////////////////////////////////////////////////////////////////////////////////


const Database = idb.open('ExchangeRates', 1, (upgradeDb) => {

   const RateStore = upgradeDb.createObjectStore('rates', { keyPath: 'rate'});

  RateStore.createIndex('matchIndex', 'match');
});

///////////////////////////////////////////////////////////////////////////////////////////



// fetch('superheroes.json', {mode: 'same-origin'})
//       .then((res) => {
//         res.json()
//         .then((result) => {
//           console.log(result);
//         })
//       })

///////////////////////////////////////////////////////////////////////////////////////////

// let names = ['iliakan', 'remy', 'jeresig'];

// let requests = names.map(name => fetch(`https://api.github.com/users/${name}`));

// Promise.all(requests)
//   .then(responses => {
//     // all responses are ready, we can show HTTP status codes
//     for(let response of responses) {
//       alert(`${response.url}: ${response.status}`); // shows 200 for every url
//     }

//     return responses;
//   })
//   // map array of responses into array of response.json() to read their content
//   .then(responses => Promise.all(responses.map(r => r.json())))
//   // all JSON answers are parsed: "users" is the array of them
//   .then(users => users.forEach(user => alert(user.name)));

/////////////////////////////////////////////////////////////////////////////////////////////




// fetch('https://jsonplaceholder.typicode.com/users'/*, {mode: 'no-cors', type: 'basic'}*/).then(function(response) {
//     console.log(response.headers.get('Content-Type'));
//     console.log(response.headers.get('Date'));
//     console.log(response.status);
//     console.log(response.statusText);
//     console.log(response.type);
//     console.log(response.url);
//     return response.json().then((res) => {
//             console.log(res);;
//           })
//       });


//////////////////////////////////////////////////////////////////////////////////////////////

// var promise1 = Promise.resolve(3);
// var promise2 = 42;
// var promise3 = new Promise(function(resolve, reject) {
//   setTimeout(resolve, 100, 'foo');
// });

// Promise.all([promise1, promise2, promise3]).then(function(values) {
//   console.log(values);
// });
// expected output: Array [3, 42, "foo"]

//////////////////////////////////////////////////////////////////////////////////////////////

let rates = {"results":
{
"USD":{"currencyName":"United States Dollar","currencySymbol":"$","id":"USD"},
"GBP":{"currencyName":"British Pound","currencySymbol":"£","id":"GBP"},
"EUR":{"currencyName":"Euro","currencySymbol":"€","id":"EUR"},
"NGN":{"currencyName":"Nigerian Naira","currencySymbol":"₦","id":"NGN"},
"CAD":{"currencyName":"Canadian Dollar","currencySymbol":"$","id":"CAD"},
"BTC":{"currencyName":"Bitcoin","currencySymbol":"BTC","id":"BTC"},
"GHS":{"currencyName":"Ghanaian Cedi","currencySymbol":"Cedi","id":"GHS"},
"AED":{"currencyName":"UAE Dirham","currencySymbol":"Dirham","id":"AED"},
"CNY":{"currencyName":"Chinese Yuan","currencySymbol":"¥","id":"CNY"},
"ZAR":{"currencyName":"South African Rand","currencySymbol":"R","id":"ZAR"},
  }
};

rates = rates.results;

let currFrom = document.getElementById('handle1');
let currTo = document.getElementById('handle2');
let ratesArray = [];
let currOptions = '';

for(let rate in rates){
if(rates[rate]['currencySymbol'] === undefined){
  rates[rate]['currencySymbol'] = 'NA';
}

  ratesArray.push(rate);

// setting the options of the select element on the DOM

currOptions += `<option id="${ rates[rate]['id'] }" value="${ rates[rate]['id'] }"> ${ rates[rate]['currencyName'] }  ( ${ rates[rate]['currencySymbol'] } )</option>`;

  }

currFrom.innerHTML = currOptions;
currTo.innerHTML = currOptions;

console.log(ratesArray);

const convertBtn = document.getElementById('convertBtn');
const amount = document.getElementById('amount');
const convertedValue = document.getElementById('convertedValue');

//////////////////////////////////////////////////////////////////////////////////////////////


let exchangeArray = [], exchangeRate, data, factor, factorArray = [];

  for(let x of ratesArray) {

    for(let y of ratesArray) {

  if(x === y){
    continue;
  }

let factor = x + '_' + y;

factorArray.push(factor);

  }
}


//////////////////////////////////////////////////////////////////////////////////////////////


// initiate the FETCH to the API



let requests = factorArray.map(factor => fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${factor}&compact=ultra`, {mode : 'no-cors'}));

Promise.all(requests)
        .then(responses => {
          //all responses are ready
          for(let res of responses){
           if(res.status !== 200){
            console.log('Status code: ' + res.status)
          }
            return responses;
        }
      })
        .then(responses => Promise.all(responses.map(res => res.json())))

        .then(data => data.forEach( data => {

              exchangeArray.push(data)

              Database.then((db) => {
              let createRecord = db.transaction('rates', 'readwrite');
              let newRecord = createRecord.objectStore('rates');

              for(let x in data){
                console.log(`match: ${x}, code: ${data[x]}`);

                   newRecord.put({match: `${x}`,
                                   rate: `${data[x]}`
                                 });
                     }

               createRecord.complete;
             }).then(() => {
               console.log('Record created');
            });

         }));


 // let urls = `https://free.currencyconverterapi.com/api/v5/convert?q=[CODE]&compact=ultra`;
// fetch(url)
//   .then((res) => {
//     if(res.status !== 200){
//       console.log('Status code: ' + res.status)
//       return;
//     }
//     res.json().then((data) => {
//       console.log(data);
//       exchangeArray.push(data);
//     })
//  })
//   .catch((err) => {
//     console.log('Error : Conversion not successful', err);
//     });


// if(factorArray.length === exchangeArray.length) {

// Database.then((db) => {
//   let createRecord = db.transaction('rates', 'readwrite');
//   let newRecord = createRecord.objectStore('rates');

// for(let data in exchangeArray){

//       newRecord.put(data);
// }

//   createRecord.complete;
// }).then(() => {
//   console.log('Record created');
// });

// }


console.log(factorArray);
console.log(factorArray.length);
console.log(exchangeArray);


let equiv, equiv_value_array = [], amountValue = 0, idFrom, idTo, currentRate;

// declare the function to convert on clicking submit button
let count = 0;
factorArray = factorArray.sort();

const convert = (e) => {
e.preventDefault();

  idFrom = currFrom.value;
  idTo = currTo.value;

  equiv = idFrom + '_' + idTo;

  // if(exchangeArray.length === 90){

        Database.then((db) => {
          let readRecord = db.transaction('rates').objectStore('rates').index('matchIndex');

          return readRecord.getAll();
        }).then((result) => {
          console.log(result);

          if(equiv_value_array.length < 90){
            for(let res of result){
            equiv_value_array.push(res);
             }
             return;
            }
         });

  count = 0;


/////////////////////////////////////////////////////////////////////////////

          if(equiv_value_array.length !== 0){

  // for(let factor of factorArray){

    for(let equiv_value of equiv_value_array){
    count++;
        if(equiv == equiv_value['match']){
          console.log(equiv_value);
          currentRate = equiv_value['rate'];
        }
         else {

          continue;
         }
  }
// }
amountValue = 0;

amountValue = Number(amount.value);
console.log(currentRate);
amountValue *= currentRate;

convertedValue.innerHTML = '';

convertedValue.innerHTML = `<h3> ${currFrom.value} ${amount.value}  is equivalent to ${currTo.value} ${convertedValue.innerText} ${amountValue}</h3>`;

}  else {

convertedValue.innerHTML = '';

convertedValue.innerHTML = `<h3> ... Loading rates, please refresh the page and try again</h3>`;
     }

  }


convertBtn.addEventListener('click', convert);
