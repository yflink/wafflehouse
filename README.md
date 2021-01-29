# WaffleHouse
WaffleHouse is a dapp that uses the best elements of Ethereum (ERC20 shittokens) and Harmony (reduced TX times/fees)
to create a blockchain based game incentivized by cash prizes and game theory.

## Deploy your own competition contract

1. Rename .envSample to .env
2. Configure .env with desired values
3. Migrate contract
```
truffle migrate --network INSERT_NETWORK (mainnet or testnet)
```

## Compile contracts for official networks

1. Compile contract for frontend and truffle, and inject addresses
```
npm run compile
```

## Add new ingredients to a deployed contract

1. Add ingredient at the end of one of the 4 lists in the "lists" folder
2. Run following command
```
truffle migrate --network INSERT_NETWORK (mainnet or testnet) -f 3
```

## Run Frontend

```
cd vapp
npm run dev
```