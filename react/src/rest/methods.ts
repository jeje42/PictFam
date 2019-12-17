import axios from 'axios'

const root = '/api/';

const loadFromServer = (resource:string, callback: Function) => {
  axios.get('http://' + window.location.host + root + resource)
    .then((res:any) => {
      console.log(res.data._embedded[resource])
      callback(res.data._embedded[resource])
    })
  console.log(window.location.host)
}


export { loadFromServer }
