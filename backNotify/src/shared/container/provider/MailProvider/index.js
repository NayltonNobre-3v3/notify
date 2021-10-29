import {GmailProvider} from './implementations/GmailProvider'

const mailProvider={
    gmail:new GmailProvider()
}

export default mailProvider['gmail']