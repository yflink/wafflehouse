import { Database } from '@vuex-orm/core'

import Token from '~/database/Token'
import tokenStore from '~/database/Token/store'

import WaffleLayer from '~/database/WaffleLayer'

import Waffle from '~/database/Waffle'
import waffleStore from '~/database/Waffle/store'

const database = new Database()
database.register(Token, tokenStore)
database.register(Waffle, waffleStore)
database.register(WaffleLayer)

export default database
