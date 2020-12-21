# WaffleHouse
WaffleHouse is a dapp that uses the best elements of Ethereum (ERC20 shittokens) and Harmony (reduced TX times/fees)
to create a blockchain based game incentivized by cash prizes and game theory.

## Deploy your own competition contract

1. Rename .envSample to .env
2. Configure .env with desired values
3. Migrate contract
```
truffle migrate --network (mainnet or testnet)
```

## Compile contracts for official networks

1. Compile contract for frontend and truffle, and inject addresses
```
npm run compile
```

## Run Frontend

```
cd vapp
npm run dev
```