/**
 * AI Image Generation Service
 * Handles OpenAI DALL-E API calls for generating memecoin images
 */

export interface ImageGenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

class AIImageService {
  private debug = process.env.NODE_ENV === 'development';
  private baseUrl = 'https://api.openai.com/v1/images/generations';
  
  private getApiKey(): string | null {
    // Try different ways to access the API key
    const key = 
      process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
      (typeof window !== 'undefined' ? window.__NEXT_DATA__?.props?.pageProps?.env?.NEXT_PUBLIC_OPENAI_API_KEY : null);
    
    if (this.debug) {
      console.log('Getting API key:', {
        exists: !!key,
        length: key?.length || 0,
        keyPrefix: key ? `${key.substring(0, 7)}...` : 'none',
        environment: process.env.NODE_ENV,
        isClient: typeof window !== 'undefined',
        envKeys: Object.keys(process.env).filter(k => k.includes('OPENAI'))
      });
    }
    
    return key || null;
  }

  /**
   * Generate a memecoin-style image based on tweet text
   */
  async generateMemecoinImage(tweetText: string): Promise<ImageGenerationResult> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      console.warn('OpenAI API key not configured, using placeholder image');
      return {
        success: false,
        error: 'OpenAI API key not configured. Please check your environment variables.',
        imageUrl: this.generatePlaceholderImage(tweetText)
      };
    }

    try {
      const prompt = this.createMemecoinPrompt(tweetText);
      
      if (this.debug) {
        console.log('Making OpenAI API request with:', {
          prompt,
          model: 'dall-e-3',
          size: '1024x1024',
          apiKeyLength: apiKey.length,
          apiKeyPrefix: `${apiKey.substring(0, 7)}...`
        });
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'vivid'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('OpenAI API error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw new Error(data.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const imageUrl = data.data?.[0]?.url;

      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI API');
      }

      if (this.debug) {
        console.log('Image generated successfully:', {
          prompt,
          imageUrl
        });
      }

      return {
        success: true,
        imageUrl: imageUrl
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error generating image:', {
        error,
        message: errorMessage,
        tweetText
      });
      
      return {
        success: false,
        error: errorMessage,
        imageUrl: this.generatePlaceholderImage(tweetText)
      };
    }
  }

  /**
   * Create a memecoin-style prompt from tweet text
   */
  private createMemecoinPrompt(tweetText: string): string {
    // Clean the tweet text (remove URLs, mentions, etc.)
    const cleanText = tweetText
      .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
      .replace(/@\w+/g, '') // Remove mentions
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    const prompt = `Create a colorful, fun, memecoin-style image based on this text: "${cleanText}". The image should feel viral, humorous, and eye-catching like $DOGE or $PEPE coins. Include animals, absurd or surreal elements if possible. No text.`;
    
    return prompt;
  }

  /**
   * Generate a placeholder image URL (for when API is not available)
   */
  private generatePlaceholderImage(tweetText: string): string {
    // Create a simple placeholder using a service like picsum or a solid color
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Use a placeholder service that can generate images with text
    const encodedText = encodeURIComponent(tweetText.substring(0, 50) + '...');
    return `https://via.placeholder.com/512x512/${randomColor}/FFFFFF?text=${encodedText}`;
  }

  /**
   * Regenerate image with a slightly modified prompt
   */
  async regenerateImage(tweetText: string, attempt: number = 1): Promise<ImageGenerationResult> {
    const variations = [
      'cartoon style',
      'digital art style',
      'pop art style',
      'anime style',
      'retro style'
    ];
    
    const styleVariation = variations[attempt % variations.length];
    const modifiedText = `${tweetText} (${styleVariation})`;
    
    return this.generateMemecoinImage(modifiedText);
  }
}

export const aiImageService = new AIImageService();
