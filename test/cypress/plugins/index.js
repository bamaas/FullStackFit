/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { spawn } = require('child_process');
const { Client } = require('pg')
const client = new Client()

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    cleanDatabase () {
      const portforward = spawn('kubectl', ['-n', 'test', 'port-forward', 'statefulset/database', '5432:5432', '--insecure-skip-tls-verify']);

      // portforward.stdout.on('data', (data) => {
      //     console.log(`stdout: ${data}`);
      // });

      // portforward.stderr.on('data', (data) => {
      //     console.error(`stderr: ${data}`);
      // });

      // portforward.on('close', (code) => {
      //     console.log(`child process exited with code ${code}`);
      // });
      
      new Promise(r => setTimeout(r, 5000)).then( () => {
        const client = new Client({
          user: 'postgres',
          host: 'localhost',
          database: 'postgres',
          password: 'postgres',
          port: 5432,
        })
        client.connect().then(() => {
          client.query('DELETE FROM public.entry').then(response => {
            client.end().then( () => {
              portforward.kill('SIGHUP')
            })
          })
        })
      });
      return null;
    }
  })
}