'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  color: string;
}

interface CrossSellProps {
  currentApp: string;
  userId?: string;
  maxItems?: number;
}

const ALL_PRODUCTS: Product[] = [
  {
    id: 'javari',
    name: 'Javari AI',
    description: 'Your personal AI assistant',
    url: 'https://javariai.com',
    icon: '🤖',
    color: '#8B5CF6',
  },
  {
    id: 'games',
    name: 'CravGames',
    description: '1,200+ free games',
    url: 'https://cravgameshub.com',
    icon: '🎮',
    color: '#EF4444',
  },
  {
    id: 'cards',
    name: 'CravCards',
    description: 'AI trading card creator',
    url: 'https://cravcards.com',
    icon: '🃏',
    color: '#F59E0B',
  },
  {
    id: 'barrels',
    name: 'CravBarrels',
    description: 'Premium spirits finder',
    url: 'https://cravbarrels.com',
    icon: '🥃',
    color: '#D97706',
  },
  {
    id: 'travel',
    name: 'CRAVTravel',
    description: 'AI travel deal finder',
    url: 'https://orlandotripdeal.com',
    icon: '✈️',
    color: '#3B82F6',
  },
  {
    id: 'property',
    name: 'CravProperty',
    description: 'Property management',
    url: 'https://cravmanage.com',
    icon: '🏠',
    color: '#10B981',
  },
  {
    id: 'mortgage',
    name: 'RateUnlock',
    description: 'Mortgage rate monitor',
    url: 'https://rateunlock.com',
    icon: '📊',
    color: '#6366F1',
  },
  {
    id: 'realtor',
    name: 'CravKey',
    description: 'Realtor CRM platform',
    url: 'https://cravkey.com',
    icon: '🔑',
    color: '#EC4899',
  },
];

/**
 * Cross-Sell Component
 * 
 * Per Henderson Standard: Cross-selling in EVERY app
 * 
 * Usage:
 * <CrossSell currentApp="javari" userId={user?.id} />
 */
export function CrossSell({
  currentApp,
  userId,
  maxItems = 3,
}: CrossSellProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Filter out current app and shuffle
    const available = ALL_PRODUCTS.filter((p) => p.id !== currentApp);
    const shuffled = available.sort(() => Math.random() - 0.5);
    setProducts(shuffled.slice(0, maxItems));
  }, [currentApp, maxItems]);

  if (products.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">
        Explore More from CR AudioViz AI
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {products.map((product) => (
          <a
            key={product.id}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-100"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{ backgroundColor: `${product.color}20` }}
            >
              {product.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm">
                {product.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {product.description}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default CrossSell;
