import { Metadata } from 'next';

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mindful Track - Mental Health & Wellness Tracker',
  description: 'A personal tool to track thoughts, build self-awareness, and improve mental wellness through journaling, mood tracking, and mindfulness exercises.',
  url: 'https://mindful-track.app',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'Mindful Track Team',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Mindful Track',
  },
  datePublished: '2024-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  inLanguage: 'en-US',
  keywords: 'mental health, wellness, mood tracking, journaling, mindfulness, self-awareness, ADHD, anxiety, depression, therapy tools',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '150',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'Mood and trigger tracking',
    'Journal entries with CBT techniques',
    'Mindfulness breathing exercises',
    'Data export and backup',
    'Insights and analytics',
    'Offline support',
    'Privacy-focused design',
  ],
  screenshot: [
    'https://mindful-track.app/screenshot-mobile.png',
    'https://mindful-track.app/screenshot-desktop.png',
  ],
  softwareVersion: '1.0.0',
  releaseNotes: 'Initial release with core mental health tracking features',
  permissions: 'No special permissions required',
  storageRequirements: 'Local browser storage',
  memoryRequirements: 'Minimal memory usage',
  processorRequirements: 'Modern web browser',
  accessibilityFeature: [
    'Keyboard navigation',
    'Screen reader support',
    'High contrast mode',
    'Responsive design',
    'Touch-friendly interface',
  ],
  accessibilityHazard: 'None',
  accessibilityControl: [
    'Keyboard control',
    'Mouse control',
    'Touch control',
  ],
  isAccessibleForFree: true,
  usageInfo: 'https://mindful-track.app/privacy',
  privacyPolicy: 'https://mindful-track.app/privacy',
  termsOfService: 'https://mindful-track.app/terms',
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Page-specific structured data generators
export function generatePageStructuredData(page: {
  title: string;
  description: string;
  url: string;
  type?: 'WebPage' | 'Article' | 'Guide';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': page.type || 'WebPage',
    name: page.title,
    description: page.description,
    url: page.url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Mindful Track',
      url: 'https://mindful-track.app',
    },
    author: {
      '@type': 'Organization',
      name: 'Mindful Track Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mindful Track',
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': page.url,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://mindful-track.app',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.title,
          item: page.url,
        },
      ],
    },
  };
}

export function generateArticleStructuredData(article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  wordCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    wordCount: article.wordCount,
    author: {
      '@type': 'Organization',
      name: 'Mindful Track Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mindful Track',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
    articleSection: 'Mental Health',
    keywords: 'mental health, wellness, self-care, mindfulness',
    inLanguage: 'en-US',
  };
} 