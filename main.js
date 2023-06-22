const formNode = document.getElementById('send-form');
const buttonSign = document.getElementById('button-sign-id');
const buttonSubmit = document.getElementById('button-submit-id');

const checkoutKey = '25StYA08fvd8Tch3ltr6RupqdMugiKzU';
const ingroneField = 'ik_sign';

buttonSubmit.addEventListener('click', (event) => {
  event.preventDefault();
  sendRequest();
});

buttonSign.addEventListener('click', (event) => {
  event.preventDefault();
  makeSingKey();
});

async function sendRequest() {
  formNode.requestSubmit();
}

async function makeSingKey() {
  let paymentData = [];
  let sortedData = [];
  let signString = '';
  let signKey = '';

  getFormData(formNode.elements).forEach((data) => paymentData.push(data));

  sortedData = sortData(paymentData);

  signString = getSignString(sortedData);

  signKey = await getSignHash(signString);

  inputSign = document.getElementById('ik_sign-input');
  inputSign.setAttribute('value', signKey);
}

function getFormData(elements) {
  let resultData = [];

  for (let input of Array.from(elements)) {
    if (
      input.name &&
      input.value &&
      input.name !== ingroneField &&
      input.name.substring(0, 3) === 'ik_'
    ) {
      resultData.push({ [input.name]: input.value });
    }
  }

  return resultData;
}

function sortData(datas) {
  return datas.sort((data1, data2) => (Object.keys(data1)[0] > Object.keys(data2)[0] ? 1 : -1));
}

function getSignString(datas) {
  let resultSign = '';

  for (let data of datas) {
    resultSign += Object.values(data)[0] + ':';
  }
  resultSign += checkoutKey;

  return resultSign;
}

async function getSignHash(signString) {
  let resultHash = null;

  // Хеширование строки
  const encoder = new TextEncoder();
  const data = encoder.encode(signString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Кодирование хеша в Base64
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  resultHash = btoa(String.fromCharCode(...hashArray));

  return resultHash;
}
