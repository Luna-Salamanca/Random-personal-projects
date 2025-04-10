// /src/app/api/appeals/submit/route.js
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const session = await getIronSession(request, new Response(), sessionOptions);
  
  if (!session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Verify the user is submitting their own appeal
    if (data.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Send to Discord webhook
    const response = await fetch(process.env.APPEAL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [{
          title: ' New Ban Appeal',
          color: 0xFF0000,
          fields: [
            {
              name: 'User',
              value: `${data.username} (${data.userId})`,
              inline: true
            },
            {
              name: 'Reason for Ban',
              value: data.reason || 'Not specified',
              inline: true
            },
            {
              name: 'Appeal Message',
              value: data.appeal
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Ban Appeal System'
          }
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send to webhook');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Appeal submission error:', error);
    return new Response('Failed to submit appeal', { status: 500 });
  }
}
