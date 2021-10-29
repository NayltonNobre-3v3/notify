class MonitoringFiles{
  _files={}
  set files(files){
    this._files=files
  }
  get files(){
    return this._files
  }
}

export default new MonitoringFiles()