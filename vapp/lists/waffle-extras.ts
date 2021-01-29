export interface WaffleExtraData {
  name: string;
  image: any;
  oneCost: string;
}

const waffleExtraList: WaffleExtraData[] = [
  {
    name: 'Empty',
    image: require('~/static/waffles/empty.png'),
    oneCost: '0'
  },
  {
    name: 'Flames',
    image: require('~/static/waffles/extras/firebackground.png'),
    oneCost: '135000000000000000000'
  },
  {
    name: 'Ribbon',
    image: require('~/static/waffles/extras/ribbon.png'),
    oneCost: '135000000000000000000'
  },
  {
    name: 'Sprinkles',
    image: require('~/static/waffles/extras/sprinkles.png'),
    oneCost: '135000000000000000000'
  },
  {
    name: 'Hearts',
    image: require('~/static/waffles/extras/hearts.png'),
    oneCost: '135000000000000000000'
  },
  {
    name: 'Chocolate Lines',
    image: require('~/static/waffles/extras/chocolatelines.png'),
    oneCost: '135000000000000000000'
  },
  {
    name: 'Strudel  Lines',
    image: require('~/static/waffles/extras/strudellines.png'),
    oneCost: '135000000000000000000'
  },
  {
    name: 'Angel Wings',
    image: require('~/static/waffles/extras/angelwings.png'),
    oneCost: '135000000000000000000'
  },
  {
    name: 'Demon Wings',
    image: require('~/static/waffles/extras/demonwings.png'),
    oneCost: '135000000000000000000'
  }
]

export default waffleExtraList
