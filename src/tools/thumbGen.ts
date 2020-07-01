import { createCanvas, loadImage, registerFont } from 'canvas'
import { createWriteStream } from 'fs'
import { Post } from '../models/Post'

const color = {
  white: 'white',
  black: 'black',
  primary: 'rgb(203, 231, 181)',
  primaryDark: 'rgb(136, 152, 120)'
}

const getTitleSize = (text: string): number => {
  if (text.length < 11) return 100
  else if (text.length < 16) return 70
  else return 55
}

export async function generateThumbnail(post: Post): Promise<void> {
  try {
    registerFont('assets/NanumBarunpenBold.ttf', {
      family: 'NanumBarunpenBold'
    })

    const canvas = createCanvas(1200, 630)

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = color.white
    ctx.fillRect(0, 0, 1200, 630)

    ctx.lineWidth = 30
    ctx.strokeStyle = color.primaryDark

    ctx.strokeRect(0, 0, 1200, 630)

    ctx.font = `20px "NanumBarunpenBold"`
    ctx.fillStyle = color.primaryDark

    ctx.fillText('불\n대\n숲', 40, 50)

    ctx.fillStyle = color.primary
    ctx.fillText('당고\n나무', 57, 50)

    const number = post.number ?? 'null'

    ctx.textAlign = 'end'
    ctx.fillStyle = color.primaryDark
    ctx.fillText(`#${number}번_제보`, 1160, 50)
    ctx.fillText(`#${post.tag}`, 1160, 80)
    ctx.fillText('https://bamboo.buldang.xyz', 1160, 590)

    const title = post.title

    ctx.font = `${getTitleSize(title)}px "NanumBarunpenBold"`
    ctx.textAlign = 'center'

    ctx.lineWidth = 0
    ctx.strokeStyle = color.primaryDark
    ctx.strokeText(title, 730, 330)

    ctx.fillStyle = color.primary
    ctx.fillText(title, 730, 330)

    const out = createWriteStream(`thumbnail/${number}.jpeg`)
    const stream = canvas.createJPEGStream({ quality: 1 })

    stream.pipe(out)
    out.on('finish', () => console.log('The JPEG file was created.'))
    out.on('error', (err) => console.log(err))
  } catch (err) {
    console.log(err)
  }
}