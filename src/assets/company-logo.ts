/**
 * 公司 Logo 資源
 * 萬里遊科技股份有限公司
 */

// Logo 圖片路徑
import logoImage from '@/logo/愛放學CIS-15(長).png'

export const companyLogo = logoImage

// 公司資訊
export const companyInfo = {
  name: '萬里遊科技股份有限公司',
  nameEn: 'WanliYou Technology Co., Ltd.',
  website: 'https://ifunschool.com',
  slogan: '讓學習更有趣',
  copyright: `© ${new Date().getFullYear()} 萬里遊科技股份有限公司`,
}

/**
 * 將圖片轉為 base64
 * 用於 PDF 嵌入
 */
export async function getLogoBase64(): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Cannot get canvas context'))
        return
      }
      ctx.drawImage(img, 0, 0)
      const dataURL = canvas.toDataURL('image/png')
      resolve(dataURL)
    }
    img.onerror = () => reject(new Error('Failed to load logo image'))
    img.src = logoImage
  })
}
