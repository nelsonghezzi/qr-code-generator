const qr = require('qr-image')

/**
 * Generates a @returns {Response} with
 * a QR image encoded in PNG
 * @param {Request} request
 */
const generate = async request => {
  let text

  try {
    const jsonContent = await request.json()
    text = jsonContent.text
  } catch (e) {}

  const qrImage = qr.imageSync(text || 'Empty content')

  const headers = { 'Content-Type': 'image/png' }
  return new Response(qrImage, { status: 200, headers })
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with a QR image or 405 Method Not Allowed
 * @param {Request} request
 */
async function handleRequest(request) {
  let response

  if (request.method === 'POST') {
    response = await generate(request)
  } else {
    const headers = { Allow: 'POST' }
    response = new Response('Expected POST', { status: 405, headers })
  }

  return response
}
