import qs from 'qs'
import animateScrollTo from 'animated-scroll-to'

export interface LinkDataMaps {
  article: {
    pageName: string
    displayTitle: string
    anchor: string
  }
  img: {
    images: {
      title: string
      fileName: string
      currentThumbUrl?: string
      maxThumbUrl?: string
    }[]
    clickedIndex: number
  }
  note: {
    id: string
    html: string
  }
  anchor: {
    id: string
  }
  notExist: {
    pageName: string
  }

  edit: {
    pageName: string
    section: 'new' | number
  }
  notExistEdit: {
    pageName: string
  }
  watch: {
    pageName: string
  }
  external: {
    url: string
  }
  externalImg: {
    url: string
  }
  unparsed: {
    [key: string]: string
  }
}

const moegirlDomainRegex = /^https:\/\/m?zh\.moegirl\.org\.cn/
const hmoeDomainRegex = /^https:\/\/www\.hmoegirl\.com/

moegirl.method.anchor = {
  goto(anchorName: string, offset = 0) {
    animateScrollTo($(document.getElementById(anchorName)!).offset()!.top + offset, {
      maxDuration: 400
    })
  },

  getPosition(anchorName: string) {
    return $(document.getElementById(anchorName)!).offset()!.top
  }
}

// 链接处理
export default () => {
  const triggerOnClick = <T extends keyof LinkDataMaps>(type: T, data: LinkDataMaps[T]) => moegirl.hooks.onLinkClicked?.({ type, data })
  
  $('a').each((_, el) => el.addEventListener('click', e => {
    aTagClickHandler.call(el, e)
  }, true))
    
  function aTagClickHandler(this: HTMLElement, e: any) {
    e.preventDefault()
    e.stopImmediatePropagation()
    if (/^javascript:/.test($(this).attr('href')!)) { return }
  
    let link = ($(e.target).attr('href') || $(e.target).parent('a').attr('href') || $(this).attr('href'))!
    link = decodeURIComponent(link)

    // 判断是否为萌百内链
    const usingDomainRegex = moegirl.data.site === 'moegirl' ? moegirlDomainRegex : hmoeDomainRegex
    if (usingDomainRegex.test(link) || ['/', '#'].includes(link[0])) {
      link = link.replace(usingDomainRegex, '')
      
      // 判断是请求index.php的链接还是条目名的链接
      if (!/^\/index\.php\?/.test(link)) {
        const [pageName, anchor] = link.replace(/^\//, '').split('#')

        // 图片
        if (/^(File|文件):/.test(pageName)) {
          // 判断是否为画廊
          const isInGallery = $(this).parents('.gallery')
          if (isInGallery.length !== 0) {
            const gallery = isInGallery.eq(0)
            const galleryImages: LinkDataMaps['img']['images'] = []

            gallery.find('.gallerybox').each((index, item) => {
              const imageHref = $(item).find('.image').attr('href')
              if (imageHref) {
                const imageFileName = decodeURIComponent($(item).find('.image').attr('href')!).match(/(File|文件):(.+)$/)!![2]
                const imgTag = $(this).find('img')
                galleryImages.push({
                  fileName: imageFileName,
                  title: $(item).find('.gallerytext').text().trim(),
                  currentThumbUrl: imgTag.attr('src'),
                  maxThumbUrl: getMwMaxThumbUrlByImgTag(imageFileName, imgTag)
                })
              }
            })

            const clickedImageName = pageName.replace(/^(File|文件):/, '')
            const clickedIndex = galleryImages.findIndex(item => item.fileName === clickedImageName)
            
            return triggerOnClick('img', { 
              images: galleryImages.map(item => ({ 
                ...item, 
                fileName: item.fileName.replace(/_/g, ' ')
              })),
              clickedIndex
            })
          }

          const isThumbImage = $(this).parents('.thumb')
          let imageTitle = ''
          if (isThumbImage.length != 0) {
            imageTitle = isThumbImage.find('.thumbcaption').text()
          }

          const imgTag = $(this).find('img')
          const imgFileName = pageName.replace(/^(File|文件):/, '').replace(/_/g, ' ').trim()
          return triggerOnClick('img', { 
            images: [{
              fileName: imgFileName,
              title: imageTitle,
              currentThumbUrl: imgTag.attr('src'),
              maxThumbUrl: getMwMaxThumbUrlByImgTag(imgFileName, imgTag)
            }],
            clickedIndex: 0
          })
        }

        if (pageName === '' && /^cite_note-/.test(anchor)) {
          const html = $('#' + anchor).find('.reference-text').html()
          return triggerOnClick('note', { id: anchor, html })
        }

        if (pageName === '' && anchor) {
          return triggerOnClick('anchor', { id: anchor })
        }

        if ($(this).hasClass('new')) {
          return triggerOnClick('notExist', { pageName: link })
        }

        // 条目
        let displayTitle = (
          $(e.target).attr('title') || 
          $(e.target).find('> img').eq(0).attr('alt') ||
          $(e.target).parent('a').attr('title') || 
          $(this).attr('title') ||
          $(this).find('> img').eq(0).attr('alt')
        )!
        return triggerOnClick('article', { pageName, displayTitle, anchor })
      } else {
        const params: any = qs.parse(link.replace(/^\/index\.php\?/, ''))

        // 编辑页
        if (params.action === 'edit') {
          if ($(this).hasClass('new')) {
            return triggerOnClick('notExist', { pageName: params.title })
          }
          
          return triggerOnClick('edit', {
            pageName: params.title,
            section: params.section,
            ...(params.preload && { preload: params.preload })
          })
        }

        // 添加到监视列表
        if (params.action === 'watch') {
          return triggerOnClick('watch', { pageName: params.title })
        }

        return triggerOnClick('unparsed', params)
      }
    } else {
      triggerOnClick('external', { url: link })
    }
  }
  
  // $('a').each((_, el) => el.replaceWith(el.cloneNode(true)))
  // $('a').on('click', function(e) {
    
  // })

  // 给外链图片添加点击显示大图
  $('img:not([data-file-width][data-file-height])').on('click', function() {
    // 有的外链图片会有作为a标签内容的情况，这里直接返回防止一次触发两种点击事件(a标签跳转和查看外链图片)
    if ($(this).parents('a').length > 0) { return }
    triggerOnClick('externalImg', { url: $(this).attr('src')! })
  })
}

function getMwMaxThumbUrlByImgTag(imageFileName: string, imgJel: JQuery): string {
  const imageMaxWidth = parseInt(imgJel.data('file-width'))
  const imageDisplayWidth = parseInt(imgJel.attr('width')!!)

  let newImageWidth = imageDisplayWidth * window.devicePixelRatio
  if (newImageWidth >= imageMaxWidth) newImageWidth = imageMaxWidth - 1

  const newLink = `${moegirl.data.imageSiteUrl}/thumb.php?f=${imageFileName}&width=${newImageWidth}`
  return newLink
}