import { aiImageService } from '../aiImageService';

describe('AIImageService', () => {
  const mockTweet = "This is a test tweet for generating a memecoin image #memecoin";

  beforeEach(() => {
    // Clear console mocks between tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should generate an image URL when API key is configured', async () => {
    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: [{ url: 'https://example.com/generated-image.jpg' }]
      })
    });

    const result = await aiImageService.generateMemecoinImage(mockTweet);
    
    expect(result.success).toBe(true);
    expect(result.imageUrl).toBe('https://example.com/generated-image.jpg');
    expect(result.error).toBeUndefined();
  });

  it('should return placeholder image when API key is not configured', async () => {
    // Force API key to be null
    Object.defineProperty(process.env, 'NEXT_PUBLIC_OPENAI_API_KEY', {
      value: undefined,
      writable: true
    });

    const result = await aiImageService.generateMemecoinImage(mockTweet);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('OpenAI API key not configured. Please check your environment variables.');
    expect(result.imageUrl).toContain('placeholder.com');
  });

  it('should handle API errors gracefully', async () => {
    // Mock a failed API response
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
      json: () => Promise.resolve({
        error: { message: 'Rate limit exceeded' }
      })
    });

    const result = await aiImageService.generateMemecoinImage(mockTweet);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Rate limit exceeded');
    expect(result.imageUrl).toContain('placeholder.com');
  });
});
