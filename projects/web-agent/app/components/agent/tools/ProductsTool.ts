'use client';

import { Tool } from '../ToolManager';

// Sample product data
const productData = [
  {
    id: 'skincare-cream',
    name: 'Rejuvenating Skin Cream',
    category: 'skincare',
    price: 39.99,
    description: 'A premium hydrating cream that rejuvenates skin cells and reduces fine lines.',
    features: ['Anti-aging', 'Hydrating', 'All skin types'],
    availability: true
  },
  {
    id: 'skincare-serum',
    name: 'Vitamin C Serum',
    category: 'skincare',
    price: 45.99,
    description: 'Powerful antioxidant serum that brightens skin and reduces dark spots.',
    features: ['Brightening', 'Anti-oxidant', 'For daily use'],
    availability: true
  },
  {
    id: 'makeup-foundation',
    name: 'Flawless Foundation',
    category: 'makeup',
    price: 34.99,
    description: 'Long-lasting foundation with medium to full coverage for a natural finish.',
    features: ['Long-lasting', '24 shades', 'Oil-free'],
    availability: true
  },
  {
    id: 'haircare-shampoo',
    name: 'Revitalizing Shampoo',
    category: 'haircare',
    price: 22.99,
    description: 'Gentle cleansing shampoo that adds volume and shine to all hair types.',
    features: ['Volumizing', 'Color-safe', 'Paraben-free'],
    availability: true
  },
  {
    id: 'fragrance-perfume',
    name: 'Signature Scent',
    category: 'fragrance',
    price: 75.99,
    description: 'Elegant and long-lasting fragrance with notes of jasmine and sandalwood.',
    features: ['Long-lasting', 'Gender-neutral', '50ml'],
    availability: true
  }
];

const ProductsTool: Tool = {
  name: 'getProductInfo',
  definition: {
    type: "function",
    function: {
      name: "getProductInfo",
      description: "Get information about available products. Can search by category or product name, or return all products.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Optional. Filter products by category (skincare, makeup, haircare, fragrance)",
          },
          productId: {
            type: "string",
            description: "Optional. Get details about a specific product by ID",
          },
          query: {
            type: "string",
            description: "Optional. Search term to filter products by name or description",
          }
        },
        required: []
      }
    }
  },
  handler: async (args: any) => {
    try {
      const { category, productId, query } = args;
      
      // Get specific product by ID
      if (productId) {
        const product = productData.find(p => p.id === productId);
        if (!product) {
          return {
            success: false,
            message: `Product with ID ${productId} not found.`,
            products: []
          };
        }
        return {
          success: true,
          message: `Found product: ${product.name}`,
          products: [product]
        };
      }
      
      // Filter by category
      let filteredProducts = productData;
      if (category) {
        filteredProducts = filteredProducts.filter(p => 
          p.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      // Filter by search query
      if (query) {
        const searchTerm = query.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm) || 
          p.description.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filteredProducts.length === 0) {
        return {
          success: false,
          message: "No products found matching your criteria.",
          products: []
        };
      }
      
      return {
        success: true,
        message: `Found ${filteredProducts.length} product(s).`,
        products: filteredProducts
      };
    } catch (error) {
      console.error("Error in ProductsTool:", error);
      return {
        success: false,
        message: `Error retrieving product information: ${error instanceof Error ? error.message : String(error)}`,
        products: []
      };
    }
  }
};

export default ProductsTool; 
 
 