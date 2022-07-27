export interface CatalogData {
  level: number
  id: string
  name: string
}

export default () => {
  if (moegirl.dataCallbacks.catalog) {
    const catalogData = $('.mw-headline').toArray()
      .map(el => ({
        level: parseInt($(el).parent('h1, h2, h3, h4, h5, h6').get(0).tagName[1]),
        id: $(el).attr('id')!,
        name: $(el).text()
      }))
  
    moegirl.dataCallbacks.catalog(catalogData)
  }
}