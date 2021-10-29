import { readAllDirs } from "../../../../shared/utils/readAndOrganizeFiles"
import { AlertLoop } from "./MonitoringLoop"
import {NotificationService} from './NotificationService'


const alertLoop=new AlertLoop(NotificationService,readAllDirs)
export {alertLoop}