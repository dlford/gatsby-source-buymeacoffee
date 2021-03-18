# gatsby-source-buymeacoffee

**This package is still in development, things may change while I get things optimized, it is usable but not well tested at this point.**

A Gatsby source plugin for sourcing data into your Gatsby application from the BuyMeACoffee.com public API.

This plugin creates `BuyMeACoffeeSupporter` nodes from your BuyMeACoffee supporters, but it will omit any supporters that have chosen to make their contribution private, to respect their privacy.

*Note: Currently this plugin only fetches the `supporters` API endpoint, please open an issue or submit a pull request if you'd like to add other endpoints.*

## When do I use this plugin

Use this plugin to thank your supporters by adding their display name and/or comments to your application.

## Install

`npm install gatsby-source-buymeacoffee`

## How to use

You'll need an access token for the API, you can get that here: [https://developers.buymeacoffee.com/dashboard](https://developers.buymeacoffee.com/dashboard).

**Note: It is not recommended to keep your API key in a git repository, even if it is private!** It is best to use an environment variable, if you aren't familiar with using environment variables with Gatsby more information can be found at [https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/).

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-buymeacoffee`,
      options: {
        token: `YOUR_BMC_API_ACCESS_TOKEN`, // Replace this with your token
      },
    },
  ]
}
```

## How to query

```graphql
query {
  allBuyMeACoffeeSupporter {
    edges {
      node {
        id
        payer_email
        payer_name
        payment_platform
        referer
        support_coffee_price
        support_coffees
        support_created_on
        support_currency
        support_email
        support_id
        support_note
        support_updated_on
        supporter_name
        transaction_id
      }
    }
  }  
}
```

## Example usage

Here is an example component that creates an unsorted list of supporter names.

*Note: The data in the public API seems to be a bit fragmented, seems as if they've changed key names but haven't migrated the data from the old keys, so we are checking for both `payer_name` and `supporter_name` because the data may be in either key.

```js
import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

const SUPPORTERS_QUERY = graphql`
  query SUPPORTERS_QUERY {
    allBuyMeACoffeeSupporter {
      edges {
        node {
          payer_name
          supporter_name
        }
      }
    }
  }
`

export default function SupportersComponent() {
  const data = useStaticQuery(SUPPORTERS_QUERY)
  const supporters = data?.allBuyMeACoffeeSupporter?.edges
  return (
    <ul>
      {supporters.map(({ node }, idx) => {
        const name = node.supporter_name || node.payer_name
        if (name) {
          // We add idx to the key in case the same
          // person supported twice.
          return <li key={name+idx}>{name}</li>
        }
      })}
    </ul>
  )
}
```

## Local development

- Clone this repository and `cd` into it's directory: `sudo npm link`
- Create or cd into an existing Gatsby project: `npm link gatsby-source-buymeacoffee`
- Configure `gatsby-config.js` as above and start the project: `npm run develop`

### Clean up local development

- Remove this plugin from your Gatsby project: `npm uninstall --no-save gatsby-source-buymeacoffee && npm install`
- Remove the global link: `sudo npm uninstall -g gatsby-source-buymeacoffee`

## How to contribute

Submit your issue or pull request at [https://github.com/dlford/gatsby-source-buymeacoffee](https://github.com/dlford/gatsby-source-buymeacoffee).
