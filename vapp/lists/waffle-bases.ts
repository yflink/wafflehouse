export interface WaffleBaseData {
  name: string;
  image: any;
  woneCost: number;
}

const waffleBaseList: WaffleBaseData[] = [
  {
    name: 'Empty',
    image: require('~/static/waffles/empty.png'),
    woneCost: 0
  },
  {
    name: 'Chocolate Syrup',
    image: require('~/static/waffles/bases/chocolate.png'),
    woneCost: 20000000000000000000
  },
  {
    name: 'Blueberry Syrup',
    image: require('~/static/waffles/bases/blueberry.png'),
    woneCost: 22000000000000000000
  },
  {
    name: 'Raspberry Syrup',
    image: require('~/static/waffles/bases/raspberry.png'),
    woneCost: 15000000000000000000
  },
  {
    name: 'Molasses',
    image: require('~/static/waffles/bases/molasses.png'),
    woneCost: 30000000000000000000
  },
  {
    name: 'Butter',
    image: require('~/static/waffles/bases/butter.png'),
    woneCost: 17000000000000000000
  },
  {
    name: 'Cranberry Syrup',
    image: require('~/static/waffles/bases/cranberry.png'),
    woneCost: 22000000000000000000
  },
  {
    name: 'Maple Syrup',
    image: require('~/static/waffles/bases/maple.png'),
    woneCost: 20000000000000000000
  },
  {
    name: 'Slime',
    image: require('~/static/waffles/bases/slime.png'),
    woneCost: 10000000000000000000
  },
  {
    name: 'Greek Yogurt',
    image: require('~/static/waffles/bases/yogurt.png'),
    woneCost: 50000000000000000000
  },
  {
    name: 'Almond Butter',
    image: require('~/static/waffles/bases/almondbutter.png'),
    woneCost: 34000000000000000000
  },
  {
    name: 'Almond Butter Jelly',
    image: require('~/static/waffles/bases/almondbutterjelly.png'),
    woneCost: 45000000000000000000
  },
  {
    name: 'Peanut Butter',
    image: require('~/static/waffles/bases/peanutbutter.png'),
    woneCost: 37000000000000000000
  },
  {
    name: 'Peanut Butter Jelly',
    image: require('~/static/waffles/bases/peanutbutterjelly.png'),
    woneCost: 45000000000000000000
  },
  {
    name: 'Nutella',
    image: require('~/static/waffles/bases/nutella.png'),
    woneCost: 666000000000000000000
  },
  {
    name: 'Coconut Syrup',
    image: require('~/static/waffles/bases/coconut.png'),
    woneCost: 40000000000000000000
  },
  {
    name: 'Sriracha Hot Sauce',
    image: require('~/static/waffles/bases/sriracha.png'),
    woneCost: 69000000000000000000
  },
  {
    name: 'Melted Cheese',
    image: require('~/static/waffles/bases/meltedcheese.png'),
    woneCost: 60000000000000000000
  },
  {
    name: 'Coffee Liqueur',
    image: require('~/static/waffles/bases/coffeeliqueur.png'),
    woneCost: 30000000000000000000
  },
  {
    name: 'Apple Sauce',
    image: require('~/static/waffles/bases/applesauce.png'),
    woneCost: 36000000000000000000
  }
]

export default waffleBaseList
