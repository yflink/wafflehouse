export interface WaffleToppingData {
  name: string;
  image: any;
}

const waffleToppingList: WaffleToppingData[] = [
  {
    name: 'Empty',
    image: require('~/static/waffles/empty.png')
  },
  {
    name: 'Fried Egg',
    image: require('~/static/waffles/toppings/friedegg.png')
  },
  {
    name: 'Sliced Bananas',
    image: require('~/static/waffles/toppings/slicedbananas.png')
  },
  {
    name: 'Butter',
    image: require('~/static/waffles/toppings/butter.png')
  },
  {
    name: 'BACON!',
    image: require('~/static/waffles/toppings/bacon.png')
  },
  {
    name: 'Sprinkles',
    image: require('~/static/waffles/toppings/sprinkles.png')
  },
  {
    name: 'Chocolate Chunks',
    image: require('~/static/waffles/toppings/chocolatechunks.png')
  },
  {
    name: 'Blueberries',
    image: require('~/static/waffles/toppings/blueberries.png')
  },
  {
    name: 'Cherry',
    image: require('~/static/waffles/toppings/cherry.png')
  },
  {
    name: 'Grated Cheese',
    image: require('~/static/waffles/toppings/gratedcheese.png')
  },
  {
    name: 'Hershey Kiss',
    image: require('~/static/waffles/toppings/hersheykiss.png')
  },
  {
    name: 'Chocolate XD Face',
    image: require('~/static/waffles/toppings/xdfacechocolate.png')
  },
  {
    name: 'Blueberry YFL Logo',
    image: require('~/static/waffles/toppings/blueberryyfllogo.png')
  },
  {
    name: 'Multicolor Harmony Logo',
    image: require('~/static/waffles/toppings/creamharmonylogo.png')
  },
  {
    name: 'Crispy BONK Logo',
    image: require('~/static/waffles/toppings/bonklogo.png')
  },
  {
    name: 'Whipped Cream',
    image: require('~/static/waffles/toppings/whippedcream.png')
  },
  {
    name: 'Raisins',
    image: require('~/static/waffles/toppings/raisins.png')
  },
  {
    name: 'M&Ms',
    image: require('~/static/waffles/toppings/mms.png')
  },
  {
    name: 'Vanilla Ice Cream Scoop',
    image: require('~/static/waffles/toppings/icecreamvanilla.png')
  },
  {
    name: 'Strawberry Ice Cream Scoop',
    image: require('~/static/waffles/toppings/icecreamstrawberry.png')
  }
]

export default waffleToppingList
