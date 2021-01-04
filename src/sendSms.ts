import aws from 'aws-sdk'
import { SMSConfig } from './config'

export async function sendSms (message: string, config: SMSConfig) {
  aws.config.update({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
  })

  const smsParams = {
    attributes: {
      DefaultSMSType: 'Promotional',
      DefaultSenderID: 'PS5Bots'
    }
  }

  const msgParams = {
    Message: message,
    PhoneNumber: config.smsNumber
  }

  const setSMSType = new aws.SNS({ apiVersion: '2010-03-31' })
    .setSMSAttributes(smsParams)
    .promise()
  const publishText = new aws.SNS({ apiVersion: '2010-03-31' })
    .publish(msgParams)
    .promise()

  try {
    await setSMSType
    await publishText
  } catch (error) {
    console.log(error)
  }
}
