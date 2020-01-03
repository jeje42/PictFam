import axios from 'axios'

const root = '/api/';

const loadFromDefaultApiServer = (resource:string, callback: Function) => {
  axios.get('http://' + window.location.host + root + resource)
    .then((res:any) => {
      callback(res.data._embedded[resource])
    })
}

const loadFromCustomApiServer = (resource:string, callback: Function) => {
  axios.get('http://' + window.location.host + '/' + resource)
    .then((res:any) => {
      callback(res.data)
    })
}


export { loadFromDefaultApiServer, loadFromCustomApiServer }
