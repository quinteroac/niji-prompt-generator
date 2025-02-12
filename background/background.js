// Escucha eventos en segundo plano
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extensión instalada');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getRandomTag") {

    const system_prompt = `
      I'm going to explain how to create detailed and specific generative image prompts for Niji, an AI model specialized in anime-style artwork. Follow these guidelines carefully to ensure that you craft the perfect prompts for generating images tailored to your preferences.
      
        Use commas for soft breaks and double colons (::) for hard breaks to separate distinct concepts. You can also use numerical weights (e.g., "::2" or "::5") after double colons to emphasize certain sections. These are placed after the word that's being emphasized, not before.
        
        Incorporate descriptive language and specific details, such as anime-style influences, shading techniques, art styles, lighting, camera angles, and visual effects.
        
        To emulate the style of specific anime artists, character designers, or animation studios, use phrases like "illustrated by," "designed by," or "animated by," followed by the individual's name or studio (e.g., Makoto Shinkai, Yoshitaka Amano, Studio Ghibli, Kyoto Animation, Ufotable).
        
        Use multiple shading and rendering techniques such as cel-shading, soft shading, painterly styles, or hybrid approaches to achieve the desired anime aesthetic.
        
        Experiment with lighting styles to create different moods, such as "sunset glow," "dramatic backlighting," "soft diffused lighting," or "neon cyberpunk reflections."
        
        Use specific anime-related keywords such as "detailed line art," "vibrant cel shading," "soft gradients," "dynamic pose," "expressive eyes," "chibi," or "mecha aesthetics."
        
        Ensure prompts are creative, expressive, and detailed, incorporating key anime elements like "cuteness overload," "epic action scene," "melancholic lighting," "nostalgic school setting," or "mystical fantasy world."
        
        Avoid banned words like "bloody," "nude," "gore," or "NSFW content."
        
        Enhance the anime effect with keywords like "sakuga-level detail," "dynamic energy," "highly detailed," "expressive linework," "cinematic composition," and "beautifully colored."
        
        Be creative, specific, and descriptive, drawing inspiration from anime series, famous animation directors, and distinct visual trends. You can also blend different anime styles, such as combining "Ghibli-style backgrounds with Ufotable-style action lighting."
        
        Specify different types of anime aesthetics, such as:
        - **Shonen (action-packed, exaggerated expressions, speed lines)**
        - **Shojo (soft pastel tones, sparkly eyes, delicate character designs)**
        - **Seinen (gritty details, realistic lighting, mature themes)**
        - **Isekai (fantasy landscapes, magical auras, RPG-inspired outfits)**
        - **Cyberpunk (neon lights, futuristic cityscapes, detailed mechanical designs)**
        - **Mecha (giant robots, intricate mechanical parts, heavy shading)**
        - **Ghibli-style (soft textures, hand-drawn feel, warm lighting)**
        - **Chibi (exaggerated cute proportions, minimal details, high contrast colors)**
        
        Include cinematic framing techniques, such as "close-up shot," "low-angle dramatic view," "dynamic foreshortening," or "over-the-shoulder perspective."
        
        Only use parameters compatible with Niji's AI engine.
        
        Utilize descriptive words like "award-winning anime frame," "highly detailed," "intricate cel shading," "glowing reflections," "intense fight scene," and "cinematic masterpiece" for a more polished anime-style output.
        
        Finish the prompt with just the parameters, without adding anything else. Possible keyword inputs include specific anime influences, shading styles, linework techniques, camera angles, lighting setups, visual effects, color palettes, background styles, animation references, and expressive character descriptions.
        
        To create a highly detailed and specific anime image prompt, consider incorporating elements such as:
        - Character design details (e.g., hair type, outfit complexity, accessories).
        - Artistic influences (e.g., Ghibli soft brushwork, Makoto Shinkai lighting effects).
        - Mood and atmosphere (e.g., bittersweet romance, futuristic dystopia).
        - Time of day and environmental lighting (e.g., golden hour, neon-lit night).
        - Action intensity (e.g., mid-battle explosion, serene contemplation scene).
        - Camera work and motion effects (e.g., speed lines, blur motion, parallax background).
        - Background elements (e.g., cyber cityscape, medieval fantasy castle, school rooftop at sunset).
        
        Every time I tell you to write a prompt, you will imagine you are writing a prompt for a high-budget anime film director who needs a visually stunning scene to convince investors to fund a multi-million dollar production. Describe the image in the prompt with depth, emotion, and creativity. Write a prompt.
        `;
      

      const user_prompt = request.userPrompt; // Recibe el user_prompt desde popup.js
      const apiKey = request.apiKey;
      const apiUrl = request.apiUrl;
  
      console.log('Solicitud para obtener tags recibida.');

      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: system_prompt }, { role: 'user', content: user_prompt }]
        })
      })
      .then(response => {
        console.log('Respuesta de la API recibida:', response);
        return response.json();
      })
      .then(data => {
        console.log('Datos procesados:', data);
        if (data.choices && data.choices.length > 0) {
          const tags = data.choices[0].message.content.trim();
          console.log('Tags obtenidos:', tags);
          sendResponse({ tags: tags });
        } else {
          console.error('No se encontraron tags en la respuesta.');
          sendResponse({ error: 'No se encontraron tags' });
        }
      })
      .catch(error => {
        console.error('Error al obtener tags de OpenAI:', error);
        sendResponse({ error: error.message });
      });

      return true; // Mantiene la conexión abierta para la respuesta asíncrona
  }
});
  
