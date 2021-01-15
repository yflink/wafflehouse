export interface WaffleToppingData {
  name: string;
  image: any;
  woneCost: number;
}

const waffleToppingList: WaffleToppingData[] = [
  {
    name: 'Empty',
    image: require('~/static/waffles/empty.png'),
    woneCost: 0
  },
  {
    name: 'Fried Egg',
    image: require('~/static/waffles/toppings/friedegg.png'),
    woneCost: 20000000000000000000
  },
  {
    name: 'Sliced Bananas',
    image: require('~/static/waffles/toppings/slicedbananas.png'),
    woneCost: 40000000000000000000
  },
  {
    name: 'Butter',
    image: require('~/static/waffles/toppings/butter.png'),
    woneCost: 30000000000000000000
  },
  {
    name: 'BACON!',
    image: require('~/static/waffles/toppings/bacon.png'),
    woneCost: 100000000000000000000
  },
  {
    name: 'Sprinkles',
    image: require('~/static/waffles/toppings/sprinkles.png'),
    woneCost: 80000000000000000000
  },
  {
    name: 'Chocolate Chunks',
    image: require('~/static/waffles/toppings/chocolatechunks.png'),
    woneCost: 75000000000000000000
  },
  {
    name: 'Blueberries',
    image: require('~/static/waffles/toppings/blueberries.png'),
    woneCost: 123000000000000000000
  },
  {
    name: 'Cherry',
    image: require('~/static/waffles/toppings/cherry.png'),
    woneCost: 77000000000000000000
  },
  {
    name: 'Grated Cheese',
    image: require('~/static/waffles/toppings/gratedcheese.png'),
    woneCost: 49000000000000000000
  },
  {
    name: 'Hershey Kiss',
    image: require('~/static/waffles/toppings/hersheykiss.png'),
    woneCost: 70000000000000000000
  },
  {
    name: 'Chocolate XD Face',
    image: require('~/static/waffles/toppings/xdfacechocolate.png'),
    woneCost: 80000000000000000000
  },
  {
    name: 'Blueberry YFL Logo',
    image: require('~/static/waffles/toppings/blueberryyfllogo.png'),
    woneCost: 80000000000000000000
  },
  {
    name: 'Multicolor Harmony Logo',
    image: require('~/static/waffles/toppings/creamharmonylogo.png'),
    woneCost: 80000000000000000000
  },
  {
    name: 'Crispy BONK Logo',
    image: require('~/static/waffles/toppings/bonklogo.png'),
    woneCost: 80000000000000000000
  },
  {
    name: 'Whipped Cream',
    image: require('~/static/waffles/toppings/whippedcream.png'),
    woneCost: 35000000000000000000
  },
  {
    name: 'Raisins',
    image: require('~/static/waffles/toppings/raisins.png'),
    woneCost: 40000000000000000000
  },
  {
    name: 'M&Ms',
    image: require('~/static/waffles/toppings/mms.png'),
    woneCost: 65000000000000000000
  },
  {
    name: 'Vanilla Ice Cream Scoop',
    image: require('~/static/waffles/toppings/icecreamvanilla.png'),
    woneCost: 125000000000000000000
  },
  {
    name: 'Strawberry Ice Cream Scoop',
    image: require('~/static/waffles/toppings/icecreamstrawberry.png'),
    woneCost: 125000000000000000000
  }
]

export default waffleToppingList
