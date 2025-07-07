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
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `As a legal AI assistant, generate a comprehensive legal case analysis based on the following information:
          
Title: ${caseData.title}
Case Type: ${caseData.caseType}
Description: ${caseData.description}
Additional Details: ${caseData.additionalDetails || 'None'}

Please provide a complete legal case analysis including:
1. Case Overview
2. Legal Framework and Applicable Laws
3. Key Legal Points
4. Risk Assessment
5. Recommended Actions
6. Timeline and Deadlines

Format the response in markdown with clear sections and professional language.`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
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
  
  const systemPrompt = isFirstMessage 
    ? `You are a professional legal AI assistant. The user has provided initial case information. Ask clarifying questions to gather more details and provide personalized legal guidance. Keep your responses professional but conversational.

Initial Case Information:
Title: ${caseData.title}
Case Type: ${caseData.caseType}
Description: ${caseData.description}

Start by acknowledging their case and ask 2-3 relevant follow-up questions to better understand their situation.`
    : `You are a professional legal AI assistant continuing a conversation about a legal case. Previous conversation:
${conversationText}

User's new message: ${prompt}

Continue the conversation by either asking more clarifying questions or providing legal analysis if you have enough information.`;

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
        maxOutputTokens: 1024,
      }
    }),
  });

  const data = await response.json();
  return {
    content: data.candidates[0].content.parts[0].text,
    isComplete: false,
    mode: 'premium',
    needsMoreInfo: !data.candidates[0].content.parts[0].text.toLowerCase().includes('final analysis') && !data.candidates[0].content.parts[0].text.toLowerCase().includes('conclusion')
  };
}