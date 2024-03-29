const fetch = require('node-fetch')

const supporterTypeName = `BuyMeACoffeeSupporter`

exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
   token: Joi.string()
      .required()
      .description(`Access token for BuyMeACoffee.com public API.`)
      .messages({
        token: `"token" is required to access BuyMeACoffee.com API`
      }),
  })
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type ${supporterTypeName} implements Node @dontInfer {
      support_id: Int!
      support_note: String
      support_coffees: Int!
      transaction_id: String!
      support_visibility: Int
      support_created_on(locale: String): String!
      support_updated_on(locale: String): String!
      supporter_name: String
      support_coffee_price: String!
      support_email: String
      support_currency: String!
      referer: String
      country: String
      support_hidden: Int
      payer_email: String!
      payment_platform: String!
      payer_name: String
    }
  `
  createTypes(typeDefs)
}

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, cache }, pluginOptions) => {
  const cacheKey = 'gatsby-source-buymeacoffee'
  const { createNode } = actions
  const { token } = pluginOptions

  // Fetch data
  let result = []
  let success = true
  async function getBmcData(url) {
    return fetch(url || 'https://developers.buymeacoffee.com/api/v1/supporters', {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json())
      .then(async (data) => {
      const payload = data.data
      if (payload) {
        result = [...result, ...payload]
      }
      if (data.next_page_url) {
        // Pause for rate limiter
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve()
          }, 10000)
        })
        await getBmcData(data.next_page_url)
      }
    })
  }

  await getBmcData().catch((e) => {
    console.error(`Failed to fetch BuyMeACoffee data, falling back to cached data`)
    console.error(e)
    success = false
  })

  // Load cache if request failed, otherwise update cache
  if (success) {
    await cache.set(cacheKey, result)
  } else {
    result = await cache.get(cacheKey)
  }

  if (result) {
    for (entry of result) {
      // Respect supporters privacy
      if (
        entry.support_hidden !== 1 &&
        entry.support_visibility !== 0
      ) {
        const nodeContent = JSON.stringify(entry)
        const nodeMeta = {
          id: createNodeId(`bmc-${entry.support_id}`),
          parent: null,
          children: [],
          internal: {
            type: supporterTypeName,
            mediaType: `text/html`,
            content: nodeContent,
            contentDigest: createContentDigest(entry),
          },
        }
        const node = Object.assign({}, entry, nodeMeta)
        createNode(node)
      }
    }
  }
}
