export interface WafflePlateData {
  name: string;
  image: any;
}

const wafflePlateList: WafflePlateData[] = [
  {
    name: 'Plain Plate',
    image: require('~/static/waffles/plates/plain.png')
  },
  {
    name: 'Black Plate',
    image: require('~/static/waffles/plates/black.png')
  },
  {
    name: 'Pink Plate',
    image: require('~/static/waffles/plates/pink.png')
  },
  {
    name: 'Orange Plate',
    image: require('~/static/waffles/plates/orange.png')
  },
  {
    name: 'Blue Plate',
    image: require('~/static/waffles/plates/blue.png')
  },
  {
    name: 'Purple Plate',
    image: require('~/static/waffles/plates/purple.png')
  },
  {
    name: 'Red Plate',
    image: require('~/static/waffles/plates/red.png')
  },
  {
    name: 'Yellow Plate',
    image: require('~/static/waffles/plates/yellow.png')
  },
  {
    name: 'Glass Plate',
    image: require('~/static/waffles/plates/glass.png')
  },
  {
    name: 'Gold Plate',
    image: require('~/static/waffles/plates/gold.png')
  }
]

export default wafflePlateList
