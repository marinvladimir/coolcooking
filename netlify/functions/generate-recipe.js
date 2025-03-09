export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }
  
    const { ingredients } = JSON.parse(event.body || '{}');
  
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid ingredients' }),
      };
    }
  
    const prompt = `Create a detailed recipe using the following ingredients: ${ingredients.join(', ')}. The recipe should include instructions, preparation time, and serving details.`;
  
    try {
      const startTime = Date.now();
  
      const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_length: 300, temperature: 0.7 },
        }),
      });
      
  
      const duration = Date.now() - startTime;
      console.log('API request duration: ', duration, 'ms');
  
      const data = await response.json();
      console.log('Hugging Face Response:', data);
  
      const recipe = data[0]?.generated_text || 'No recipe generated';
      
      return {
        statusCode: 200,
        body: JSON.stringify({ recipe }),
      };
    } catch (error) {
      console.error('AI Recipe Generation Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to generate recipe' }),
      };
    }
  };
  