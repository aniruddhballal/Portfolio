/**
 * Re-authorizes the Strava app with the scopes required by fetch-strava.ts.
 *
 * Usage:
 *   npm run strava:auth
 *
 * Set STRAVA_REDIRECT_URI in .env.local if your Strava app uses something
 * other than http://localhost.
 */

/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '../.env.local')

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
}

const clientId = process.env.STRAVA_CLIENT_ID
const clientSecret = process.env.STRAVA_CLIENT_SECRET
const redirectUri = process.env.STRAVA_REDIRECT_URI || 'http://localhost'

if (!clientId || !clientSecret) {
  throw new Error('Missing STRAVA_CLIENT_ID or STRAVA_CLIENT_SECRET in .env.local')
}

const authUrl = new URL('https://www.strava.com/oauth/authorize')
authUrl.searchParams.set('client_id', clientId)
authUrl.searchParams.set('response_type', 'code')
authUrl.searchParams.set('redirect_uri', redirectUri)
authUrl.searchParams.set('approval_prompt', 'force')
authUrl.searchParams.set('scope', 'read,activity:read_all')

console.log('\nOpen this URL in your browser and approve access:\n')
console.log(authUrl.toString())
console.log('\nAfter approval, paste the full redirected URL (or just its code):')

const prompt = readline.createInterface({ input: process.stdin, output: process.stdout })
const input = await prompt.question('> ')
prompt.close()
const answer = input.trim()
let code = answer
let callbackScope = ''

try {
  const callbackUrl = new URL(answer)
  code = callbackUrl.searchParams.get('code') || ''
  callbackScope = callbackUrl.searchParams.get('scope') || ''
} catch {
  // The user pasted the authorization code instead of the full callback URL.
}

if (!code) throw new Error('No authorization code was found.')

const res = await fetch('https://www.strava.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
  }),
})
const data = await res.json() as {
  refresh_token?: string
  scope?: string
  error?: string
  message?: string
}

if (!res.ok || !data.refresh_token) {
  throw new Error(`Authorization failed: ${data.error || data.message || `${res.status} ${res.statusText}`}`)
}

const scope = data.scope || callbackScope
if (!scope.split(/[ ,]+/).includes('activity:read') && !scope.split(/[ ,]+/).includes('activity:read_all')) {
  throw new Error(`Authorization succeeded, but activity read access was not granted. Granted scopes: ${scope || 'unknown'}`)
}

const current = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : ''
const tokenLine = `STRAVA_REFRESH_TOKEN=${data.refresh_token}`
const tokenPattern = /^STRAVA_REFRESH_TOKEN=.*$/m
const next = tokenPattern.test(current)
  ? current.replace(tokenPattern, tokenLine)
  : `${current}${current.endsWith('\n') || !current ? '' : '\n'}${tokenLine}\n`
fs.writeFileSync(envPath, next)

console.log(`\n✅ Saved the new refresh token to .env.local`)
console.log(`Granted scopes: ${scope || 'not returned by Strava'}`)
