import requests
from requests.auth import HTTPBasicAuth
import json
import os
from time import sleep

with open('/mnt/config.json') as f:
  config = json.load(f)

success = False
for attempt in range(20):
    try:
        r = requests.get(config['settingsEndpoint'], verify=False, auth=HTTPBasicAuth(config['username'], config['password']))
        r.raise_for_status()
        data = r.json()
        data = data['data']
        success = True
        break
    except:
        print('error')
        sleep (5)

if success != True:
    raise Exception('My error')

# general
data['app.root_url'] = 'https://' + config['ingressHost']
data['app.logo_url'] = 'https://' + config['ingressHost'] + '/public/static/logo.png'
data['app.from_email'] = config['general']['defaultFromEmail']

# smtp
data['smtp'][0]['host'] = config['smtp']['host']
data['smtp'][0]['port'] = int(config['smtp']['port'])
data['smtp'][0]['username'] = config['smtp']['username']
data['smtp'][0]['password'] = config['smtp']['password']
data['smtp'][0]['tls_enabled'] = bool(config['smtp']['tlsEnabled'])
data['smtp'][0]['tls_skip_verify'] = bool(config['smtp']['skipTlsVerification'])
data['smtp'][0]['auth_protocol'] = config['smtp']['authProtocol']
data = json.dumps(data)

r = requests.put(   
                url=config['settingsEndpoint'], 
                headers={'Content-type': 'application/json'}, 
                data=data, 
                verify=False, 
                auth=HTTPBasicAuth(config['username'], config['password'])
                )

r.raise_for_status()