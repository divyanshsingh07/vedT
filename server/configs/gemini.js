import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fetch from 'node-fetch';

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Initialize Gemini AI (used only when GROQ_API_KEY is not set)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Helper: call Groq's OpenAI-compatible chat API
const generateWithGroq = async (prompt) => {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      // Use a current Groq model; you can change this string to any
      // supported model name from your Groq dashboard if needed.
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1100,
      temperature: 0.8,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status} ${response.statusText}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  return {
    content,
    usage: data.usage || {},
  };
};

// Fallback content generation function with category-specific content
const generateFallbackContent = (title, category, subtitle = '') => {
  // Category-specific fallback content
  switch (category.toLowerCase()) {
    case 'politics':
    case 'news & politics':
    case 'news and politics':
      return `
        <h2>Introduction</h2>
        <p>Welcome to our analysis of <strong>${title}</strong>. Politics shapes our society, influences policies, and determines the direction of nations. Understanding political dynamics is crucial for informed citizenship.</p>
        
        <h2>Political Context: ${title}</h2>
        <p>${title} represents a significant aspect of political discourse that affects governance, policy-making, and public opinion. Political analysis helps us understand the forces that shape our world.</p>
        
        <h3>Key Political Factors</h3>
        <ul>
          <li><strong>Policy Impact:</strong> How political decisions affect citizens and society</li>
          <li><strong>Public Opinion:</strong> The role of public sentiment in political processes</li>
          <li><strong>Institutional Dynamics:</strong> How political institutions function and interact</li>
          <li><strong>International Relations:</strong> Global political implications and connections</li>
        </ul>
        
        <h2>Why Political Analysis Matters</h2>
        <p>Understanding politics helps citizens make informed decisions, participate effectively in democratic processes, and hold leaders accountable for their actions and policies.</p>
        
        <h2>Conclusion</h2>
        <p>${title} highlights the importance of political awareness and engagement in building a better society. Political literacy is essential for active citizenship and democratic participation.</p>
      `;
      
    case 'geography':
    case 'geopolitics':
      return `
        <h2>Introduction</h2>
        <p>Welcome to our exploration of <strong>${title}</strong>. Geography helps us understand our world, from physical landscapes to human settlements, and their interconnected relationships.</p>
        
        <h2>Geographical Analysis: ${title}</h2>
        <p>${title} represents an important geographical phenomenon that influences climate, ecosystems, human activities, and regional development patterns.</p>
        
        <h3>Geographical Factors</h3>
        <ul>
          <li><strong>Physical Geography:</strong> Landforms, climate, and natural resources</li>
          <li><strong>Human Geography:</strong> Population, settlements, and cultural patterns</li>
          <li><strong>Environmental Impact:</strong> Human-environment interactions and sustainability</li>
          <li><strong>Regional Development:</strong> Economic and social development patterns</li>
        </ul>
        
        <h2>Why Geography Matters</h2>
        <p>Geographical understanding helps us address environmental challenges, plan sustainable development, and appreciate the diversity of our planet.</p>
        
        <h2>Conclusion</h2>
        <p>${title} demonstrates the importance of geographical knowledge in understanding our world and making informed decisions about environmental and developmental issues.</p>
      `;

    case 'education':
      return `
        <h2>Introduction</h2>
        <p>Education plays a defining role in shaping individuals, communities, and entire nations. <strong>${title}</strong>${subtitle ? ` — <em>${subtitle}</em>` : ''} explores a crucial idea within the broader education landscape and what it means for learners, teachers, and policymakers.</p>

        <h2>The Context Behind ${title}</h2>
        <p>Before diving into the details, it's important to understand why this topic matters today. Changing technology, evolving job markets, and new learning models are all transforming how we think about education.</p>

        <h3>Key Themes</h3>
        <ul>
          <li><strong>Access & Equity:</strong> Who gets quality education, and who is left behind?</li>
          <li><strong>Learning Outcomes:</strong> How do we measure what students truly learn and retain?</li>
          <li><strong>Teaching Methods:</strong> From rote learning to experiential and competency-based approaches.</li>
          <li><strong>Technology & Innovation:</strong> The role of digital tools, AI, and online platforms.</li>
        </ul>

        <h2>Deep Dive: ${title}</h2>
        <p>${title} can be understood by looking at how it affects classrooms, institutions, and long-term career paths. Whether it is a policy idea, a teaching method, or a reform model, its impact shows up in the day-to-day learning experience.</p>

        <h3>Impact on Students</h3>
        <p>Students are at the center of any educational change. ${title} influences how they engage with concepts, how motivated they feel, and what skills they ultimately carry into the real world.</p>

        <h3>Impact on Educators</h3>
        <p>For teachers and academic institutions, ${title} can mean rethinking curriculum design, assessment patterns, and classroom practices. It often demands new training, support, and clear communication.</p>

        <h2>Challenges and Opportunities</h2>
        <p>No educational idea is perfect. ${title} brings its own set of challenges — from implementation gaps to resource constraints — but it also opens the door for innovation, collaboration, and student-centered learning.</p>

        <h3>Looking Ahead</h3>
        <p>As education systems evolve, ideas like ${title} will continue to be refined. The real question is how effectively we can align them with real-world needs, local contexts, and long-term learner growth.</p>

        <h2>Conclusion</h2>
        <p>${title} is more than just an academic phrase; it represents a shift in how we think about learning, opportunity, and the future of work. By engaging with it thoughtfully, educators, parents, and students can help shape an education system that is more inclusive, relevant, and future-ready.</p>
      `;

    default:
      return `
        <h2>Introduction</h2>
        <p>Welcome to this deep-dive on <strong>${title}</strong>${subtitle ? ` — <em>${subtitle}</em>` : ''}. In today's rapidly evolving world, understanding key ideas in ${category.toLowerCase()} has become essential for both personal and professional growth.</p>

        <h2>What is ${title}?</h2>
        <p>${title} represents an important concept within the ${category.toLowerCase()} space. It brings together several moving parts — from core principles to real-world applications — that influence how people think, decide, and act.</p>

        <h3>Key Components</h3>
        <ul>
          <li><strong>Core Principles:</strong> The foundational ideas that define ${title}</li>
          <li><strong>Real-World Applications:</strong> Practical scenarios where this concept shows up</li>
          <li><strong>Benefits & Risks:</strong> What can go right, and what can go wrong, if it is misunderstood</li>
          <li><strong>Future Outlook:</strong> How ${title} might evolve over the next few years</li>
        </ul>

        <h2>Why ${title} Matters</h2>
        <p>The impact of ${title} goes beyond theory. It shapes decisions, strategies, and outcomes in the broader ${category.toLowerCase()} ecosystem — from individuals and startups to large institutions.</p>

        <h3>Practical Takeaways</h3>
        <p>If you're exploring ${title} for the first time, the most important step is to connect it with specific problems, use cases, or opportunities in your own context.</p>

        <h2>Getting Started</h2>
        <p>Begin by breaking ${title} into smaller, understandable pieces. Read a mix of foundational material and recent discussions, then experiment with small, low-risk implementations or thought exercises.</p>

        <h3>Suggested Next Steps</h3>
        <ul>
          <li>Identify one real-world example where ${title} is visible today</li>
          <li>Map its benefits and limitations in that scenario</li>
          <li>Note down 2–3 questions you still have about it</li>
          <li>Use those questions to guide further reading or experimentation</li>
        </ul>

        <h2>Conclusion</h2>
        <p>${title} is a powerful lens for understanding change within ${category.toLowerCase()}. By studying it with curiosity and clarity, you can make better decisions, spot new opportunities, and build a stronger perspective on the world around you.</p>
      `;
  }
};

// Function to generate blog content
export const generateBlogContent = async (title, category, subtitle = '') => {
  try {
    if (!GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
      return generateFallbackContent(title, category, subtitle);
    }

    // Category-specific prompts (universal, no external APIs)
    const getCategorySpecificPrompt = (title, category, subtitle) => {
      const basePrompt = `Write a detailed blog post about "${title}" in the ${category} category. 
      
      Requirements:
      - Write in HTML format with proper tags
      - Include an engaging introduction
      - Add 3-4 main sections with headings (h2, h3)
      - Use paragraphs, bullet points, and formatting
      - Make it informative and engaging
      - Include practical tips or insights
      - Write 500-800 words
      - Use proper HTML structure with <p>, <h2>, <h3>, <ul>, <li> tags
      
      Start with: <h2>Introduction</h2>
      
      ${subtitle ? `Subtitle: ${subtitle}` : ''}`;

      // Category-specific enhancements
      switch (category.toLowerCase()) {
        case 'politics':
        case 'news & politics':
        case 'news and politics':
          return `${basePrompt}
          
          POLITICS-SPECIFIC INSTRUCTIONS:
          - Include current political developments, recent elections, or policy changes
          - Reference recent political events, debates, or government decisions
          - Mention current political figures, parties, or movements if relevant
          - Include analysis of recent political trends or changes
          - Add context about current political climate or issues
          - Reference recent political news or developments
          - Include practical insights for political awareness or engagement
          - Mention current political challenges or opportunities
          
          If the title relates to specific political events or figures:
          - Include recent developments or news
          - Provide context about current political situation
          - Reference recent policy changes or decisions
          - Add analysis of political implications`;
          
        case 'geography':
        case 'geopolitics':
          return `${basePrompt}
          
          GEOGRAPHY-SPECIFIC INSTRUCTIONS:
          - Include current geographical developments, climate changes, or environmental issues
          - Reference recent geographical discoveries, research, or studies
          - Mention current environmental challenges or conservation efforts
          - Include recent natural disasters, climate events, or geographical changes
          - Add current population trends, migration patterns, or urban development
          - Reference recent geographical research or scientific findings
          - Include practical insights about geographical awareness or travel
          - Mention current geographical challenges or opportunities
          
          If the title relates to specific locations or geographical phenomena:
          - Include recent developments or changes
          - Provide current geographical data or statistics
          - Reference recent research or studies
          - Add analysis of geographical implications`;
          
        case 'technology':
          return `${basePrompt}
          
          TECHNOLOGY-SPECIFIC INSTRUCTIONS:
          - Include current tech trends, recent innovations, or emerging technologies
          - Reference recent tech news, product launches, or industry developments
          - Mention current tech companies, startups, or industry leaders
          - Include recent technological breakthroughs or research
          - Add current tech challenges, opportunities, or future predictions
          - Reference recent tech events, conferences, or announcements
          - Include practical insights for tech adoption or implementation
          - Mention current tech industry trends or market developments`;
          
        case 'finance':
          return `${basePrompt}
          
          FINANCE-SPECIFIC INSTRUCTIONS:
          - Include current financial trends, market conditions, or economic developments
          - Reference recent financial news, market movements, or economic indicators
          - Mention current financial institutions, companies, or market leaders
          - Include recent financial regulations, policies, or changes
          - Add current investment trends, opportunities, or risks
          - Reference recent financial events, market analysis, or economic reports
          - Include practical financial advice or insights
          - Mention current financial challenges or opportunities`;
          
        case 'startup':
          return `${basePrompt}
          
          STARTUP-SPECIFIC INSTRUCTIONS:
          - Include current startup trends, recent funding rounds, or emerging startups
          - Reference recent startup news, acquisitions, or industry developments
          - Mention current successful startups, entrepreneurs, or industry leaders
          - Include recent startup challenges, opportunities, or market conditions
          - Add current startup ecosystem developments or changes
          - Reference recent startup events, pitch competitions, or accelerators
          - Include practical startup advice or insights
          - Mention current startup funding trends or investment climate`;
          
        case 'lifestyle':
          return `${basePrompt}
          
          LIFESTYLE-SPECIFIC INSTRUCTIONS:
          - Include current lifestyle trends, recent studies, or popular practices
          - Reference recent lifestyle research, health studies, or wellness developments
          - Mention current lifestyle influencers, experts, or thought leaders
          - Include recent lifestyle challenges, opportunities, or changes
          - Add current wellness trends, health practices, or lifestyle innovations
          - Reference recent lifestyle events, conferences, or community developments
          - Include practical lifestyle tips or insights
          - Mention current lifestyle challenges or opportunities`;
          
        default:
          return basePrompt;
      }
    };

    const prompt = getCategorySpecificPrompt(title, category, subtitle);
    // Universal structure and format instructions
    const enhancedPrompt = `${prompt}
    
    IMPORTANT STRUCTURE REQUIREMENTS:
    - Use clear HTML headings and structure:
      <h2>Introduction</h2>
      <h2>Section 1: ...</h2>
      <h3>Subsection</h3>
      ...
      <h2>Conclusion</h2>
    - Keep paragraphs short (2–4 sentences) and scannable.
    - Avoid repeating the title verbatim in every heading.
    - Do NOT include any Markdown syntax, only HTML tags.
    - Make the content informative, engaging, and relevant to the topic and category.`;

    let content = '';
    let usage = {};

    if (GROQ_API_KEY) {
      const groqResult = await generateWithGroq(enhancedPrompt);
      content = groqResult.content;
      usage = groqResult.usage;
    } else {
      // Use explicit generation config to control length and cost
      const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent({
        contents: [{ role: "user", parts: [{ text: enhancedPrompt }] }],
        generationConfig: {
          maxOutputTokens: 1100,   // ~700–800 words, keeps cost under control
          temperature: 0.8,
          topP: 0.9,
          topK: 40,
        },
      });

      const response = await result.response;
      content = response.text();
      usage = response.usageMetadata || {};
    }

    // Safety: if model ignored HTML instructions and returned plain text, wrap in basic HTML
    if (!content.includes('<h2') && !content.includes('<p>')) {
      const escaped = content
        .split('\n\n')
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => `<p>${p}</p>`)
        .join('\n');
      return `<h2>Introduction</h2>\n${escaped}`;
    }

    return content;
  } catch (error) {
    console.error('AI content generation error:', error.message);
    return generateFallbackContent(title, category, subtitle);
    return generateFallbackContent(title, category, subtitle);
  }
};

export default generateBlogContent;