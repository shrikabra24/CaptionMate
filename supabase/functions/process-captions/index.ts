import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const CATEGORIES = [
  'Travel',
  'Gym/Fitness',
  'Love/Romantic',
  'Wedding',
  'Friends',
  'Food',
  'Fashion',
  'Nature',
  'Daily Life',
  'Aesthetic/Minimal',
  'Funny/Sarcastic',
  'Motivational/Quotes',
  'Bollywood',
  'Hollywood',
  'Color',
  'Cringe'
];

function hasDevanagariScript(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

function hasUrduHindiWords(text: string): boolean {
  const hindiUrduWords = /\b(hai|hain|ho|hu|ka|ki|ke|ko|se|me|mein|pe|par|aur|ya|kya|kyun|kaise|kab|kaha|kaun|jo|jis|jiski|jisko|tum|tumhare|tumse|tumko|tumhe|tumhi|mera|meri|mere|tera|teri|tere|uska|uski|uske|dil|pyaar|mohabbat|zindagi|jeena|marna|duniya|zamana|aasman|dharti|paani|hawa|sooraj|chaand|sitara|sitaare|raat|din|sapna|khwaab|yaad|yaadein|khushi|dukh|dard|gham|aansu|aasu|muskaan|muskurahat|hasna|rona|dekhna|dekha|dekhe|sunna|kehna|kehte|bolna|sochna|samajhna|samjhna|jaana|aana|chalna|chalkar|chalte|rukna|milna|mil|bichharna|pyaar|ishq|mohabbat|dosti|yaar|yaari|dost|dostana|saathi|humsafar|dilbar|mehboob|sanam|jaan|janeman|dilruba|saiyyan|meri|teri|hamari|tumhari|kuch|koi|sabhi|sab|har|ek|do|teen|bahut|thoda|jyada|kam|bhi|toh|phir|ab|kabhi|hamesha|yaha|waha|kaha|idhar|udhar|andar|bahar|upar|niche|aage|pichhe|saath|bina|bhi|nahi|na|haan|ji|achha|acha|bura|khubsurat|haseen|pyaara|pyaari|cute|jaan|bada|badi|chhota|chhoti|naya|nayi|purana|purani|khoobsurat|zulm|insaaf|waqt|samay|pal|lamha|umr|baar|safar|musafir|raasta|rasta|manzil|kinara|dil|rooh|jaan|man|dimaag|zehn|yaad|fikr|gham|sukoon|tasalli|aitbaar|yakeen|bharosa|shak|khauf|dar|himmat|hausla|jazba|junoon|tamanna|khwahish|armaan|hasrat|aarzo|umeed|intezaar|talaash|justaju|koshish|mehnat|qurbani|faisla|irada|niyyat|kadam|raah|chaal|yeh|woh|ye|vo|hoon|tha|thi|the|kiya|liye|liya|bankar|banke|jaane|jaate|chahiye|chahta|chahte|chahti|karne|karna|karke|karke|hoga|hogi|hoge|nai|nahin|laga|lage|lagi|lagte|gaya|gayi|gaye|huye|hua|huyi|raha|rahi|rahe|laaye|laayega|laayegi|laayenge|waale|waali|waala|wala|wali)\b/gi;
  return hindiUrduWords.test(text);
}

function hasPunjabiWords(text: string): boolean {
  const punjabiWords = /\b(jatt|jatti|gabru|kudi|kudiya|saadi|saanu|veere|yaar|yaari|rabb|rabba|rab|wagah|vadde|vaddiya|gallan|gall|pind|pindan|punjab|punjabi|desi|dil|pyaar|ishq|mohabbat|tainu|tenu|menu|mainu|ohdi|ohda|fer|hun|kithe|kidre|jaawan|labban|chhaanva|ve|mundiya|munde|munda|sohneya|sohni|sohna|lagda|lagdi|lagde|hoya|hoyi|hoye|aaja|aao|chal|chalo|karde|kardi|karke|ohnu|usnu|tuhanu|sanu|billo|rani|patola|gaddi|yaara|yaariya|bolde|boldi|kehnde|sochde|sochdi|hasde|hasdi|ronde|rondi|peeke|pike|daaru|sharab|theka|nachdi|nachde|bhangra|gidha)\b/gi;
  return punjabiWords.test(text);
}

function isMotivationalQuote(text: string): boolean {
  const lower = text.toLowerCase();
  
  const motivationalPatterns = [
    /\b(always|never|must|should|will|can|could|would|don't|doesn't|won't|can't)\b/,
    /\b(success|failure|win|lose|fight|battle|struggle|overcome|conquer|achieve|accomplish)\b/,
    /\b(life|death|living|dying|alive|dead|survive|survival)\b.*\b(lesson|teach|learn|wisdom|truth|reality)\b/,
    /\b(way|path|journey|road|destination|goal|dream|vision|purpose|meaning)\b/,
    /\b(change|grow|evolve|transform|improve|better|worse|progress)\b/,
    /\b(brave|courage|fear|strong|weak|power|strength)\b/,
    /\b(wise|wisdom|fool|foolish|smart|intelligent|genius)\b/,
    /\b(you|we|people|person|human|man|men|woman|women)\b.*\b(should|must|need|have to|ought to)\b/,
  ];
  
  const philosophicalPhrases = [
    'depends on', 'governed by', 'decided by', 'determined by',
    'more than', 'less than', 'better than', 'worse than',
    'before', 'after', 'until', 'unless', 'without',
    'the one who', 'those who', 'people who', 'anyone who',
    'not about', 'it\'s about', 'all about',
    'matter', 'important', 'remember', 'forget', 'understand',
  ];
  
  let score = 0;
  
  for (const pattern of motivationalPatterns) {
    if (pattern.test(lower)) score++;
  }
  
  for (const phrase of philosophicalPhrases) {
    if (lower.includes(phrase)) score++;
  }
  
  if (text.length > 80) score++;
  if (/[.!?].*[.!?]/.test(text)) score++;
  if (/^[A-Z]/.test(text) && /[.!]$/.test(text)) score++;
  
  return score >= 2;
}

function isSongLyricOrMovieReference(text: string): boolean {
  const lower = text.toLowerCase();
  
  const movieShowReferences = [
    'suits', 'emily in paris', 'game of thrones', 'breaking bad',
    'friends', 'office', 'stranger things', 'harry potter',
    'avengers', 'marvel', 'dc', 'batman', 'superman',
  ];
  
  for (const ref of movieShowReferences) {
    if (lower.includes(ref)) return true;
  }
  
  if (/~|—|–/.test(text)) return true;
  
  if (/(from|by|in) [A-Z][a-z]+ [A-Z][a-z]+/.test(text)) return true;
  
  const lyricPatterns = [
    /\.\.\.[A-Z]/,
    /cause|coz|'cause/i,
    /\blike (it's|its) [a-z]+/i,
    /make (her|him|it|them) [a-z]+ (fall|rise|shine)/i,
  ];
  
  for (const pattern of lyricPatterns) {
    if (pattern.test(text)) return true;
  }
  
  return false;
}

function isHumorOrWordplay(text: string): boolean {
  const lower = text.toLowerCase();
  
  const humorIndicators = [
    'lol', 'lmao', 'haha', 'lmfao', 'rofl',
    'joke', 'funny', 'hilarious', 'comedy',
  ];
  
  for (const indicator of humorIndicators) {
    if (lower.includes(indicator)) return true;
  }
  
  const punPatterns = [
    /don't [a-z]+ a [a-z]+ by its [a-z]+/,
    /[a-z]+ in (piece|peace)/i,
    /[a-z]+[<>][a-z]+/,
  ];
  
  for (const pattern of punPatterns) {
    if (pattern.test(text)) return true;
  }
  
  if (/\bpenis\b|\bporn\b|\bcrotch\b|\bchut\b|\bgaand\b/i.test(text)) return true;
  
  const funnyComparisons = [
    /life is (like )?[a-z]+ and i('m| am) [a-z]+/i,
    /[a-z]+ is [a-z]+ until [a-z]+/i,
  ];
  
  for (const pattern of funnyComparisons) {
    if (pattern.test(text)) return true;
  }
  
  return false;
}

function categorizeCaption(caption: string): string {
  const lower = caption.toLowerCase();
  const hasIndianLanguage = hasDevanagariScript(caption) || hasUrduHindiWords(caption);
  const isPunjabi = hasPunjabiWords(caption);
  
  if (isHumorOrWordplay(caption)) {
    return 'Funny/Sarcastic';
  }
  
  if (isSongLyricOrMovieReference(caption)) {
    if (hasIndianLanguage || isPunjabi) {
      return 'Bollywood';
    }
    return 'Hollywood';
  }
  
  if (hasIndianLanguage || isPunjabi) {
    if (/\b(mohabbat|pyaar|ishq|dil|dilbar|dilruba|tum|tumhare|tumse|tera|teri|tere|mera|meri|mere|sanam|jaan|janeman|chaand|sitara|aankhon|aankho|naina|nain|palkon|saiyyan|mehboob|humsafar|rishta|milna|bichharna|yaad|intezaar|fursat|nazare|nazron|chehra|muskurahat|kasoor|rooh|parinda|seene|band aankhon)\b/gi.test(caption)) {
      return 'Love/Romantic';
    }
    if (/\b(yaar|yaari|dost|dostana|saheli|apna|bhai|behen|saath|gang|squad|mitr|yaara|yaariya)\b/gi.test(caption)) {
      return 'Friends';
    }
    if (/\b(safar|musafir|raasta|rasta|manzil|parinde|aasman|zameen|beach|pahaad|samandar|kinara|bhatakte|ghumna)\b/gi.test(caption)) {
      return 'Travel';
    }
    if (/\b(hausla|himmat|jazba|junoon|sapna|sapne|khwaab|khwabon|kamyabi|jeet|haar|mehnat|koshish|taaqat|zindagi|jeena|marna|jang|ladna|qismat|kismat)\b/gi.test(caption)) {
      return 'Motivational/Quotes';
    }
    if (/\b(gym|workout|kasrat|body|muscle|training)\b/gi.test(caption)) {
      return 'Gym/Fitness';
    }
    if (/\b(shaadi|dulhan|dulha|wedding|married|marriage)\b/gi.test(caption)) {
      return 'Wedding';
    }
    if (/\b(khana|khaana|roti|chai|coffee|khane|pina)\b/gi.test(caption)) {
      return 'Food';
    }
    if (/\b(rang|color|colour|laal|neela|peela|hara|gulabi|safed|kala)\b/gi.test(caption)) {
      return 'Color';
    }
    if (/\b(suraj|chaand|sitara|sitaare|aasman|dharti|pahaad|samandar|nadi|jungle|hawa|hawayein|purvai|ret|raat|sham|subah|dhoop)\b/gi.test(caption) && !/\b(dil|pyaar|mohabbat|ishq)\b/gi.test(caption)) {
      return 'Nature';
    }
    return 'Bollywood';
  }
  
  if (isMotivationalQuote(caption)) {
    return 'Motivational/Quotes';
  }
  
  if (/\b(gym|workout|fitness|muscle|gains|sweat|cardio|lift|lifting|training|exercise|bodybuilding|protein|abs|squat|deadlift|diet|health|reps|sets)\b/.test(lower)) {
    return 'Gym/Fitness';
  }
  
  if (/\b(wedding|bride|groom|married|marriage|marry|ceremony|vows|honeymoon|engagement|ring|proposal)\b/.test(lower)) {
    return 'Wedding';
  }
  
  if (/\b(love|loved|loving|heart|hearts|romantic|romance|babe|baby|boyfriend|girlfriend|couple|couples|relationship|relationships|crush|crushes|soulmate|together|forever|valentine|dating|date|dates|kiss|kisses|hug|hugs|sweetheart|darling|bae|lover|lovers|beloved|partner)\b/.test(lower) || /❤️|💕|💖|💗|💓|💞|💝|💘/.test(caption)) {
    if (!/(friend|squad|crew|bestie)/i.test(caption)) {
      return 'Love/Romantic';
    }
  }
  
  if (/\b(waiting|wait|dawn|dusk|hello|goodbye|young|first saw|maid|together|favorite)\b/.test(lower) && caption.length < 80) {
    return 'Love/Romantic';
  }
  
  if (/\b(friend|friends|friendship|squad|crew|bestie|besties|homie|homies|bro|bros|sis|sister|brother|gang|buddies|buddy|mate|mates|pal|pals|amigo|companion|companions)\b/.test(lower)) {
    return 'Friends';
  }
  
  if (/\b(food|foods|eat|eating|hungry|hunger|delicious|yummy|tasty|taste|meal|meals|dinner|lunch|breakfast|brunch|cooking|cook|chef|chefs|restaurant|restaurants|pizza|burger|burgers|foodie|foodies|cuisine|recipe|recipes|dish|dishes)\b/.test(lower)) {
    return 'Food';
  }
  
  if (/\b(fashion|style|styles|outfit|outfits|dress|dresses|clothes|clothing|ootd|shopping|shop|trendy|trend|trends|designer|designers|shoes|shoe|accessories|accessory|runway|chic|elegant|elegance|wardrobe)\b/.test(lower)) {
    return 'Fashion';
  }
  
  if (/\b(travel|traveling|travelled|trip|trips|vacation|vacations|explore|exploring|explored|adventure|adventures|wanderlust|journey|journeys|destination|destinations|flight|flights|hotel|hotels|passport|passports|beach|beaches|mountain|mountains|ocean|oceans|sea|seas|island|islands|road trip|abroad|tour|tours|backpack|backpacking)\b/.test(lower)) {
    return 'Travel';
  }
  
  if (/\b(nature|natural|tree|trees|forest|forests|wildlife|wild|green|greens|earth|plant|plants|flower|flowers|garden|gardens|outdoor|outdoors|sunset|sunsets|sunrise|sunrises|valley|valleys|river|rivers|lake|lakes|pond|ponds)\b/.test(lower)) {
    return 'Nature';
  }
  
  if (/\b(red|blue|green|yellow|pink|purple|orange|violet|indigo|black|white|brown|gray|grey|color|colors|colour|colours|vibrant|bright|hue|hues|shade|shades|colorful|colourful)\b/.test(lower)) {
    return 'Color';
  }
  
  if (/\b(cringe|cringy|awkward|embarrass|embarrassing|embarrassed|weird|strange|uncomfortable)\b/.test(lower)) {
    return 'Cringe';
  }
  
  if (/\b(minimal|minimalist|minimalism|aesthetic|aesthetics|vibe|vibes|mood|moods|simple|simplicity|clean|zen|art|artistic|artist|arts)\b/.test(lower)) {
    return 'Aesthetic/Minimal';
  }
  
  return 'Daily Life';
}

function determineTone(caption: string): string {
  const lower = caption.toLowerCase();

  if (isHumorOrWordplay(caption) || /\b(lol|lmao|haha|funny|joke|laugh)\b/.test(lower) || /😂|🤣/.test(caption)) {
    return 'funny';
  }
  if (isMotivationalQuote(caption) || /\b(motivation|motivate|inspire|inspired|inspiration|success|dream|believe|hustle|grind|achieve|overcome|perseverance)\b/.test(lower)) {
    return 'motivational';
  }
  if (/\b(love|heart|romantic|pyaar|mohabbat|ishq)\b/.test(lower) || /❤️|💕|💖/.test(caption)) {
    return 'romantic';
  }
  if (/\b(bold|fierce|strong|powerful|badass|confident|attitude|savage)\b/.test(lower)) {
    return 'bold';
  }
  if (/\b(aesthetic|vibe|mood|minimal|zen|chill|peaceful|calm)\b/.test(lower)) {
    return 'aesthetic';
  }
  if (/\b(travel|adventure|explore|wanderlust|journey|safar)\b/.test(lower)) {
    return 'travel';
  }
  if (/\b(wisdom|wise|philosophical|philosophy|deep|thoughtful|reflective|introspective)\b/.test(lower) || caption.length > 120) {
    return 'thoughtful';
  }
  if (/\b(sarcasm|sarcastic|irony|ironic)\b/.test(lower)) {
    return 'sarcastic';
  }

  return 'casual';
}

function extractTags(caption: string, category: string): string[] {
  const tags: string[] = [];
  const lower = caption.toLowerCase();
  const words = lower.match(/\b\w+\b/g) || [];

  const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'my', 'your', 'this', 'that', 'from', 'can', 'will', 'not', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'am', 'be', 'being'];
  const meaningfulWords = words.filter(word => word.length > 3 && !stopWords.includes(word));

  const commonTags: Record<string, string[]> = {
    'Travel': ['vacation', 'explore', 'adventure', 'wanderlust', 'journey'],
    'Gym/Fitness': ['workout', 'fitness', 'training', 'gains', 'health'],
    'Love/Romantic': ['love', 'romantic', 'relationship', 'heart', 'together'],
    'Wedding': ['wedding', 'married', 'celebration', 'bride', 'groom'],
    'Friends': ['friendship', 'squad', 'friends', 'besties', 'memories'],
    'Food': ['foodie', 'delicious', 'yummy', 'tasty', 'cooking'],
    'Fashion': ['style', 'fashion', 'outfit', 'ootd', 'trendy'],
    'Nature': ['nature', 'outdoor', 'green', 'earth', 'beauty'],
    'Daily Life': ['life', 'lifestyle', 'daily', 'vibes', 'mood'],
    'Aesthetic/Minimal': ['aesthetic', 'minimal', 'vibe', 'art', 'mood'],
    'Funny/Sarcastic': ['funny', 'humor', 'comedy', 'sarcastic', 'witty'],
    'Motivational/Quotes': ['motivation', 'inspiration', 'success', 'goals', 'wisdom'],
    'Bollywood': ['bollywood', 'desi', 'hindi', 'india', 'quote'],
    'Hollywood': ['hollywood', 'movie', 'cinema', 'quote', 'film'],
    'Color': ['colorful', 'vibrant', 'bright', 'colors', 'beautiful'],
    'Cringe': ['cringe', 'awkward', 'funny', 'weird', 'uncomfortable']
  };

  if (commonTags[category]) {
    tags.push(...commonTags[category].slice(0, 2));
  }

  for (const word of meaningfulWords) {
    if (tags.length >= 5) break;
    if (!tags.includes(word) && word.length > 4) {
      tags.push(word);
    }
  }

  return tags.slice(0, 5);
}

function cleanCaption(caption: string): string {
  return caption
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { captions } = await req.json();

    if (!captions || typeof captions !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid input. Please provide captions as a string.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const captionLines = captions
      .split('\n')
      .map(line => cleanCaption(line))
      .filter(line => line.length > 0);

    const uniqueCaptions = [...new Set(captionLines)];

    const { data: existingCaptions } = await supabase
      .from('captions')
      .select('caption_text');

    const existingSet = new Set(
      (existingCaptions || []).map(c => cleanCaption(c.caption_text))
    );

    const newCaptions = uniqueCaptions.filter(caption => !existingSet.has(caption));

    const processedCaptions = newCaptions.map(caption => {
      const category = categorizeCaption(caption);
      const tone = determineTone(caption);
      const tags = extractTags(caption, category);

      return {
        caption_text: caption,
        category,
        tone,
        tags,
        used_count: 0,
      };
    });

    if (processedCaptions.length > 0) {
      const { error: insertError } = await supabase
        .from('captions')
        .insert(processedCaptions);

      if (insertError) {
        console.error('Insert error:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to insert captions into database.' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        processed: processedCaptions.length,
        duplicates: captionLines.length - newCaptions.length,
        total: captionLines.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Processing error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing captions.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});