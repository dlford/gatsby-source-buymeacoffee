# Gatsby Source BuyMeACoffee

**THIS PACKAGE IS IN DEVELOPMENT, USE IT AT YOUR OWN PERIL!**

*Note: Currently this plugin only supports the `supporters` API endpoint, please open an issue or submit a pull request if you'd like to add other endpoints.*

## How to Use

`gatsby-config.js`

```js
{

  ...

  plugins: [
    {
      resolve: `gatsby-source-buymeacoffee`,
      options: {
        token: `YOUR_BMC_API_ACCESS_TOKEN`,
      },
    },

    ...

  ]

  ...

}
```

## Development

Clone this repository and `cd` into it's directory
`sudo npm link`
Create or cd into an existing Gatsby project
`npm link gatsby-source-buymeacoffee`
Configure `gatsby-config.js` and start the project
`npm run develop`

To clean up, remove this plugin from your Gatsby project
`npm uninstall --no-save gatsby-source-buymeacoffee && npm install`
Remove the global link
`sudo npm uninstall -g gatsby-source-buymeacoffee`
