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
const tagify = require('cypress-tags');
const { spawn } = require('child_process');
const { Pool } = require('pg')
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
  port: 5432,
  max: 20,
  idleTimeoutMilis: 30000,
  connectionTimeoutMillis: 2000,
}) 

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {

  config.env.CYPRESS_EXCLUDE_TAGS = 'wip';
  config.env.VIEWPORT = process.env.VIEWPORT;
  on('file:preprocessor', tagify(config));

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {

    'kubectl:forwardDB': (namespace) => {
      spawn('kubectl', ['-n', `${namespace}`, 'port-forward', 'statefulset/database', '5432:5432', '--insecure-skip-tls-verify']);
      return new Promise(r => setTimeout(r, 4000)).then( () => {
        return null;
      });
    },

    'kubectl:kill': () => {
      const pkill = spawn('pkill', ['kubectl']);
      pkill.kill('SIGHUP');
      return null;
    },

    'db:clean': (userId) => {      
        return pool
        .query('DELETE FROM public.entry WHERE user_id = $1', [userId])
        .then(result => {return result.rows;})
    },

    'db:insertEntry': (userId) => {
        const weight = (Math.floor(Math.random() * 99) + 1)
        const note  = Math.random().toString().substr(2, 8);
        return pool
        .query('INSERT INTO public.entry (date, weight, note, user_id) VALUES (CURRENT_TIMESTAMP, $1, $2, $3)', [weight, note, userId])
        .then(() => {
          return {weight, note, userId};
        })
    },

    'db:createpool': () => {
      return new Pool({
            host: 'localhost',
            user: 'postgres',
            password: 'postgres',
            database: 'postgres',
            port: 5432,
            max: 20,
            idleTimeoutMilis: 30000,
            connectionTimeoutMillis: 2000,
          });
    },

    'db:endpool': () => {
      return pool.end().then(() => {return null;});
    },

    'db:getAllEntries': (userId) => {
      return pool
      .query(`SELECT * FROM public.entry WHERE user_id = $1`, [userId])
      .then(result => {return result.rows;})
    },

  })
  return config;
}