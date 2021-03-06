// const rates = require('./currencies');

function sw(){
  if(navigator.serviceWorker){
    console.log('Browser supports service worker');

    navigator.serviceWorker.register('./sw.js', { scope: './'}).then((response) => {
      console.log(`Scope: ${response.scope}, State: ${response.active.state}`)
      console.log(`Success: serviceWorker registered`, response);
    })
    .catch((err) => {
      console.log('Error: serviceWorker not registered', err);
    });
  }
}
sw();

/////////////////////////////////////////////////////////////////////////////////////////


const Database = idb.open('ExchangeRates', 1, (upgradeDb) => {

   const RateStore = upgradeDb.createObjectStore('rates');

   // RateStore.put('New Value', 'rate');

  // RateStore.createIndex('matchIndex', 'match');
});

///////////////////////////////////////////////////////////////////////////////////////////

// const rates = {"results":
// {
// "USD":{"currencyName":"United States Dollar","currencySymbol":"$","id":"USD"},
// "GBP":{"currencyName":"British Pound","currencySymbol":"£","id":"GBP"},
// "EUR":{"currencyName":"Euro","currencySymbol":"€","id":"EUR"},
// "NGN":{"currencyName":"Nigerian Naira","currencySymbol":"₦","id":"NGN"},
// "CAD":{"currencyName":"Canadian Dollar","currencySymbol":"$","id":"CAD"},
// "BTC":{"currencyName":"Bitcoin","currencySymbol":"BTC","id":"BTC"},
// "GHS":{"currencyName":"Ghanaian Cedi","currencySymbol":"Cedi","id":"GHS"},
// "AED":{"currencyName":"UAE Dirham","currencySymbol":"Dirham","id":"AED"},
// "CNY":{"currencyName":"Chinese Yuan","currencySymbol":"¥","id":"CNY"},
// "ZAR":{"currencyName":"South African Rand","currencySymbol":"R","id":"ZAR"}
//   }
// };

const rates = rate.results;

let currFrom = document.getElementById('handle1');
let currTo = document.getElementById('handle2');
let ratesArray = [];
// let ratesSortedArray = [];
// let currOptions = '';
let currOptions = `<option id="empty" value="empty"> Please select currency </option>`;

for(let rate in rates){
if(rates[rate]['currencySymbol'] === undefined){
  rates[rate]['currencySymbol'] = rates[rate]['id'];
    // rates[rate]['currencySymbol']? undefined : 'rates[rate]['id']';
}

  ratesArray.push(rate);

  // ratesSortedArray.push()

// setting the options of the select element on the DOM

currOptions += `<option id="${ rates[rate]['id'] }" value="${ rates[rate]['id'] }"> ${ rates[rate]['currencyName'] }  ( ${ rates[rate]['currencySymbol'] } )</option>`;

  }

currFrom.innerHTML = currOptions;
currTo.innerHTML = currOptions;

console.log(ratesArray);

const convertBtn = document.getElementById('convertBtn');
const amount = document.getElementById('amount');
const convertedValue = document.getElementById('convertedValue');


convertedValue.style.display = 'none';
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

console.log(factorArray.length);
console.log(exchangeArray);


let equiv = '', equiv_value_array = [], amountValue = 0, idFrom, idTo, currentRate;

// declare the function to convert on clicking submit button
let count = 0;
factorArray = factorArray.sort();

///////////////////////////////////////////////////////////////////////////////////////////

  const convert = (e) => {
                  e.preventDefault();

                  convertedValue.style.display = 'block';

                    convertedValue.innerHTML = '';
                  if(amount.value == ''){
                    convertedValue.innerHTML = `<h4> Please fill in the value to convert!</h4>`;
                    return;
                  }

                   if(isNaN(amount.value)){
                    convertedValue.innerHTML = `<h4> Please enter numbers only!</h4>`;
                    return;
                  }

                  if(currFrom.value == 'empty' || currTo.value == 'empty'){
                    convertedValue.innerHTML = `<h4> Please choose from/to currencies</h4>`;
                    return;
                  }

                  idFrom = currFrom.value;
                  idTo = currTo.value;
                  equiv = idFrom + '_' + idTo;


      /////////////////////////////////////////////////////////////
// try {
                    convertBtn.disabled = true;

                     Database.then((db) => {
                          let readRecord = db.transaction('rates').objectStore('rates');
                          return readRecord.get(equiv);
                        }).then((result) => {
                          console.log(result);
                          currentRate = result;

                          if(currentRate === undefined){
                          convertedValue.innerHTML = '';
                          convertedValue.innerHTML = `<h4> Getting currency rates, please wait... </h4>`;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${equiv}&compact=ultra`)
            .then((result) => {
                    console.log(result)
                     return result.json()
            })
            .then((data) => {
                      console.log(data)
                             currentRate = data[equiv];
                          if(!exchangeArray.includes(data) ){
                            exchangeArray.push(data)
                          }
                            console.log(exchangeArray)

                        Database.then((db) => {
                        let createRecord = db.transaction('rates', 'readwrite');
                        let newRecord = createRecord.objectStore('rates');

                        newRecord.put(`${data[equiv]}`, `${equiv}`);
                          return createRecord.complete;
                        }).then(() => {
                               console.log(`Record created : ${equiv} => ${data[equiv]}`);
                           });

                      if(currentRate === undefined){
                    } else {
                     amountValue = 0;
                    amountValue = Number(amount.value);
                    console.log(currentRate);
                    amountValue *= currentRate;
                    amountValue.toFixed(2);
                    convertedValue.innerHTML = '';
                    convertedValue.innerHTML = `<h4><p>${currFrom.value} 1 => ${currTo.value} ${currentRate}</p> ${currFrom.value} ${amount.value}  is equivalent to ${currTo.value} ${convertedValue.innerText} ${amountValue.toFixed(2)}</h4>`;
                          convertBtn.disabled = false;
                }
            })
            .catch((err) => {
              console.log('Error:' , err);

              convertedValue.innerHTML = 'Some error occured, please refresh';
              convertBtn.disabled = false;
                          // convertBtn.disabled = false;
            })

///////////////////////////////////////////////////////////////////////////////////////////////////////////
                          return;
                          }

                      amountValue = Number(amount.value);
                      amountValue *= currentRate;
                      amountValue.toFixed(2);
                      convertedValue.innerHTML = '';
                      convertedValue.innerHTML = `<h4> <p>${currFrom.value} 1 => ${currTo.value} ${currentRate}</p> ${currFrom.value} ${amount.value}  is equivalent to ${currTo.value} ${convertedValue.innerText} ${amountValue.toFixed(2)}</h4>`;
                          convertBtn.disabled = false;
                        });

        }

convertBtn.addEventListener('click', convert);

//////////////////////////////////////////////////////////////////////////////////////////////
