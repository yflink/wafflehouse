<template>
  <v-container class="fill-both vh-center">
    <v-card max-width="800" tile color="transparent" flat>
      <div class="mb-10">
        <h1>
          OFFICIAL RULES
        </h1>
        <ol>
          <li>
            The Great Waffle Competition will last a grand total of 30 days from the start
          </li>
          <li>
            During this time, users will be able to create their own customized waffles
          </li>
          <li>
            Users will be able to vote on waffles they deem to be worthy of the grand prize
          </li>
          <li>
            Waffle creation is a timed game using Harmony for lower gas fees.
          </li>
        </ol>
      </div>

      <div class="mb-10">
        <h1>
          USER WALLET
        </h1>
        <span>
          When users send funds through the Harmony bridge, they create a user wallet waffles will draw from during the creation process. It is important that the user wallet is topped up, and to avoid large fees on Ethereum, we recommend sending enough for several waffles. Note that unused funds for waffle creation can be sent back to a user’s wallet at any time.
        </span>
      </div>

      <div class="mb-10">
        <h1>
          WAFFLE MAKING
        </h1>
        <span>
          Upon creation of a waffle, users will need to create a transaction on Harmony to start the process. During set periods of time, the front end visual will light up, signalling that a new ingredient must be added to the waffle. Successfully sending during this time will continue the waffle-making process as planned. Failure to confirm this transaction during the time allotted will burn the user’s waffle. The timer will always show the time until the next ingredient must be added. Keep it in mind!
        </span>
      </div>

      <div class="mb-10">
        <h1>
          BURNING
        </h1>
        <span>
          If a waffle is burned, the user will no longer be able to add layers, customize, or otherwise interact with their waffle. It is also unable to be voted on. The funds used for the creation of the waffle will be split between the grand prize and a special burn address, where they will never return!
        </span>
      </div>

      <div class="mb-10">
        <h1>
          VOTING
        </h1>
        <span>
          Any user who has made at least one waffle will be able to vote on other’s waffles. Note that a user cannot vote on their own waffle! A user has a maximum of 3 available votes when voting for waffles. Choose them carefully!
        </span>
      </div>

      <div class="mb-10">
        <h1>
          PRIZES
        </h1>
        <div class="mb-4">
          Several prizes will be given out to the users with the winning votes
        </div>
        <ol>
          <li>
            One Grand Prize winner will receive the USD amount indicated on the wafflehouse.io home page. The winner will be the address that controls the most voted-on waffle.
          </li>
          <li>
            The top 3 voted waffles will all win one exclusive BONK x YFL NFTs, pictured below:
          </li>
        </ol>
      </div>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Rules'
}
</script>

<style scoped>

</style>
