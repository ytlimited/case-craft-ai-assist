import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, mode, conversationHistory, caseData } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    let response;
    
    if (mode === 'premium') {
      // Premium mode: Interactive chatbot style
      response = await generateInteractiveResponse(prompt, conversationHistory, caseData, geminiApiKey);
    } else {
      // Free/Basic mode: Simple one-time generation
      response = await generateSimpleResponse(prompt, caseData, geminiApiKey);
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-case-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateSimpleResponse(prompt: string, caseData: any, apiKey: string) {
  // Extract case details from description for Free/Basic users
  const description = caseData.description || prompt;
  
  const systemPrompt = `You are a professional legal AI assistant specializing in case analysis. Analyze the following legal case and provide a comprehensive report.

CASE DETAILS:
${description}

ANALYSIS REQUIREMENTS:
Provide a detailed legal case analysis with the following structure:

## CASE OVERVIEW
- Brief summary of the case
- Primary legal issues identified
- Parties involved

## LEGAL FRAMEWORK
- Applicable laws and regulations
- Relevant statutes and precedents
- Jurisdiction considerations

## KEY LEGAL POINTS
- Strengths of the case
- Potential weaknesses or challenges
- Critical evidence requirements

## RISK ASSESSMENT
- Likelihood of success
- Potential outcomes
- Financial implications

## RECOMMENDED ACTIONS
- Immediate steps to take
- Evidence to gather
- Legal strategies to consider

## TIMELINE & DEADLINES
- Statute of limitations considerations
- Key milestones and deadlines
- Recommended timing for actions

IMPORTANT: Keep analysis professional, balanced, and practical. Always recommend consulting with a qualified attorney for specific legal advice.

Format your response clearly with proper headings and bullet points where appropriate.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: systemPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 3072,
      }
    }),
  });

  const data = await response.json();
  return {
    content: data.candidates[0].content.parts[0].text,
    isComplete: true,
    mode: 'simple'
  };
}

async function generateInteractiveResponse(prompt: string, conversationHistory: any[], caseData: any, apiKey: string) {
  const isFirstMessage = conversationHistory.length === 0;
  
  let conversationText = '';
  conversationHistory.forEach(msg => {
    conversationText += `${msg.role}: ${msg.content}\n`;
  });
  
  // Check if user is trying to discuss a new case
  const isNewCaseAttempt = prompt && (
    prompt.toLowerCase().includes('new case') ||
    prompt.toLowerCase().includes('different case') ||
    prompt.toLowerCase().includes('another case') ||
    (conversationHistory.length > 5 && prompt.length > 200 && !prompt.toLowerCase().includes('regarding') && !prompt.toLowerCase().includes('about this case'))
  );
  
  if (isNewCaseAttempt && conversationHistory.length > 0) {
    return {
      content: `I notice you might be wanting to discuss a new legal case. To ensure I provide the best analysis, I can only handle one case per conversation session.

If you'd like to analyze a different case, please start a new chat session. This helps me:
- Focus on your specific case details
- Maintain context and accuracy
- Provide personalized legal guidance
- Keep our conversation organized

Would you like me to continue helping with your current case, or would you prefer to start fresh with a new case in a new session?`,
      isComplete: false,
      mode: 'premium',
      needsMoreInfo: true
    };
  }
  
  const systemPrompt = isFirstMessage 
    ? `You are an elite legal AI consultant providing premium interactive legal guidance. You specialize in in-depth case analysis through intelligent questioning and personalized advice.

CASE INFORMATION:
Title: ${caseData.title || 'Not specified'}
Case Type: ${caseData.caseType || 'Not specified'}
Description: ${caseData.description}

YOUR APPROACH:
1. Acknowledge their case professionally
2. Ask 2-3 targeted, intelligent questions to gather critical details
3. Focus on the most important aspects that will impact their legal strategy
4. Keep responses conversational but professional
5. Build toward a comprehensive analysis

Ask strategic questions about:
- Timeline and deadlines
- Evidence and documentation
- Parties involved and their positions
- Specific outcomes they're seeking
- Budget and practical constraints
- Previous legal actions taken

Start with a warm acknowledgment and then ask your most important questions.`
    : `You are an elite legal AI consultant continuing an interactive session. 

PREVIOUS CONVERSATION:
${conversationText}

CURRENT USER MESSAGE: "${prompt}"

YOUR APPROACH:
- If you have sufficient information, provide comprehensive legal analysis
- If more details are needed, ask 1-2 focused follow-up questions
- Always maintain context of the original case
- Provide actionable, practical advice
- Keep responses professional yet conversational
- Focus on helping them achieve their goals

IMPORTANT: Only discuss the original case. If they mention new cases, politely redirect them to start a new session.

Continue the conversation naturally, building on what you already know.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: systemPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1536,
      }
    }),
  });

  const data = await response.json();
  const responseText = data.candidates[0].content.parts[0].text;
  
  // Determine if this is a complete analysis
  const isComplete = responseText.toLowerCase().includes('comprehensive analysis') || 
                    responseText.toLowerCase().includes('final recommendation') ||
                    responseText.toLowerCase().includes('conclusion') ||
                    responseText.toLowerCase().includes('in summary') ||
                    (responseText.length > 1000 && conversationHistory.length > 4);
  
  return {
    content: responseText,
    isComplete,
    mode: 'premium',
    needsMoreInfo: !isComplete
  };
}