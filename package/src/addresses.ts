export const ARC_TESTNET = {
  chainId: 5042002,
  name: "Arc Testnet",
  rpcUrl: "https://rpc.testnet.arc.network",
  blockExplorer: "https://testnet.arcscan.app",

  LendingPool:    "0xa9f33671Ec86ABc4636f78211e8A34b1F9939351",
  MockPriceOracle:"0x08472bB502afeaCD3DEC8A4E6a32bB84F275f179",

  tokens: {
    USDC: "0x3600000000000000000000000000000000000000",
    EURC: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a",
    USYC: "0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C",
  },

  integrations: {
    GaslessRouter: "0x13dc799E50494dB89fE4f724966939572Dc858db",
    vaults: {
      USDC: "0x702f34adc721b79D0fA14B59ddAA85C852d747cA",
      EURC: "0xf9CE4c8c67C2AC3D059DA423956c495858Ce0305",
    },
  },
} as const;
