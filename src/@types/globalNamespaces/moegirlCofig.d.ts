import { CatalogData } from '~/modules/dataCallback'
import { LinkDataMaps } from '~/modules/link'


export = MoegirlConfig

export as namespace __MoegirlConfig

declare namespace MoegirlConfig {
  interface DataCallback {
    catalogData: CatalogData
  }

  interface Link {
    dataMaps: LinkDataMaps
  }
}
