import { baseurl } from '../config/settings'
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

    if (options.withToken !== false) {
        try {
            const value = await AsyncStorage.getItem('JWTToken')
            if (value !== null) {
                headers['Authorization'] = 'Bearer ' + value
            }
        } catch (error) {
        }
    }
    if(options.headers) {
        for(let header in options.headers) {
            headers[header] = options.headers[header]
        }
    }

    if (method === 'GET' && options.data) {
        // let query = Object.entries(options.data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(options.data[k]))
        //   .join('&')
        let query = encodeQueryData(options.data)

        if (url.indexOf('?') > -1) {
            url = url + '&' + query
        } else {
            url = url + '?' + query
        }
    }

    let body = null;
    if(options.files === true) {
        headers['Content-Type'] = 'multipart/form-data';
        body = options.data
    }else{
        body = JSON.stringify(options.data)
    }

    console.log({
        baseurl: baseurl + '/api',
        url: url,
        headers: headers,
        method: method,
        body: method === 'POST' ? body : undefined,
    });

    fetch(baseurl + '/api' + url, {
        method: method,
        headers: headers,
        body: method === 'POST' ? body : undefined,
    })
      .then(response => {
          if (url.indexOf('refresh-token') > -1 && response.headers.map['authorization']) {
              let token = response.headers.map['authorization'].replace('Bearer ', '')
              AsyncStorage.setItem('JWTToken', token)
              // console.log('set JWTToken', token)
          }
          if (response.headers.map['token']) {
              AsyncStorage.setItem('JWTToken', response.headers.map['token'])
              // console.log('set JWTToken', response.headers.map['token'])
          }
          httpCode = response.status
          return response.json()
      })
      .then(function (response) {
          console.log(response, httpCode)
          if (response.error === 'token_invalid') {
              AsyncStorage.removeItem('JWTToken')
              AuthStoreContext._currentValue.logout()
          }
          if (response.blocked) {
              AsyncStorage.removeItem('JWTToken')
              AuthStoreContext._currentValue.logout()
              NotificationsStoreContext._currentValue.addNotification({
                  title: response.message,
                  description: 'Contact support to reactivate your account.',
                  type: 'error'
              })
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
              if (!options.noAlertSystem && [400, 422].indexOf(httpCode) > -1) {
                  if (httpCode === 422) {
                      if (typeof response === 'object') {
                          if (typeof response.errors !== 'undefined') {
                              for (var key in response.errors) {
                                  NotificationsStoreContext._currentValue.addNotification({
                                      title: 'Error',
                                      description: response.errors[key],
                                      type: 'error'
                                  })
                              }
                          }else{
                              for (var key in response) {
                                  NotificationsStoreContext._currentValue.addNotification({
                                      title: 'Error',
                                      description: response.error,
                                      type: 'error'
                                  })
                              }
                          }
                      }
                  } else if (response.message) {
                      NotificationsStoreContext._currentValue.addNotification({
                          title: 'Error',
                          description: response.message,
                          type: 'error'
                      })
                  } else if (response.error) {
                      NotificationsStoreContext._currentValue.addNotification({
                          title: 'Error',
                          description: response.error,
                          type: 'error'
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
          console.log(response)
          if (response.error === 'token_invalid') {
              AsyncStorage.removeItem('JWTToken')
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
          if (!options.noAlertSystem && [400, 422].indexOf(httpCode) > -1) {
              if (response.message) {
                  NotificationsStoreContext._currentValue.addNotification({
                      title: 'Error',
                      description: response.message,
                      type: 'error'
                  })
              }
              if (response.errors) {
                  response.errors.map(error => {
                      NotificationsStoreContext._currentValue.addNotification({
                          title: 'Error',
                          description: error,
                          type: 'error'
                      })
                  })
              }
          }
      })
}
