export interface WaffleBaseData {
  name: string;
  image: any;
  oneCost: string;
}

const waffleBaseList: WaffleBaseData[] = [
  {
    name: 'Empty',
    image: require('~/static/waffles/empty.png'),
    oneCost: '0'
  },
  {
    name: 'Chocolate Syrup',
    image: require('~/static/waffles/bases/chocolate.png'),
    oneCost: '20000000000000000000'
  },
  {
    name: 'Blueberry Syrup',
    image: require('~/static/waffles/bases/blueberry.png'),
    oneCost: '22000000000000000000'
  },
  {
    name: 'Raspberry Syrup',
    image: require('~/static/waffles/bases/raspberry.png'),
    oneCost: '15000000000000000000'
  },
  {
    name: 'Molasses',
    image: require('~/static/waffles/bases/molasses.png'),
    oneCost: '30000000000000000000'
  },
  {
    name: 'Butter',
    image: require('~/static/waffles/bases/butter.png'),
    oneCost: '17000000000000000000'
  },
  {
    name: 'Cranberry Syrup',
    image: require('~/static/waffles/bases/cranberry.png'),
    oneCost: '22000000000000000000'
  },
  {
    name: 'Maple Syrup',
    image: require('~/static/waffles/bases/maple.png'),
    oneCost: '20000000000000000000'
  },
  {
    name: 'Slime',
    image: require('~/static/waffles/bases/slime.png'),
    oneCost: '10000000000000000000'
  },
  {
    name: 'Greek Yogurt',
    image: require('~/static/waffles/bases/yogurt.png'),
    oneCost: '50000000000000000000'
  },
  {
    name: 'Almond Butter',
    image: require('~/static/waffles/bases/almondbutter.png'),
    oneCost: '34000000000000000000'
  },
  {
    name: 'Almond Butter Jelly',
    image: require('~/static/waffles/bases/almondbutterjelly.png'),
    oneCost: '45000000000000000000'
  },
  {
    name: 'Peanut Butter',
    image: require('~/static/waffles/bases/peanutbutter.png'),
    oneCost: '37000000000000000000'
  },
  {
    name: 'Peanut Butter Jelly',
    image: require('~/static/waffles/bases/peanutbutterjelly.png'),
    oneCost: '45000000000000000000'
  },
  {
    name: 'Nutella',
    image: require('~/static/waffles/bases/nutella.png'),
    oneCost: '666000000000000000000'
  },
  {
    name: 'Coconut Syrup',
    image: require('~/static/waffles/bases/coconut.png'),
    oneCost: '40000000000000000000'
  },
  {
    name: 'Sriracha Hot Sauce',
    image: require('~/static/waffles/bases/sriracha.png'),
    oneCost: '69000000000000000000'
  },
  {
    name: 'Melted Cheese',
    image: require('~/static/waffles/bases/meltedcheese.png'),
    oneCost: '60000000000000000000'
  },
  {
    name: 'Coffee Liqueur',
    image: require('~/static/waffles/bases/coffeeliqueur.png'),
    oneCost: '30000000000000000000'
  },
  {
    name: 'Apple Sauce',
    image: require('~/static/waffles/bases/applesauce.png'),
    oneCost: '36000000000000000000'
  }
]

export default waffleBaseList
