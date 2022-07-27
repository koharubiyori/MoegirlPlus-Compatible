interface Window {
  $: JQueryStatic
  moegirl: Moegirl
}

declare const moegirl: Moegirl

declare interface Moegirl {
  data: {
    site: 'moegirl' | 'hmoe'
    mainUrl: string
    imageSiteUrl: string
  }
  hooks: {
    onLoaded?(): void
    onLinkClicked?(payload: { type: keyof __MoegirlConfig.Link['dataMaps'], data: any }): void
  }
  method: {
    anchor: {
      goto(anchorName: string, offset?: number): void
      getPosition(anchorName: string): number
    }
  }
  dataCallbacks: {
    catalog(data: __MoegirlConfig.DataCallback['catalogData'][]): void
  }
}