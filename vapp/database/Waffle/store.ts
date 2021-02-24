import BigNumber from 'bignumber.js'
import Waffle from '~/database/Waffle'
import WaffleLayer from '~/database/WaffleLayer'
import { bnToNumber } from '~/utils/abi'
import { CustomizationStep, Ticker } from '~/enums'
import {
  CREATE_WAFFLE_CURRENCY_COST,
  LEADERBOARD_WAFFLE_COUNT,
  MAX_VOTES_PER_ACCOUNT,
  MAX_WAFFLE_LAYERS
} from '~/constants'
import Token from '~/database/Token'
import baseList from '~/lists/waffle-bases'
import toppingList from '~/lists/waffle-toppings'
import plateList from '~/lists/waffle-plates'
import extraList from '~/lists/waffle-extras'

const loadHiddenWaffleIds = (): number[] => {
  const favorites = JSON.parse(localStorage.getItem('hiddenWaffleIds'))
  return favorites || []
}

const saveHiddenWaffleIds = (hiddenWaffleIds: number[]) => {
  localStorage.setItem('hiddenWaffleIds', JSON.stringify(hiddenWaffleIds))
}

const loadFavoriteWaffleIds = (): number[] => {
  const favorites = JSON.parse(localStorage.getItem('favoriteWaffleIds'))
  return favorites || []
}

const saveFavoriteWaffleIds = (favoriteWaffleIds: number[]) => {
  localStorage.setItem('favoriteWaffleIds', JSON.stringify(favoriteWaffleIds))
}

const processWaffleInfo = async (waffleId: number, waffleInfo: any) => {
  const favorites = loadFavoriteWaffleIds()
  const hidden = loadHiddenWaffleIds()
  // layers is an array and is misinterpreted by insertOrUpdate if we don't convert
  const layersData = waffleInfo.layers.map((layer, index) => {
    return {
      layerIndex: index,
      baseId: bnToNumber(layer.baseId),
      toppingId: bnToNumber(layer.toppingId)
    }
  })

  await Waffle.insertOrUpdate({
    data: {
      id: waffleId,
      name: waffleInfo.name,
      favorite: favorites.includes(waffleId),
      hidden: hidden.includes(waffleId),
      votes: bnToNumber(waffleInfo.votes),
      extraId: bnToNumber(waffleInfo.extraId),
      plateId: bnToNumber(waffleInfo.plateId),
      published: waffleInfo.published,
      processEnd: bnToNumber(waffleInfo.processEnd),
      customizationStep: bnToNumber(waffleInfo.customizationStep)
    }
  })

  const currentLayersCount = WaffleLayer.query().where('waffleId', waffleId).count()
  layersData.forEach((layerData, index) => {
    if (index >= currentLayersCount) {
      WaffleLayer.insert({
        data: {
          waffleId,
          ...layerData
        }
      })
    } else {
      WaffleLayer.update({
        where: (layer) => {
          return layer.waffleId === waffleId && layer.layerIndex === layerData.layerIndex
        },
        data: {
          baseId: layerData.baseId,
          toppingId: layerData.toppingId
        }
      })
    }
  })
}

export default {
  actions: {
    loadFavoriteWaffleIds () {
      return loadFavoriteWaffleIds()
    },

    async loadWaffles (_, waffleIds: number[]) {
      await Promise.all(waffleIds.map(async (waffleId) => {
        const waffleInfo = await this.$contracts.WaffleMaker.methods.getWaffleInfo(waffleId).call()
        await processWaffleInfo(waffleId, waffleInfo)
      }))
    },

    async loadPublishedWaffles (_, publishedWaffleIndices: number[]) {
      const waffleIds = []
      await Promise.all(publishedWaffleIndices.map(async (publishedWaffleIndex) => {
        try {
          const waffleInfo = await this.$contracts.WaffleMaker.methods.getPublishedWaffleInfo(publishedWaffleIndex).call()
          const waffleId = bnToNumber(waffleInfo.id)
          await processWaffleInfo(waffleId, waffleInfo)
          waffleIds.push(waffleId)
        } catch (e) {

        }
      }))
      return waffleIds
    },

    async getWaffleOwner (_, waffleId: number) {
      return await this.$contracts.WaffleMaker.methods.getWaffleOwner(waffleId).call()
    },

    async loadLeaderboardWaffles () {
      const waffleIds = []
      const leaderboardIndices = []
      for (let i = 0; i < LEADERBOARD_WAFFLE_COUNT; i++) {
        leaderboardIndices.push(i)
      }

      await Promise.all(leaderboardIndices.map(async (leaderboardIndex) => {
        try {
          const waffleInfo = await this.$contracts.WaffleMaker.methods.getLeaderboardWaffleInfo(leaderboardIndex).call()
          const waffleId = bnToNumber(waffleInfo.id)
          await processWaffleInfo(waffleId, waffleInfo)
          waffleIds.push(waffleId)
        } catch (e) {

        }
      }))
      return waffleIds
    },

    async loadAccountWaffles ({ dispatch, rootGetters }: any) {
      await dispatch('accounts/loadAccountInfo', null, { root: true })
      const ownedWaffleIds = rootGetters['accounts/getOwnedWaffleIds']
      await dispatch('loadWaffles', ownedWaffleIds)
    },

    createWaffle ({ dispatch }) {
      const router = this.$router
      const transaction = this.$contracts.WaffleMaker.methods.createWaffle()
      dispatch('dispatchTransaction', {
        title: 'Creating Waffle',
        transaction,
        currencyCost: CREATE_WAFFLE_CURRENCY_COST,
        successCallback () {
          router.push('/my-waffles')
        }
      }, { root: true })
    },
    createWaffleFlow ({ dispatch, rootGetters }) {
      const currencyToken = Token.query().find(Ticker.CURRENCY)
      const ownedWaffleIds = rootGetters['accounts/getOwnedWaffleIds']
      if (ownedWaffleIds.length === 0) {
        dispatch('dialogs/displayConfirmation', {
          title: 'Create new waffle?',
          body: `This will begin a 24 hour period baking period and will cost you ${currencyToken.formatAmountPrecision(CREATE_WAFFLE_CURRENCY_COST, 1, true)}`,
          affirmativeAction: () => {
            dispatch('createWaffle')
          },
          affirmativeLabel: 'Create Waffle'
        }, { root: true })
      } else {
        dispatch('createWaffle')
      }
    },

    submitWaffleCustomization ({ dispatch }: any, { waffleId, name, baseId, toppingId, extraId, plateId }) {
      const base = baseList[baseId]
      const topping = toppingList[toppingId]
      const extra = extraList[extraId]
      const plate = plateList[plateId]
      const oneCost = new BigNumber(base.oneCost).plus(topping.oneCost).plus(extra.oneCost).plus(plate.oneCost).toString(10)

      const router = this.$router
      const transaction = this.$contracts.WaffleMaker.methods.submitWaffleCustomization(waffleId, name, baseId, toppingId, extraId, plateId)
      dispatch('dispatchTransaction', {
        title: 'Customizing Waffle',
        transaction,
        oneCost,
        successCallback () {
          router.push('/my-waffles')
        }
      }, { root: true })
    },

    advanceWaffleCustomizationStep ({ dispatch }: any, waffleId: number) {
      const transaction = this.$contracts.WaffleMaker.methods.advanceWaffleCustomizationStep(waffleId)
      dispatch('dispatchTransaction', {
        title: 'Adding Ingredient',
        transaction,
        async successCallback () {
          await dispatch('loadAccountWaffles')
        }
      }, { root: true })
    },

    bakeWaffleLayer ({ dispatch }: any, waffleId: number) {
      const transaction = this.$contracts.WaffleMaker.methods.bakeWaffleLayer(waffleId)
      dispatch('dispatchTransaction', {
        title: 'Adding Waffle Layer',
        transaction,
        async successCallback () {
          await dispatch('loadAccountWaffles')
        }
      }, { root: true })
    },
    bakeWaffleLayerFlow ({ dispatch }, waffleId: number) {
      const currencyToken = Token.query().find(Ticker.CURRENCY)
      const waffle = Waffle.query().with('layers').find(waffleId)
      if (waffle.customizationStep !== CustomizationStep.DONE) {
        dispatch('dialogs/displayError', {
          title: 'Cannot Add Waffle Layer',
          body: 'The top layer of your waffle must be customized before you can add a new layer'
        }, { root: true })
      } else if (waffle.layers.length === MAX_WAFFLE_LAYERS) {
        dispatch('dialogs/displayError', {
          title: 'Cannot Add Waffle Layer',
          body: 'You\'ve reached the max amount of layers for this waffle'
        }, { root: true })
      } else {
        dispatch('dialogs/displayConfirmation', {
          title: 'Add New Waffle Layer?',
          body: `This will initiate a 24 hour baking period and will cost you ${currencyToken.formatAmountPrecision(CREATE_WAFFLE_CURRENCY_COST, 1, true)}`,
          affirmativeAction: () => {
            dispatch('bakeWaffleLayer', waffleId)
          },
          affirmativeLabel: 'Add New Layer'
        }, { root: true })
      }
    },

    publishWaffle ({ dispatch }, waffleId: number) {
      const transaction = this.$contracts.WaffleMaker.methods.publishWaffle(waffleId)
      dispatch('dispatchTransaction', {
        title: 'Publishing Waffle',
        transaction,
        async successCallback () {
          await dispatch('loadAccountWaffles')
        }
      }, { root: true })
    },
    publishWaffleFlow ({ dispatch }, waffleId: number) {
      const waffle = Waffle.query().find(waffleId)
      if (waffle.customizationStep === CustomizationStep.DONE) {
        dispatch('dialogs/displayConfirmation', {
          title: 'Publish this waffle?',
          body: 'Your waffle will be open for voting, but you will not be able to customize it further.',
          affirmativeAction: () => {
            dispatch('publishWaffle', waffleId)
          },
          affirmativeLabel: 'Publish Waffle'
        }, { root: true })
      } else {
        dispatch('dialogs/displayError', {
          title: 'Cannot Publish Waffle',
          body: 'The top layer of your waffle must be customized before it can be published'
        }, { root: true })
      }
    },

    voteWaffle ({ dispatch }, waffleId: number) {
      const transaction = this.$contracts.WaffleMaker.methods.voteWaffle(waffleId)
      dispatch('dispatchTransaction', {
        title: 'Voting',
        transaction,
        async successCallback () {
          await dispatch('loadAccountWaffles')
        }
      }, { root: true })
    },
    voteWaffleFlow ({ dispatch, rootGetters }, waffleId: number) {
      const votedWaffleIds = rootGetters['accounts/getVotedWaffleIds']
      const ownedWaffleIds = rootGetters['accounts/getOwnedWaffleIds']
      const canVote = rootGetters['accounts/getCanVote']
      if (votedWaffleIds.length === MAX_VOTES_PER_ACCOUNT) {
        dispatch('dialogs/displayError', {
          title: 'Vote Failed',
          body: 'You\'ve reached the max amount of votes for this account.'
        }, { root: true })
      } else if (!canVote) {
        dispatch('dialogs/displayError', {
          title: 'Vote Failed',
          body: 'You must have published at least one waffle before you can vote for other people\'s waffles',
          actionLabel: 'Dang!'
        }, { root: true })
      } else if (ownedWaffleIds.includes(waffleId)) {
        dispatch('dialogs/displayError', {
          title: 'Vote Failed',
          body: 'This waffle is yours, cheater!',
          actionLabel: 'Dang!'
        }, { root: true })
      } else if (votedWaffleIds.includes(waffleId)) {
        dispatch('dialogs/displayError', {
          title: 'Vote Failed',
          body: 'You can\'t vote for a waffle you\'ve already voted for.'
        }, { root: true })
      } else {
        const remainingVotes = MAX_VOTES_PER_ACCOUNT - votedWaffleIds.length - 1
        dispatch('dialogs/displayConfirmation', {
          title: 'Vote For This Waffle?',
          body: `After this vote, this account will be allowed to vote ${remainingVotes} more time${remainingVotes > 1 ? 's' : ''}.`,
          affirmativeAction: () => {
            dispatch('voteWaffle', waffleId)
          },
          affirmativeLabel: 'Vote for Waffle'
        }, { root: true })
      }
    },

    setWaffleFavorite (_, { waffleId, value }) {
      const favoriteWaffleIds = loadFavoriteWaffleIds()
      const waffleFavoriteIndex = favoriteWaffleIds.indexOf(waffleId)

      const updateStoreWaffleFavorite = (value: boolean) => {
        Waffle.update({
          where: (waffle) => {
            return waffle.id === waffleId
          },
          data: {
            favorite: value
          }
        })
      }

      if (value && waffleFavoriteIndex === -1) {
        favoriteWaffleIds.push(waffleId)
        updateStoreWaffleFavorite(true)
      } else if (!value && waffleFavoriteIndex !== -1) {
        favoriteWaffleIds.splice(waffleFavoriteIndex, 1)
        updateStoreWaffleFavorite(false)
      }
      saveFavoriteWaffleIds(favoriteWaffleIds)
    },

    setWaffleHidden (_, { waffleId, value }) {
      const hiddenWaffleIds = loadHiddenWaffleIds()
      const waffleHiddenIndex = hiddenWaffleIds.indexOf(waffleId)

      const updateStoreWaffleHidden = (value: boolean) => {
        Waffle.update({
          where: (waffle) => {
            return waffle.id === waffleId
          },
          data: {
            hidden: value
          }
        })
      }

      if (value && waffleHiddenIndex === -1) {
        hiddenWaffleIds.push(waffleId)
        updateStoreWaffleHidden(true)
      } else if (!value && waffleHiddenIndex !== -1) {
        hiddenWaffleIds.splice(waffleHiddenIndex, 1)
        updateStoreWaffleHidden(false)
      }
      saveHiddenWaffleIds(hiddenWaffleIds)
    }
  },

  getters: {
    getActiveAccountWaffles (_, __, ___, rootGetters) {
      const accountWaffles = rootGetters['accounts/getOwnedWaffleIds']
      return Waffle
        .query()
        .whereIdIn(accountWaffles)
        .orderBy('customizationStep')
        .orderBy('published')
        .with('layers', (query) => {
          query.orderBy('layerIndex')
        })
        .all()
    },

    getWafflebyId () {
      return (id: number) => {
        return Waffle
          .query()
          .with('layers', (query) => {
            query.orderBy('layerIndex')
          })
          .find(id)
      }
    },

    getWafflesbyIds () {
      return (ids: number[]) => {
        return Waffle
          .query()
          .whereIdIn(ids)
          .with('layers', (query) => {
            query.orderBy('layerIndex')
          })
          .all()
      }
    },

    getFavoriteWaffles () {
      return Waffle
        .query()
        .withAllRecursive(1)
        .with('layers', (query) => {
          query.orderBy('layerIndex')
        })
        .all()
    }
  }
}
