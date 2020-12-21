export interface WaffleBaseData {
  name: string;
  image: any;
}

const waffleBaseList: WaffleBaseData[] = [
  {
    name: 'Empty',
    image: require('~/static/waffles/empty.png')
  },
  {
    name: 'Chocolate Syrup',
    image: require('~/static/waffles/bases/chocolate.png')
  },
  {
    name: 'Blueberry Syrup',
    image: require('~/static/waffles/bases/blueberry.png')
  },
  {
    name: 'Raspberry Syrup',
    image: require('~/static/waffles/bases/raspberry.png')
  },
  {
    name: 'Molasses',
    image: require('~/static/waffles/bases/molasses.png')
  },
  {
    name: 'Butter',
    image: require('~/static/waffles/bases/butter.png')
  },
  {
    name: 'Cranberry Syrup',
    image: require('~/static/waffles/bases/cranberry.png')
  },
  {
    name: 'Maple Syrup',
    image: require('~/static/waffles/bases/maple.png')
  },
  {
    name: 'Slime',
    image: require('~/static/waffles/bases/slime.png')
  },
  {
    name: 'Greek Yogurt',
    image: require('~/static/waffles/bases/yogurt.png')
  },
  {
    name: 'Almond Butter',
    image: require('~/static/waffles/bases/almondbutter.png')
  },
  {
    name: 'Almond Butter Jelly',
    image: require('~/static/waffles/bases/almondbutterjelly.png')
  },
  {
    name: 'Peanut Butter',
    image: require('~/static/waffles/bases/peanutbutter.png')
  },
  {
    name: 'Peanut Butter Jelly',
    image: require('~/static/waffles/bases/peanutbutterjelly.png')
  },
  {
    name: 'Nutella',
    image: require('~/static/waffles/bases/nutella.png')
  },
  {
    name: 'Coconut Syrup',
    image: require('~/static/waffles/bases/coconut.png')
  },
  {
    name: 'Sriracha Hot Sauce',
    image: require('~/static/waffles/bases/sriracha.png')
  },
  {
    name: 'Melted Cheese',
    image: require('~/static/waffles/bases/meltedcheese.png')
  },
  {
    name: 'Coffee Liqueur',
    image: require('~/static/waffles/bases/coffeeliqueur.png')
  },
  {
    name: 'Apple Sauce',
    image: require('~/static/waffles/bases/applesauce.png')
  }
]

export default waffleBaseList
