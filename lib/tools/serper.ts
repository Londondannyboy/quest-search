// Serper.dev API client for Quest Platform
// Cost: $0.001 per search (vs Tavily $0.10)

interface SerperSearchResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
}

interface SerperImageResult {
  title: string;
  imageUrl: string;
  link: string;
}

interface SerperResponse {
  searchParameters: {
    q: string;
    type?: string;
    num?: number;
  };
  organic: SerperSearchResult[];
  images?: SerperImageResult[];
}

export class SerperClient {
  private apiKey: string;
  private baseUrl = 'https://google.serper.dev';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Serper API key is required');
    }
    this.apiKey = apiKey;
  }

  async search(query: string, options?: {
    type?: 'search' | 'news' | 'images';
    num?: number;
    autocorrect?: boolean;
  }): Promise<SerperResponse> {
    const searchType = options?.type || 'search';
    const endpoint = searchType === 'images' ? '/images' : searchType === 'news' ? '/news' : '/search';

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        num: options?.num || 10,
        autocorrect: options?.autocorrect !== false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchWithImages(query: string, options?: {
    maxResults?: number;
    includeNews?: boolean;
  }): Promise<{
    results: SerperSearchResult[];
    images: SerperImageResult[];
  }> {
    const maxResults = options?.maxResults || 10;
    const searchType = options?.includeNews ? 'news' : 'search';

    // Run search and image queries in parallel
    const [searchResponse, imageResponse] = await Promise.all([
      this.search(query, { type: searchType, num: maxResults }),
      this.search(query, { type: 'images', num: 3 }),
    ]);

    return {
      results: searchResponse.organic || [],
      images: imageResponse.images || [],
    };
  }
}
