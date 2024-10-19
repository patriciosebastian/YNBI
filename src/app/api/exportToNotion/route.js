import { Client } from '@notionhq/client'
import { NextResponse } from 'next/server'

const splitContentIntoBlocks = (content, maxLength = 2000) => {
  const paragraphs = content.split('\n\n');
  const blocks = [];

  let currentBlock = '';

  paragraphs.forEach((p) => {
    if (currentBlock.length + p.length > maxLength) {
      currentBlock += p + '\n\n';
    } else {
      blocks.push(currentBlock.trim());
      currentBlock = p + '\n\n';
    }
  });

  if (currentBlock) {
    blocks.push(currentBlock.trim());
  }

  return blocks;
};

export async function POST(req,) {
  console.log('Hit the API route'); //remove this line
  console.log('Request:', req); // remove this line

  const { pageId, accessToken, analysisContent } = await req.json();
  
  console.log('Page Id:', pageId); // remove this line
  console.log('Access Token:', accessToken); // remove this line
  console.log('Analysis Content:', analysisContent); // remove this line

  if (!pageId || !accessToken || !analysisContent) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  console.log('User Page Id:', pageId); // remove this line
  console.log('User Access Token:', accessToken); // remove this line
  console.log('Analysis Content:', analysisContent); // remove this line

  const notion = new Client({ auth: accessToken });

  try {
    const body = await req.json();
    const { analysisContent } = body;

    console.log('Body', body); // remove this line
    console.log('Received analysis content:', analysisContent); // remove this line

    if (!analysisContent) {
      throw new Error('No analysis content provided');
    }

    const contentBlocks = splitContentIntoBlocks(analysisContent);

    const response = await notion.pages.create({
      parent: { page_id: pageId },
      properties: {
        title: [
          {
            text: {
              content: 'Business Idea Analysis',
            },
          },
        ],
      },
      children: contentBlocks.map((block) => ({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: block,
              },
            },
          ],
        },
      }))
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('Error exporting to Notion:', error);
    return NextResponse.json({ error: 'Error exporting to Notion' }, { status: 500 });
  }
}
