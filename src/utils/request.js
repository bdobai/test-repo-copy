import { baseurl, vendor } from '../config/settings'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { AuthStoreContext, NotificationsStoreContext } from '_stores'

let allowRefresh = true

// function buildFormData(data, parentKey, formData) {
//     if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
//         Object.keys(data).forEach(key => {
//             buildFormData(data[key], parentKey ? `${parentKey}[${key}]` : key, formData);
//         });
//     } else {
//         const value = data == null ? '' : data;
//         formData.append(parentKey, value);
//     }
// }
// function jsonToFormData(data) {
//     let formData = new FormData();
//     buildFormData(data, null, formData);
//
//     return formData
// }

function encodeQueryData(data) {
    const ret = [];
    for (let d in data) {
        if (typeof data[d] === 'object' || typeof data[d] === 'array') {
            for (let arrD in data[d]) {
                ret.push(`${encodeURIComponent(d)}[]=${encodeURIComponent(data[d][arrD])}`)
            }
        } else if (typeof data[d] === 'null' || typeof data[d] === 'undefined') {
            ret.push(encodeURIComponent(d))
        } else {
            ret.push(`${encodeURIComponent(d)}=${encodeURIComponent(data[d])}`)
        }

    }
    return ret.join('&');
}

export async function request (url, options) {
    let method = options.method || 'POST'
    let httpCode
    let initial_url = JSON.parse(JSON.stringify(url))
    let initial_options = options

    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
    }

    if(options.headers) {
        for(let header in options.headers) {
            headers[header] = options.headers[header]
        }
    }
    if (options.withToken) {
        options.data.vendor = vendor;
    }

    if (options.withToken !== false) {
        try {
            const value = await AsyncStorage.getItem('session_key')
            if (value !== null) {
                if (url.indexOf('?') > -1) {
                    if(!options.sesionIdentifier) {
                        url = url + '&session_key=' + value
                    }else{
                        url = url + '&session_identifier=' + value
                    }
                } else {
                    if(!options.sesionIdentifier) {
                        url = url + '?session_key=' + value
                    }else{
                        url = url + '?session_identifier=' + value
                    }
                }
            }
        } catch (error) {

        }
    }else{
        options.data.vendor = vendor;
    }

    if (method === 'GET' && options.data) {
        // let query = Object.entries(options.data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(options.data[k]))
        //   .join('&')

        let query = encodeQueryData(options.data);

        if (url.indexOf('?') > -1) {
            url = url + '&' + query
        } else {
            url = url + '?' + query
        }
    }

    let body = null;
    if (options.files === true) {
        headers['Content-Type'] = 'multipart/form-data';
        body = options.data
    } else {
        body = JSON.stringify(options.data)
    }

    console.log({
        baseurl: baseurl,
        url: url,
        headers: headers,
        method: method,
        body: method !== 'GET' ? body : undefined,
    });

    fetch(baseurl + url, {
        method: method,
        headers: headers,
        body: method !== 'GET' ? body : undefined,
    })
      .then(response => {
          // if (url.indexOf('refresh-token') > -1 && response.headers.map['authorization']) {
          //     let token = response.headers.map['authorization'].replace('Bearer ', '')
          //     AsyncStorage.setItem('session_key', token)
          // }
          // if (response.headers.map['token']) {
          //     AsyncStorage.setItem('session_key', response.headers.map['token'])
          // }
          httpCode = response.status
          if(options.withoutJson) return response;
          return response.json()
      })
      .then(function (response) {
          console.log(response, httpCode)
          if (response.error === 'token_invalid') {
              AsyncStorage.removeItem('session_key')
              AuthStoreContext._currentValue.logout()
          }
          if (httpCode === 401 && (response.message === 'token_expired')) {
              if(allowRefresh) {
                  allowRefresh = false
                  return request('/auth/refresh-token', {
                      method: 'GET',
                      success: function () {
                          allowRefresh = true
                          // console.log(initial_options)
                          request(initial_url, initial_options)
                      },
                      error: function (error) {
                          allowRefresh = false
                          AuthStoreContext._currentValue.logout()
                          options.error(error)
                      }
                  })
              }else{
                  return;
              }
          }
          if (httpCode >= 200 && httpCode < 300) {
              if (!options.noAlertSystem) {
                  if (response.messages) {
                      response.messages.map(message => {
                          NotificationsStoreContext._currentValue.addNotification({
                              title: 'Success',
                              description: message,
                              type: 'success'
                          })
                      })
                  } else if (response.message) {
                      NotificationsStoreContext._currentValue.addNotification({
                          title: 'Success',
                          description: response.message,
                          type: 'success'
                      })
                  }
              }
              if (options.success) {
                  options.success(response)
              }
          } else {
              if (!options.noAlertSystem) {
                 if (response.message) {
                      NotificationsStoreContext._currentValue.addNotification({
                          title: 'Error',
                          description: response.message,
                          type: 'error'
                      })
                  } else if (response.error) {
                     response.error.errors.forEach(error => {
                         NotificationsStoreContext._currentValue.addNotification({
                             title: 'Error',
                             description: error.message,
                             type: 'error'
                         })
                     })
                  } else if (typeof response === 'object') {
                      for (var key in response) {
                          if (response.hasOwnProperty(key)) {
                              if (response.error) {
                                  response[key].map(error => {
                                      NotificationsStoreContext._currentValue.addNotification({
                                          title: '',
                                          description: error,
                                          type: 'error'
                                      })
                                  })
                              }

                          }
                      }
                  }
              }
              if (options.error) {
                  options.error(response)
              }
          }
          //     if (httpCode === 503) {
          //         stores.store.changeMaintenance(true)
          //     } else {
          //         stores.store.changeMaintenance(false)
          //     }
      })
      .catch((response) => {
          console.log('catch', response)
          if (response.error === 'token_invalid') {
              AsyncStorage.removeItem('session_key')
              AuthStoreContext._currentValue.logout()
          }
          if (httpCode === 401 && (response.message === 'token_expired')) {
              if (allowRefresh) {
                  allowRefresh = false

                  return request('/auth/refresh-token', {
                      method: 'GET',
                      success: function () {
                          allowRefresh = true;
                          console.log(initial_url, initial_options)
                          request(initial_url, initial_options)
                      },
                      error: function (error) {
                          allowRefresh = false
                          AuthStoreContext._currentValue.logout()
                      }
                  })
              }else{
                  return
              }
          }
          if (options.error) {
              options.error(response)
          }
          if (!options.noAlertSystem) {
              if (response.error) {
                  response.error.errors.forEach(error => {
                      NotificationsStoreContext._currentValue.addNotification({
                          title: 'Error',
                          description: error.message,
                          type: 'error'
                      })
                  })
              }
          }
      })
}
