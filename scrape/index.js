const puppeteer = require('puppeteer')

// const matchSchema = {
//   date: {
//     time: String, // 12:30
//     day: String // 24.02
//   },
//   result: null || String, // null || 23 : 1
//   status: String, // null || 23 : 1
//   event: String, // The International,
//   team_one: {
//     name: String, // NaVi
//     logo: String, // some.ru/image.jpg
//     link: String, // aboutnavi.ru
//     bet: String // 2
//   },
//   team_two: {
//     name: String, // VP
//     logo: String, // some.ru/image2.jpg
//     link: String, // aboutvp.ru
//     bet: String // 3.5
//   },
//   stream_link: String || null // twitch.tv/match_id || null
// }

// TODO: fix timeout error
const getMatches = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto('https://dota2.ru/esport/matches/', {
      waitUntil: 'networkidle2'
    })

    const selector =
      '.esport-match .esport-match-single .team-vs-team .status .score-cup'
    await page.waitForSelector(selector)

    const matchesWithResultArr = await page.$$(selector)
    for (let i = 0; i < matchesWithResultArr.length; i += 1) {
      await page.click(selector)
    }

    const result = await page.evaluate(() => {
      const data = []
      const elements = document.querySelectorAll(
        '.esport-match .esport-match-single .team-vs-team'
      ) // Select all Products
      for (const element of elements) {
        const score = element.querySelector('.status .match-shop-result')
        const live = element.querySelector('.status .live .date .live-phase')
        // const dateTime = element.querySelector('.status .time')
        const date = element.querySelector('.status .time')
        const team_one = element.querySelector('.team-left .name')
        const team_one_logo = element.querySelector('.team-left img')
        const team_two = element.querySelector('.team-right .name')
        const team_two_logo = element.querySelector('.team-right img')
        const event = element.querySelector(
          '.esport-match-single-tournament img'
        )
        const timer = element.querySelector('.esport-match-duration-dynamic')

        const outputObject = {
          score: null,
          team_one: null,
          team_two: null,
          live: null,
          date: null,
          event: null,
          past: false
        }
        if (score) outputObject.score = score.innerHTML
        if (timer) {
          outputObject.timer = timer.innerHTML
        }
        if (team_one)
          outputObject.team_one = {
            name: team_one.innerHTML,
            logo: team_one_logo && team_one_logo.getAttribute('src')
          }
        if (team_two)
          outputObject.team_two = {
            name: team_two.innerHTML,
            logo: team_two_logo && team_two_logo.getAttribute('src')
          }
        if (live) outputObject.live = live.innerHTML
        if (date)
          outputObject.date = date.textContent
            .replace(/[\n\r]+|[\s]{2,}/g, ' ')
            .trim()
        if (!date && !live) outputObject.past = true
        if (event)
          outputObject.event = {
            name: event.getAttribute('data-title-tooltipe'),
            logo: event.getAttribute('src')
          }
        // const team_one = element.querySelector('.team-left .name').innerHTML
        data.push(outputObject)
      }

      return data
    })

    await browser.close()
    return result
  } catch (err) {
    return err
  }
}

module.exports = getMatches
