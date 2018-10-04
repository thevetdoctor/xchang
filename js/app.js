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

   const RateStore = upgradeDb.createObjectStore('rates');

   // RateStore.put('New Value', 'rate');

  // RateStore.createIndex('matchIndex', 'match');
});

///////////////////////////////////////////////////////////////////////////////////////////

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
// if(rates[rate]['currencySymbol'] === undefined){
//   rates[rate]['currencySymbol'] = 'NA';
    // rates[rate]['currencySymbol']? undefined : 'NA';
// }

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

console.log(factorArray.length);
console.log(exchangeArray);


let equiv = '', equiv_value_array = [], amountValue = 0, idFrom, idTo, currentRate;

// declare the function to convert on clicking submit button
let count = 0;
factorArray = factorArray.sort();

///////////////////////////////////////////////////////////////////////////////////////////

  const convert = (e) => {
                  e.preventDefault();
                    convertedValue.innerHTML = '';
                  if(amount.value == ''){
                    convertedValue.innerHTML = `<h4> Please fill in the value to convert!</h4>`;
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
                          convertedValue.innerHTML = `<h4> Rates not available at the moment!</h4>`;


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
                    convertedValue.innerHTML = `<h4> ${currFrom.value} ${amount.value}  is equivalent to ${currTo.value} ${convertedValue.innerText} ${amountValue.toFixed(2)}</h4>`;
                          convertBtn.disabled = false;
                }
            })
            .catch((err) => {
              console.log('Error:' , err);

              convertedValue.innerHTML = 'Some Error';
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
                      convertedValue.innerHTML = `<h4> ${currFrom.value} ${amount.value}  is equivalent to ${currTo.value} ${convertedValue.innerText} ${amountValue.toFixed(2)}</h4>`;
                          convertBtn.disabled = false;
                        });

        }

convertBtn.addEventListener('click', convert);

//////////////////////////////////////////////////////////////////////////////////////////////
