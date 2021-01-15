// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
import { ProjectConfig } from '~/interfaces/index'

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ProjectConfig {

    }
  }

  interface Window {
    onewallet?: any;
    harmony?: any;
  }
}
