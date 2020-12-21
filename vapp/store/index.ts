import database from '@/database'
import VuexORM from '@vuex-orm/core'

export const plugins = [
  VuexORM.install(database)
]

export const strict = false
