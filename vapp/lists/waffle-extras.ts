export interface WaffleExtraData {
  name: string;
  image: any;
}

const waffleExtraList: WaffleExtraData[] = [
  {
    name: 'Empty',
    image: require('~/static/waffles/empty.png')
  },
  {
    name: 'Flames',
    image: require('~/static/waffles/extras/firebackground.png')
  },
  {
    name: 'Ribbon',
    image: require('~/static/waffles/extras/ribbon.png')
  },
  {
    name: 'Angel Wings',
    image: require('~/static/waffles/extras/angelwings.png')
  },
  {
    name: 'Demon Wings',
    image: require('~/static/waffles/extras/demonwings.png')
  }
]

export default waffleExtraList
