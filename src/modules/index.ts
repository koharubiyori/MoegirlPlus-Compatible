window.moegirl = {
  hooks: window.moegirl?.hooks ?? {},
  data: window.moegirl?.data ?? {
    site: 'moegirl',
    mainUrl: 'https://mzh.moegirl.cn.org',
    imageSiteUrl: 'https://mzh.moegirl.cn.org'
  },
  method: window.moegirl?.method ?? {},
  dataCallbacks: window.moegirl?.dataCallbacks ?? {}
}


const requireCtx = (require as any).context('.', true, /index\.[tj]s/)
const modules: Function[] = requireCtx.keys()
  // 排除：以下划线开头、at开头、非二级目录、不是index的文件
  .filter((key: string) => /^\.\/[^_@][^\/]+?\/index\.[tj]s$/.test(key))
  .map((key: string) => requireCtx(key).default)

export default modules