import { prisma } from './db';

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  try {
    const count = await prisma.product.count();
    if (count === 0) {
      await seedInline();
    }
    seeded = true;
  } catch (e) {
    console.error('ensureSeeded error', e);
  }
}

async function seedInline() {
  const products = [
    {
      name: 'Royal Emerald Silk Saree',
      slug: 'royal-emerald-silk-saree',
      description: 'Handwoven pure silk saree in deep emerald with intricate gold zari border. Includes matching blouse fabric.',
      price: 12999,
      compareAtPrice: 15999,
      images: JSON.stringify(['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80','https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80']),
      category: 'Sarees', fabricType: 'Silk', sizes: JSON.stringify(['Free Size']), colors: JSON.stringify(['Emerald','Gold']), stock: 25, featured: true, published: true,
    },
    {
      name: 'Ivory Cotton Kurta Set', slug: 'ivory-cotton-kurta-set',
      description: 'Breathable premium cotton kurta with subtle embroidery. Paired with matching trousers.',
      price: 3499, compareAtPrice: 4299,
      images: JSON.stringify(['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80','https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80']),
      category: 'Kurtas', fabricType: 'Cotton', sizes: JSON.stringify(['S','M','L','XL','XXL']), colors: JSON.stringify(['Ivory','Cream','White']), stock: 40, featured: true, published: true,
    },
    {
      name: 'Midnight Sherwani', slug: 'midnight-sherwani',
      description: 'Regal navy sherwani with gold threadwork and mandarin collar. Ideal for grooms and wedding guests.',
      price: 24999, compareAtPrice: 29999,
      images: JSON.stringify(['https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&q=80','https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80']),
      category: 'Sherwanis', fabricType: 'Silk Blend', sizes: JSON.stringify(['M','L','XL','XXL']), colors: JSON.stringify(['Navy','Black','Maroon']), stock: 12, featured: true, published: true,
    },
    {
      name: 'Golden Tissue Dupatta', slug: 'golden-tissue-dupatta',
      description: 'Lightweight tissue dupatta with shimmering gold finish and delicate lace edges.',
      price: 1899, compareAtPrice: 2499,
      images: JSON.stringify(['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80','https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80']),
      category: 'Dupattas', fabricType: 'Tissue', sizes: JSON.stringify(['2.5m']), colors: JSON.stringify(['Gold','Rose Gold','Silver']), stock: 60, featured: false, published: true,
    },
    {
      name: 'Banarasi Brocade Fabric (Per Meter)', slug: 'banarasi-brocade-fabric',
      description: 'Authentic Banarasi brocade sold by the meter. Rich motifs woven with metallic threads.',
      price: 2200, compareAtPrice: 2800,
      images: JSON.stringify(['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80','https://images.unsplash.com/photo-1558769132-cb1aea1f1cba?w=800&q=80']),
      category: 'Fabrics', fabricType: 'Brocade', sizes: JSON.stringify(['1m','2m','3m','5m']), colors: JSON.stringify(['Red','Emerald','Royal Blue']), stock: 100, featured: true, published: true,
    },
    {
      name: 'Linen Summer Abaya', slug: 'linen-summer-abaya',
      description: 'Flowing linen abaya with minimalist stitching and soft drape for warm climates.',
      price: 4599, compareAtPrice: 5499,
      images: JSON.stringify(['https://images.unsplash.com/photo-1564257631407-4deb1f99d508?w=800&q=80','https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80']),
      category: 'Abayas', fabricType: 'Linen', sizes: JSON.stringify(['S','M','L','XL']), colors: JSON.stringify(['Beige','Black','Olive']), stock: 30, featured: false, published: true,
    },
    {
      name: 'Chanderi Silk Suit Set', slug: 'chanderi-silk-suit-set',
      description: 'Three-piece Chanderi silk suit with embroidered neckline, pants, and contrasting dupatta.',
      price: 6999, compareAtPrice: 8499,
      images: JSON.stringify(['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80','https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80']),
      category: 'Suits', fabricType: 'Chanderi Silk', sizes: JSON.stringify(['S','M','L','XL']), colors: JSON.stringify(['Peach','Mint','Lavender']), stock: 22, featured: true, published: true,
    },
    {
      name: 'Velvet Embroidered Jacket', slug: 'velvet-embroidered-jacket',
      description: 'Statement velvet jacket with traditional embroidery for evening fusion looks.',
      price: 8999, compareAtPrice: 10999,
      images: JSON.stringify(['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80','https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80']),
      category: 'Jackets', fabricType: 'Velvet', sizes: JSON.stringify(['M','L','XL']), colors: JSON.stringify(['Burgundy','Forest Green','Black']), stock: 8, featured: false, published: true,
    },
    {
      name: 'Handloom Cotton Stole', slug: 'handloom-cotton-stole',
      description: 'Artisan handloom cotton stole with heritage weave patterns. Ethically sourced.',
      price: 999, compareAtPrice: 1299,
      images: JSON.stringify(['https://images.unsplash.com/photo-1601924999987-b6eaf0bfc293?w=800&q=80','https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80']),
      category: 'Stoles', fabricType: 'Cotton', sizes: JSON.stringify(['One Size']), colors: JSON.stringify(['Indigo','Mustard','Terracotta']), stock: 75, featured: false, published: true,
    },
    {
      name: 'Bridal Lehenga Fabric Pack', slug: 'bridal-lehenga-fabric-pack',
      description: 'Curated bridal pack: 5m lehenga, 2.5m blouse, 2.5m dupatta in coordinated embroidery.',
      price: 34999, compareAtPrice: 42999,
      images: JSON.stringify(['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80','https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80']),
      category: 'Bridal', fabricType: 'Silk Embroidery', sizes: JSON.stringify(['Custom']), colors: JSON.stringify(['Red Gold','Pink Gold','Maroon']), stock: 5, featured: true, published: true,
    },
  ];

  await prisma.product.createMany({ data: products });

  const couponCount = await prisma.coupon.count();
  if (couponCount === 0) {
    await prisma.coupon.createMany({
      data: [
        { code: 'WELCOME10', type: 'PERCENT', value: 10, minOrder: 2000, active: true },
        { code: 'GOLD500', type: 'FIXED', value: 500, minOrder: 5000, active: true },
        { code: 'EID15', type: 'PERCENT', value: 15, minOrder: 3000, maxUses: 100, active: true },
      ],
    });
  }
}
