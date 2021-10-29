import {GmailProvider} from './implementations/GmailProvider'
import {EtherealProvider} from './implementations/EtherealProvider'

const mailProvider={
    gmail:new GmailProvider(),
    ethereal:new EtherealProvider()
}

export default mailProvider[process.env.MAIL_PROVIDER]