# Running javascript sdk for Siren Investigate

## Setup

Produce the sdk in kibi-internal typing:
`yarn sdk`

This will generate an sdk in a temp folder just outside of kibi-internal

Open that folder and run:
`npm i`

This will install node packages and create the distribution folder

## Running
### No security
* Turn off access control and change elasticsearch.url to http in the Investigate yml
* Start investigate
* Adjust the Openapi require path in `src/javascript/no_security.js`
* Open a terminal in this repository and execute:
`npm run nossl`
* A child and root search should have been created
#### With security
* Turn on access control and change elasticsearch.url to https in the Investigate yml
* Start investigate
* Adjust the Openapi require path in `src/javascript/with_security_with_ssl_with_basepath.js`
* Adjust the base path to the one used in the current dev. mode
* Open a terminal in this repository and execute:
`npm run ssl`
* A child and root search should have been created
