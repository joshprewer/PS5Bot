import Nexmo from 'nexmo'

export function sendSms (message: string) {
  const nexmo = new Nexmo({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
  })

  const from = 'PS5Bot'
  const to = process.env.PHONE_NUMBER

  nexmo.message.sendSms(from, to, message, {}, (err, responseData) => {
    if (err) {
      console.log(err)
    } else {
      if (responseData.messages[0].status === '0') {
        console.log('Message sent successfully.')
      } else {
        console.log(
          `Message failed with error: ${responseData.messages[0].status}`
        )
      }
    }
  })
}
