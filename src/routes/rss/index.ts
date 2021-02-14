import * as RSS from 'rss'
import Post, { PostPublicFields } from '../../models/Post'
import Router = require('koa-router')

const router = new Router()

router.get(
  '/',
  async (ctx): Promise<void> => {
    const feed = new RSS({
      title: 'BDBB',
      description: '천안불당고등학교 대나무숲',
      pubDate: new Date(),
      feed_url: 'https://i.bulind.space/rss',
      site_url: 'https://bulind.space'
    })

    const posts = await Post.getList()
    const recentPosts = posts.map(
      (post): PostPublicFields => post.getPublicFields()
    )
    recentPosts.forEach((post): void => {
      const paragraphs = post.content
        .split('\n')
        .map((v): string => (v != null ? `<p>${replaceLtGt(v)}</p>` : ''))
      let content = ''
      paragraphs.forEach((p): void => {
        content += p
      })
      const publishedDate = new Date(post.createdAt)
      feed.item({
        title: post.title ?? '',
        url: `https://bulind.space/post/${post.number as number}`,
        description: post.tag,
        date: publishedDate,
        guid: post.id.toString(),
        custom_elements: [
          { link: `https://bulind.space/post/${post.number as number}` },
          {
            'content:encoded': `
            <!doctype html>
            <html>
              <head>
                <meta charset="utf-8">
              </head>
              <body>
                <article>
                  <header>
                    <h1>#${post.number ?? '?'}번_제보</h1>
                    ${
                      post.title != null
                        ? `<h2>${replaceLtGt(post.title)}</h2>`
                        : ''
                    }
                    <h3 class="op-kicker">${post.tag}</h3>
                    <figure><img src="https://i.bulind.space/thumbnail/${
                      post.number as number
                    }.jpeg" /></figure>
                    <time class="op-published" datetime=${publishedDate.toISOString()}>
                      ${timeText(publishedDate)}
                    </time>
                  </header>
                  ${content}
                </article>
              </body>
            </html>`
          }
        ]
      })
    })
    ctx.type = 'text/xml'
    ctx.status = 200
    ctx.body = feed.xml()
  }
)

const replaceLtGt = (text: string): string => {
  return text.replace('<', '&lt;').replace('>', '&gt;')
}

const timeText = (date: Date): string => {
  let hours = date.getUTCHours() + 9
  if (hours > 23) hours -= 24
  let text = `${date.getFullYear()}년 ${date.getMonth()}월 ${date.getDate()}일 `
  if (hours < 6) text += '새벽'
  else if (hours < 11) text += '아침'
  else if (hours < 14) text += '점심'
  else if (hours < 15) text += '오후'
  else if (hours < 20) text += '저녁'
  else if (hours < 24) text += '밤'
  return text
}

export default router
