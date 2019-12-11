import * as when from 'when'

import * as client from './client'
import * as follow from './follow'

const root: string = '/api';

// 'employees'
const loadFromServer = (resource:string, pageSize: number, callback: Function) => {
  follow(client, root, [
      {rel: resource, params: {size: pageSize}}]
  ).then((employeeCollection: any) => {
      return client({
        method: 'GET',
        path: employeeCollection.entity._links.profile.href,
        headers: {'Accept': 'application/schema+json'}
      }).then((schema: any) => {
        // this.schema = schema.entity;
        // this.links = employeeCollection.entity._links;
        console.log('employeeCollection')
        console.log(employeeCollection)
        return employeeCollection;
      });
  }).then((employeeCollection: any) => {
    // this.page = employeeCollection.entity.page;
    return employeeCollection.entity._embedded[resource].map((employee: any) =>
        client({
          method: 'GET',
          path: employee._links.self.href
        })
    );
  }).then((employeePromises: any) => {
    return when.all(employeePromises);
  }).done((listResults: any) => {
    callback(listResults)
  });
}


export { loadFromServer }
