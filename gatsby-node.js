const fetch = require('node-fetch')

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

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, pluginOptions) => {
  const { createNode } = actions
  const { token } = pluginOptions

  // TODO : create schema here

  let result = []
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
        await getBmcData(data.next_page_url)
      }
    })
  }

  await getBmcData()

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
          type: `BuyMeACoffeeSupporter`,
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
