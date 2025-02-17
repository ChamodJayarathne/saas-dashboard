import { getNotificationServer } from '@/lib/websocket'

export async function POST(req) {
  const server = getNotificationServer()
  const body = await req.json()

  if (server) {
    server.broadcast({
      ...body,
      timestamp: new Date().toISOString()
    })
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  }

  return new Response(JSON.stringify({ error: 'Server not ready' }), { status: 500 })
}