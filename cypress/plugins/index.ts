/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.ts can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)


import * as fs from "fs";
import * as http from "http";

let server: http.Server;
/**
 * @type {Cypress.PluginConfig}
 */
export default (on: any, config: any) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    on('task', {
        mockServer({interceptUrl, fixture}) {

            if (server) server.close();       // close any previous instance

            const url = new URL(interceptUrl)
            server = http.createServer((req, res) => {
                if (req.url === url.pathname) {
                    const data = fs.readFileSync(`./cypress/fixtures/${fixture}`)
                    res.end(data)
                } else {
                    res.end()
                }
            })

            server.listen(url.port)
            console.log(`listening at port ${url.port}`)

            return null
        }
    })
}
