/*
    if it is all databases,

*/

/*
    receive keyword
    create enum for keywords = 'all', 'system', 'my recipes', 'comunity recipes'

    if it is all make parallel request to 'edamam', 'my recipes'
    if it is system make request to 'edamam'
    if it is my recipes make request to 'my recipes'


    transform parse result to ingredient format
    if doens't result in edamam, void process hints


    if doesnt' exist parse, process hints



*/
const axios = require('axios').default;

const url =
  'https://api.edamam.com/api/food-database/v2/parser?app_id=3433cae5&app_key=49a88aac6d3f84d1f2d1e3790dc98d40&nutrition-type=looging';
const edemam = () => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
        // console.log(data.hints)
      })
      .catch((err) => {
        reject(err);
      });
  });
  // 723 - 1532
};

const withAxios = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(function (response) {
        // handle success
        //   console.log(response);
        resolve(response);
      })
      .catch(function (error) {
        // handle error
        //   console.log(error);
        reject(error);
      });

    //1256 - 2097
  });
};

const getFood = async () => {
  const start = new Date();
  //   await edemam();
  await withAxios();
  const end = new Date();
  console.log(end - start);
};
getFood();

const arr = ['uno', 'dos', 'tres'];
const res = arr.join(' ');
console.log('---res', res);
