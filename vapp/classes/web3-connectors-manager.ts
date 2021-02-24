interface ConnectorOption {
  connectorClass: any;
  options?: object;
}

interface ConnectorOptionsList {
  [key: string]: ConnectorOption
}

interface ConnectorsManagerOptions {
  cacheConnector?: boolean;
  connectorOptions: ConnectorOptionsList;
}

class InvalidConnectorError extends Error {
  public constructor (unsupportedConnector: string | undefined) {
    super()
    this.name = this.constructor.name
    this.message = `Unsupported connector: ${unsupportedConnector}.`
  }
}

export class Web3ConnectorsManager {
  private readonly cacheConnector: boolean;

  private selectedConnectorId?: string;
  private availableConnectors: any = {};

  constructor ({ cacheConnector, connectorOptions }: ConnectorsManagerOptions) {
    this.cacheConnector = cacheConnector === true
    if (this.cacheConnector) {
      this.selectedConnectorId = localStorage.cachedConnector
    }

    for (const connectorId of Object.keys(connectorOptions)) {
      const { connectorClass, options } = connectorOptions[connectorId]
      // eslint-disable-next-line new-cap
      this.availableConnectors[connectorId] = new connectorClass(options)
    }
  }

  get isConnectorCached () {
    return this.selectedConnectorId && this.cacheConnector
  }

  get selectedConnector () {
    if (this.selectedConnectorId && this.availableConnectors[this.selectedConnectorId]) {
      return this.availableConnectors[this.selectedConnectorId]
    } else {
      return null
    }
  }

  async connect (connectorId?: string) {
    const connId = connectorId || this.selectedConnectorId
    if (connId && this.availableConnectors[connId]) {
      this.selectedConnectorId = connId
      if (this.cacheConnector) {
        localStorage.cachedConnector = connId
      }

      const { provider } = await this.selectedConnector.activate()
      return provider
    } else {
      throw new InvalidConnectorError(connId)
    }
  }

  disconnect () {
    if (this.selectedConnector) {
      this.selectedConnector.deactivate()
    }
    localStorage.removeItem('cachedConnector')
    this.selectedConnectorId = undefined
  }

  async getAccount () {
    if (this.selectedConnector) {
      return await this.selectedConnector.getAccount()
    } else {
      return null
    }
  }
}
