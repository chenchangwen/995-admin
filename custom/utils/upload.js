//  图片最大宽度
const MAX_WIDTH = 1080

/**
 * base64压缩（图片-canvas互转）
 * @param {file} base64 base64图片数据
 * @return {base64} data 图片处理完成后的base64
 */
export const compress = (base64) => {
    let cvs = document.createElement('canvas')
    let img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    return new Promise((resolve, reject) => {
        img.src = base64
        // 图片偏移值
        let offetX = 0
        img.onload = () => {
            if (img.width > MAX_WIDTH) {
                cvs.width = MAX_WIDTH
                cvs.height = img.height * MAX_WIDTH / img.width
                offetX = (img.width - MAX_WIDTH) / 2
            } else {
                cvs.width = img.width
                cvs.height = img.height
            }
            let ctx = cvs.getContext("2d").drawImage(img, 0, 0, cvs.width, cvs.height)
            let imageData = cvs.toDataURL()
            resolve(imageData)
        }
    })
}


/**
 * base64转文件流
 * @param {base64} base64数据
 * @param {string} format格式
 * @return {file}  文件blob
 */
export const convertBase64UrlToBlob = (base64, mimeType) => {
    let bytes = window.atob(base64.split(',')[1])
    let ab = new ArrayBuffer(bytes.length)
    let ia = new Uint8Array(ab)
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
    }
    let _blob = new Blob([ab], { type: mimeType })
    return _blob
}
