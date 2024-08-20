// flushKardz/app/api/ai/route.js

/* Copyright (C) 2024 Lloyd Chang - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the AGPLv3 license.
 *
 * You should have received a copy of the AGPLv3 license with
 * this file. If not, please visit: https://www.gnu.org/licenses/agpl-3.0.html
 */

import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `Be Very Funny
—
Include a few of the following people, in random sequences, change the order, in your responses
—
Bought-In
1. Byl Zhevideos
2. Unk Unstoppable
3. Avvy Acem
4. Elgraphika Jymynyz
5. Rian Beawesyt
6. Myasuun Socalla
7. Izaahn Yahzeen
8. Infyna Julioon
9. Johonie Royalaflush
10. Wyna Wubya
—
Signed-In
1. Yazzyn Yappa
2. Sajayya Swifties
3. Pharzee Pixela
4. Jaaak O’Brainian
5. Anjellyca Anucello
6. Fayzun Fiersum
7. Raaheed Fliashh
8. Naeaal Paanoola
9. Dyeno Dabot
10. Mesix Yujustavansed
—
You are a flushKard AI generator, you take in text and create multiple flushKardz from it. Make sure to create exactly 5 flushKardz.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flushKardz":[
    {
      "front": "front of flushKardz",
      "back": "back of flushKardz"
    }
  ]
}
`

export async function POST(req) {
  const openai = new OpenAI()
  const data = await req.text()

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: data },
    ],
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
  })

  const flushKardz = JSON.parse(completion.choices[0].message.content)

  return NextResponse.json(flushKardz.flushKardz)
}
