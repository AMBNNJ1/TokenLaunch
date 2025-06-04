'use client';

import { useState, useRef } from 'react';
import { TokenData } from '@/types';
import { DEFAULT_DECIMALS, VALIDATION_RULES, ERROR_MESSAGES } from '@/lib/constants';

interface TokenInfoStepProps {
  initialData?: TokenData | null;
  onSubmit: (data: TokenData) => void;
}

export function TokenInfoStep({ initialData, onSubmit }: TokenInfoStepProps) {
  const [formData, setFormData] = useState<Partial<TokenData>>({
    name: initialData?.name || '',
    symbol: initialData?.symbol || '',
    decimals: initialData?.decimals || DEFAULT_DECIMALS,
    totalSupply: initialData?.totalSupply || 1000000,
    description: initialData?.description || '',
    website: initialData?.website || '',
    twitter: initialData?.twitter || '',
    logoUrl: initialData?.logoUrl || '',
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(initialData?.logoFile || null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.logoUrl || null
  );
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Token name validation
    if (!formData.name || formData.name.length < VALIDATION_RULES.TOKEN_NAME.MIN_LENGTH) {
      newErrors.name = 'Token name is required';
    } else if (formData.name.length > VALIDATION_RULES.TOKEN_NAME.MAX_LENGTH) {
      newErrors.name = `Token name must be ${VALIDATION_RULES.TOKEN_NAME.MAX_LENGTH} characters or less`;
    }

    // Token symbol validation
    if (!formData.symbol || formData.symbol.length < VALIDATION_RULES.TOKEN_SYMBOL.MIN_LENGTH) {
      newErrors.symbol = 'Token symbol is required';
    } else if (formData.symbol.length > VALIDATION_RULES.TOKEN_SYMBOL.MAX_LENGTH) {
      newErrors.symbol = `Token symbol must be ${VALIDATION_RULES.TOKEN_SYMBOL.MAX_LENGTH} characters or less`;
    }

    // Total supply validation
    if (!formData.totalSupply || formData.totalSupply <= 0) {
      newErrors.totalSupply = 'Total supply must be greater than 0';
    }

    // Description validation
    if (formData.description && formData.description.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
      newErrors.description = `Description must be ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters or less`;
    }

    // Website validation
    if (formData.website && !VALIDATION_RULES.WEBSITE_URL.PATTERN.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL (starting with http:// or https://)';
    }

    // Twitter validation
    if (formData.twitter && !VALIDATION_RULES.TWITTER_HANDLE.PATTERN.test(formData.twitter)) {
      newErrors.twitter = 'Please enter a valid Twitter handle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, logo: ERROR_MESSAGES.INVALID_FILE_TYPE });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, logo: ERROR_MESSAGES.FILE_TOO_LARGE });
      return;
    }

    setLogoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Clear logo error
    const newErrors = { ...errors };
    delete newErrors.logo;
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const tokenData: TokenData = {
      name: formData.name!,
      symbol: formData.symbol!.toUpperCase(),
      decimals: formData.decimals!,
      totalSupply: formData.totalSupply!,
      description: formData.description,
      website: formData.website,
      twitter: formData.twitter,
      logoFile: logoFile || undefined,
      logoUrl: logoPreview || undefined,
    };

    onSubmit(tokenData);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Token Information</h2>
        <p className="text-gray-600">
          Enter the basic details for your token. This information will be stored on-chain as metadata.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Token Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Token Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="My Awesome Token"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Token Symbol */}
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-2">
              Token Symbol *
            </label>
            <input
              type="text"
              id="symbol"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.symbol ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="MAT"
              maxLength={10}
            />
            {errors.symbol && <p className="mt-1 text-sm text-red-600">{errors.symbol}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Decimals */}
          <div>
            <label htmlFor="decimals" className="block text-sm font-medium text-gray-700 mb-2">
              Decimals
            </label>
            <input
              type="number"
              id="decimals"
              value={formData.decimals}
              onChange={(e) => setFormData({ ...formData, decimals: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="18"
            />
            <p className="mt-1 text-sm text-gray-500">
              Number of decimal places (default: 9)
            </p>
          </div>

          {/* Total Supply */}
          <div>
            <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700 mb-2">
              Total Supply *
            </label>
            <input
              type="number"
              id="totalSupply"
              value={formData.totalSupply}
              onChange={(e) => setFormData({ ...formData, totalSupply: parseInt(e.target.value) })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.totalSupply ? 'border-red-500' : 'border-gray-300'
              }`}
              min="1"
            />
            {errors.totalSupply && <p className="mt-1 text-sm text-red-600">{errors.totalSupply}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your token..."
            maxLength={500}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          <p className="mt-1 text-sm text-gray-500">
            {formData.description?.length || 0}/500 characters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.website ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com"
            />
            {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
          </div>

          {/* Twitter */}
          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
              Twitter Handle
            </label>
            <input
              type="text"
              id="twitter"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.twitter ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="@username"
            />
            {errors.twitter && <p className="mt-1 text-sm text-red-600">{errors.twitter}</p>}
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token Logo (Optional)
          </label>
          <div className="flex items-center space-x-4">
            {logoPreview && (
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300">
                <img 
                  src={logoPreview} 
                  alt="Token logo preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {logoPreview ? 'Change Logo' : 'Upload Logo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload token logo image file"
              />
              <p className="mt-1 text-sm text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
          {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Continue to Liquidity
          </button>
        </div>
      </form>
    </div>
  );
}
