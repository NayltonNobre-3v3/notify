import { readAllDirs } from "../../../../shared/utils/readAndOrganizeFiles"
import { AlertLoop } from "./MonitoringLoop"
import {AlertUseCase} from './AlertUseCase'


const alertLoop=new AlertLoop(AlertUseCase,readAllDirs)
export {alertLoop}