export interface WaffleToppingData {
  name: string;
  image: any;
  oneCost: string;
}

const waffleToppingList: WaffleToppingData[] = [
  {
    name: 'Empty',
    image: require('~/static/waffles/empty.png'),
    oneCost: '0'
  },
  {
    name: 'Fried Egg',
    image: require('~/static/waffles/toppings/friedegg.png'),
    oneCost: '20000000000000000000'
  },
  {
    name: 'Sliced Bananas',
    image: require('~/static/waffles/toppings/slicedbananas.png'),
    oneCost: '40000000000000000000'
  },
  {
    name: 'Butter',
    image: require('~/static/waffles/toppings/butter.png'),
    oneCost: '30000000000000000000'
  },
  {
    name: 'BACON!',
    image: require('~/static/waffles/toppings/bacon.png'),
    oneCost: '100000000000000000000'
  },
  {
    name: 'Sprinkles',
    image: require('~/static/waffles/toppings/sprinkles.png'),
    oneCost: '80000000000000000000'
  },
  {
    name: 'Chocolate Chunks',
    image: require('~/static/waffles/toppings/chocolatechunks.png'),
    oneCost: '75000000000000000000'
  },
  {
    name: 'Blueberries',
    image: require('~/static/waffles/toppings/blueberries.png'),
    oneCost: '123000000000000000000'
  },
  {
    name: 'Cherry',
    image: require('~/static/waffles/toppings/cherry.png'),
    oneCost: '77000000000000000000'
  },
  {
    name: 'Grated Cheese',
    image: require('~/static/waffles/toppings/gratedcheese.png'),
    oneCost: '49000000000000000000'
  },
  {
    name: 'Hershey Kiss',
    image: require('~/static/waffles/toppings/hersheykiss.png'),
    oneCost: '70000000000000000000'
  },
  {
    name: 'Chocolate XD Face',
    image: require('~/static/waffles/toppings/xdfacechocolate.png'),
    oneCost: '80000000000000000000'
  },
  {
    name: 'Blueberry YFL Logo',
    image: require('~/static/waffles/toppings/blueberryyfllogo.png'),
    oneCost: '80000000000000000000'
  },
  {
    name: 'Multicolor Harmony Logo',
    image: require('~/static/waffles/toppings/creamharmonylogo.png'),
    oneCost: '80000000000000000000'
  },
  {
    name: 'Crispy BONK Logo',
    image: require('~/static/waffles/toppings/bonklogo.png'),
    oneCost: '80000000000000000000'
  },
  {
    name: 'Whipped Cream',
    image: require('~/static/waffles/toppings/whippedcream.png'),
    oneCost: '35000000000000000000'
  },
  {
    name: 'Raisins',
    image: require('~/static/waffles/toppings/raisins.png'),
    oneCost: '40000000000000000000'
  },
  {
    name: 'M&Ms',
    image: require('~/static/waffles/toppings/mms.png'),
    oneCost: '65000000000000000000'
  },
  {
    name: 'Vanilla Ice Cream Scoop',
    image: require('~/static/waffles/toppings/icecreamvanilla.png'),
    oneCost: '125000000000000000000'
  },
  {
    name: 'Strawberry Ice Cream Scoop',
    image: require('~/static/waffles/toppings/icecreamstrawberry.png'),
    oneCost: '125000000000000000000'
  }
]

export default waffleToppingList
