import { TokenData, TokenMetadata } from '@/types';

// This is a simplified implementation for demo purposes
// In a real application, you would integrate with NFT.Storage, Arweave, or IPFS

export async function uploadMetadata(tokenData: TokenData): Promise<string> {
  try {
    // Upload logo to a storage service (simplified for demo)
    let imageUrl: string | undefined;
    
    if (tokenData.logoFile) {
      imageUrl = await uploadImage(tokenData.logoFile);
    }
    
    // Create metadata object
    const metadata: TokenMetadata = {
      name: tokenData.name,
      symbol: tokenData.symbol,
      description: tokenData.description || `${tokenData.name} (${tokenData.symbol}) token`,
      image: imageUrl,
      external_url: tokenData.website,
      attributes: [
        {
          trait_type: 'Total Supply',
          value: tokenData.totalSupply.toString()
        },
        {
          trait_type: 'Decimals',
          value: tokenData.decimals.toString()
        }
      ],
      properties: {
        category: 'fungible',
        files: imageUrl ? [
          {
            uri: imageUrl,
            type: tokenData.logoFile?.type || 'image/png'
          }
        ] : undefined
      }
    };
    
    // Add social links if provided
    if (tokenData.twitter) {
      metadata.attributes?.push({
        trait_type: 'Twitter',
        value: tokenData.twitter
      });
    }
    
    // Upload metadata JSON
    const metadataUri = await uploadJson(metadata);
    
    return metadataUri;
  } catch (error) {
    console.error('Error uploading metadata:', error);
    throw new Error(`Failed to upload metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function uploadImage(file: File): Promise<string> {
  // This is a simplified implementation
  // In a real application, you would upload to NFT.Storage, Arweave, or IPFS
  
  try {
    // For demo purposes, we'll create a data URL
    // In production, replace this with actual storage service
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // In a real implementation, you would upload to a decentralized storage service
        // and return the permanent URL
        resolve(dataUrl);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } catch (error) {
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function uploadJson(metadata: TokenMetadata): Promise<string> {
  // This is a simplified implementation
  // In a real application, you would upload to NFT.Storage, Arweave, or IPFS
  
  try {
    const jsonString = JSON.stringify(metadata, null, 2);
    
    // For demo purposes, we'll create a data URL
    // In production, replace this with actual storage service
    const dataUrl = `data:application/json;base64,${btoa(jsonString)}`;
    
    // In a real implementation, you would upload to a decentralized storage service
    // Example with NFT.Storage:
    /*
    const nftStorage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });
    const blob = new Blob([jsonString], { type: 'application/json' });
    const cid = await nftStorage.storeBlob(blob);
    return `https://nftstorage.link/ipfs/${cid}`;
    */
    
    return dataUrl;
  } catch (error) {
    throw new Error(`Failed to upload metadata JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to validate metadata
export function validateMetadata(metadata: TokenMetadata): boolean {
  if (!metadata.name || !metadata.symbol) {
    return false;
  }
  
  if (metadata.name.length > 32 || metadata.symbol.length > 10) {
    return false;
  }
  
  return true;
}

// Helper function to fetch metadata from URI
export async function fetchMetadata(uri: string): Promise<TokenMetadata | null> {
  try {
    // Handle data URLs (for demo purposes)
    if (uri.startsWith('data:application/json;base64,')) {
      const base64Data = uri.split(',')[1];
      const jsonString = atob(base64Data);
      return JSON.parse(jsonString);
    }
    
    // Handle regular URLs
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}

// Helper function to get image URL from metadata
export function getImageUrlFromMetadata(metadata: TokenMetadata): string | null {
  if (metadata.image) {
    return metadata.image;
  }
  
  if (metadata.properties?.files && metadata.properties.files.length > 0) {
    const imageFile = metadata.properties.files.find(file => 
      file.type.startsWith('image/')
    );
    return imageFile?.uri || null;
  }
  
  return null;
}
