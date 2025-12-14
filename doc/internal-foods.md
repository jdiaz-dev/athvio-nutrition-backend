# Steps to insert new fresh data in internal foods
- verify if new food exists in db
- get its micronutrients
- transform this attribute nutrients:
Sugar.alcohol, Sugar.added and CHOCDF.net
- add spanishLabel to measures attribute items

# Measure unit translated for measure array 
Serving - ración
Splash - chorrito
wedge - trozo
Drop - gota
fluid ounce - onza líquida
Fillet - filete
Piece - pieza
Pound - libra
Ounce - onza
Liquid ounce - onza líquida
Grams - gramos
Strip - Tira
Teaspoon - cucharilla
Slice - rebanada
Bunch - manojo
Container - recipiente
Pouch - bolsa
Package - paquete
Head - cabeza
Branch - rama
Stem - ramita
Spear - bastón
Floweret - florete
Box - caja

# Foods saved in internal foods in spanish

```js
const fruits = [
  'apple',
  'apricot',
  'banana',
  'blackberry',
  'blood orange',
  'blueberry',
  'cantaloupe', //melon
  'cherry',
  'coconut',
  'cranberry',
  'currant',
  'date', //datiles
  'dragon fruit',
  'fig',
  'gooseberry',
  'grape',
  'guava',
  'honeydew', //melon
  'jackfruit',
  'kiwi',
  'lychee',
  'mango',
  'melon',
  'mulberry',
  'nectarine',
  'orange',
  'papaya',
  'passion fruit',
  'peach',
  'pear',
  'persimmon',
  'pineapple',
  'plum',
  'pomegranate',
  'raspberry',
  'rhubarb',
  'soursop',
  'star fruit',
  'strawberry',
  'tangerine',
  'watermelon',
];

const vegetables = [
  'artichoke',
  'arugula',
  'asparagus',
  'beetroot',
  'bell pepper',
  'bok choy',
  'broccoli',
  'brussels sprout',
  'butternut squash',
  'cabbage',
  'carrot',
  'cauliflower',
  'celery',
  'chard',
  'chayote',
  'collard greens',
  'corn',
  'cucumber',
  'daikon',
  'eggplant',
  'endive',
  'fennel',
  'garlic',
  'ginger',
  'green bean',
  'jicama',
  'kale',
  'kohlrabi',
  'leek',
  'lettuce',
  'mushroom',
  'mustard greens',
  'okra',
  'onion',
  'parsnip',
  'peas',
  'potato',
  'pumpkin',
  'radicchio',
  'radish',
  'spinach',
  'squash',
  'sweet potato',
  'swiss chard',
  'tomato',
  'turnip',
  'watercress',
  'zucchini',
];

const grains = [
  'amaranth',
  'arborio rice',
  'barley',
  'basmati rice',
  'black rice',
  'brown rice',
  'buckwheat',
  'bulgur',
  'cornmeal',
  'couscous',
  'farro',
  'jasmine rice',
  'millet',
  'oats',
  'quinoa',
  'red rice',
  'rice',
  'rye',
  'sorghum',
  'spelt',
  'teff',
  'wheat',
  'white rice',
  'wild rice',

  'Triticale',
  'Fonio',
  'Buckwheat',
  'Freekeh',
  'Kamut',
  'Canary seed',
  'Einkorn',
];

const legumes = [
  'Lentils',
  'Chickpeas',
  'Black beans',
  'Kidney beans',
  'Pinto beans',
  'Navy beans',
  'Great Northern beans',
  'Cannellini beans',
  'Adzuki beans',
  'Mung beans',
  'Soybeans',
  'Edamame',
  'Green peas',
  'Split peas',
  'Snow peas',
  'Sugar snap peas',
  'Fava beans',
  'Broad beans',
  'Lima beans',
  'Butter beans',
  'Horse gram',
  'Pigeon peas',
  'Cowpeas',
  'Black-eyed peas',
  'Red lentils',
  'Yellow lentils',
  'White beans',
  'Roman beans',
  'Tepary beans',
  'Field peas',
  'Hyacinth beans',
  'Velvet beans',
  'Winged beans',
  'Jack beans',
  'Moth beans',
  'Bambara groundnuts',
  'Cluster beans (Guar)',
  'Green gram',
  'Lablab beans',
  'Rice beans',
  'Scarlet runner beans',
  'Pink beans',
  'Marrowfat peas',
  'Zolfino beans',
  'Flageolet beans',
  'Yin Yang beans',
];

const meats = [
  'anchovy',
  'bass',
  'beef',
  'bison',
  'catfish',
  'chicken',
  'clam',
  'cod',
  'crab',
  'duck',
  'elk',
  'emu',
  'fish',
  'flounder',
  'guinea pig',
  'goose',
  'grouper',
  'halibut',
  'herring',
  'kangaroo',
  'lamb',
  'lobster',
  'mackerel',
  'mahi-mahi',
  'mussel',
  'meat',
  'octopus',
  'ostrich',
  'oyster',
  'pheasant',
  'pollock',
  'pork',
  'quail',
  'rabbit',
  'salmon',
  'sardine',
  'scad',
  'scallop',
  'sea bass',
  'shrimp',
  'snapper',
  'sole',
  'squid',
  'swordfish',
  'tilapia',
  'trout',
  'tuna',
  'turkey',
  'venison',
];
const juices = [
  'grape juice',
  'orange juice',
  'apple juice',//x
  'carrot juice',
  'pear juice',
  'parsley juice',//x
  'celery juice',
  'beet juice',
  'pineapple juice',
  'pomegranate juice',
  'watermelon juice',
  'tomato juice',
  'cranberry juice',
  'lemon juice',
  'lime juice',
  'ginger juice',
  'cucumber juice',
  'spinach juice',
  'kale juice',
  'mango juice',
  'peach juice',
  
];

const others = [
  'psyllium husk', 
  'olive oil', 
  'black beans', 
  'green beans',
  'tofu',
  'hot Pepper'
]

```;
