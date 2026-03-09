import type { Property, Unit, Inquiry } from '@/types';
import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';
import floorplan1 from '@/assets/floorplan-1.jpg';

// ─── BASE CONFIG ─────────────────────────────────────────
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const API_BASE_URL = `${STRAPI_URL}/api`;

// ─── STRAPI RESPONSE TYPES ───────────────────────────────
interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiBuilding {
  id: number;
  documentId: string;
  name: string;
  name_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  location: string;
  location_ar: string;
  status: 'upcoming' | 'under_construction' | 'ready' | 'sold_out';
  featured: boolean;
  image?: { url: string };
  gallery?: { url: string }[];
  properties?: StrapiProperty[];
  createdAt: string;
  updatedAt: string;
}

interface StrapiProperty {
  id: number;
  documentId: string;
  name: string;
  name_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  status: 'available' | 'reserved' | 'sold';
  type: string;
  floor: number;
  image?: { url: string };
  gallery?: { url: string }[];
  floorplan?: { url: string };
  amenities: string[];
  building?: StrapiBuilding;
  createdAt: string;
  updatedAt: string;
}

interface StrapiUnit {
  id: number;
  documentId: string;
  name: string;
  name_ar: string;
  unit_number: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  status: 'available' | 'reserved' | 'sold';
  image?: { url: string };
  floorplan?: { url: string };
  property?: StrapiProperty;
  createdAt: string;
  updatedAt: string;
}

// ─── HELPER FUNCTIONS ────────────────────────────────────
function getImageUrl(image?: { url: string }): string {
  if (!image?.url) return property1;
  if (image.url.startsWith('http')) return image.url;
  return `${STRAPI_URL}${image.url}`;
}

function mapBuildingToProperty(building: StrapiBuilding): Property {
  return {
    id: building.documentId || String(building.id),
    slug: building.slug,
    name_en: building.name,
    name_ar: building.name_ar,
    short_description_en: building.description?.slice(0, 150) + '...',
    short_description_ar: building.description_ar?.slice(0, 150) + '...',
    full_description_en: building.description,
    full_description_ar: building.description_ar,
    cover_image: getImageUrl(building.image),
    gallery_images: building.gallery?.map(img => getImageUrl(img)) || [],
    location_en: building.location,
    location_ar: building.location_ar,
    status: building.status,
    availability_summary: `${building.properties?.length || 0} properties available`,
    total_units: building.properties?.length || 0,
    amenities: [],
    features: [],
    created_at: building.createdAt,
    updated_at: building.updatedAt,
  };
}

function mapStrapiUnit(unit: StrapiUnit, propertyId: string): Unit {
  return {
    id: unit.documentId || String(unit.id),
    property_id: propertyId,
    title_en: unit.name,
    title_ar: unit.name_ar || unit.name,
    style_code: unit.unit_number,
    brochure_image: getImageUrl(unit.floorplan) || floorplan1,
    description_en: `${unit.bedrooms} bedroom unit with ${unit.area} sqm`,
    description_ar: `وحدة بـ ${unit.bedrooms} غرف نوم بمساحة ${unit.area} متر مربع`,
    availability_status: unit.status,
    price_starting_from: unit.price,
    area_sqm: unit.area,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    balconies: 1,
    living_rooms: 1,
    floor: String(unit.floor),
    maid_room: false,
    laundry_room: false,
    extra_features: [],
    created_at: unit.createdAt,
    updated_at: unit.updatedAt,
  };
}

// ─── MOCK DATA (FALLBACK) ────────────────────────────────
const mockProperties: Property[] = [
  {
    id: '1',
    slug: 'al-noor-residences',
    name_en: 'Al Noor Residences',
    name_ar: 'مساكن النور',
    short_description_en: 'Premium waterfront living with panoramic views of the coastline. A landmark of modern luxury.',
    short_description_ar: 'سكن فاخر على الواجهة البحرية مع إطلالات بانورامية على الساحل.',
    full_description_en: 'Al Noor Residences represents the pinnacle of coastal luxury living. Strategically positioned along the waterfront, each residence offers unobstructed views of the sea and the city skyline.',
    full_description_ar: 'تمثل مساكن النور قمة الحياة الساحلية الفاخرة. تقع في موقع استراتيجي على الواجهة البحرية.',
    cover_image: property1,
    gallery_images: [property1, property2],
    location_en: 'Al Mouj, Muscat',
    location_ar: 'الموج، مسقط',
    status: 'under_construction',
    availability_summary: '24 units available',
    total_units: 120,
    amenities: ['Swimming Pool', 'Gym', 'Private Beach', 'Concierge', 'Parking', 'Garden'],
    features: ['Smart Home', 'Sea View', 'High Ceilings', 'Premium Finishes'],
    created_at: '2024-01-15',
    updated_at: '2024-06-01',
  },
  {
    id: '2',
    slug: 'sahara-villas',
    name_en: 'Sahara Villas',
    name_ar: 'فلل صحارى',
    short_description_en: 'Exclusive villa community blending traditional architecture with contemporary design.',
    short_description_ar: 'مجتمع فلل حصري يمزج بين العمارة التقليدية والتصميم المعاصر.',
    full_description_en: 'Sahara Villas offers an exclusive community of luxury villas that seamlessly blend traditional Omani architectural heritage with cutting-edge contemporary design.',
    full_description_ar: 'توفر فلل صحارى مجتمعاً حصرياً من الفلل الفاخرة التي تمزج بين التراث المعماري العماني والتصميم المعاصر.',
    cover_image: property2,
    gallery_images: [property2, property3],
    location_en: 'Al Khoud, Muscat',
    location_ar: 'الخوض، مسقط',
    status: 'ready',
    availability_summary: '8 villas remaining',
    total_units: 45,
    amenities: ['Community Pool', 'Clubhouse', 'Playground', 'Walking Trails', 'Security'],
    features: ['Private Garden', 'Double Garage', 'Maid Room', 'Storage'],
    created_at: '2023-08-10',
    updated_at: '2024-05-20',
  },
  {
    id: '3',
    slug: 'the-summit-tower',
    name_en: 'The Summit Tower',
    name_ar: 'برج القمة',
    short_description_en: 'A mixed-use landmark tower offering premium commercial and residential spaces in the heart of the city.',
    short_description_ar: 'برج متعدد الاستخدامات يوفر مساحات تجارية وسكنية فاخرة في قلب المدينة.',
    full_description_en: 'The Summit Tower rises as an iconic addition to the city skyline, offering a curated mix of luxury apartments, premium office spaces, and retail destinations.',
    full_description_ar: 'يرتفع برج القمة كإضافة مميزة إلى أفق المدينة، ويوفر مزيجاً من الشقق الفاخرة والمساحات المكتبية المتميزة.',
    cover_image: property3,
    gallery_images: [property3, property1],
    location_en: 'CBD, Muscat',
    location_ar: 'المنطقة التجارية، مسقط',
    status: 'upcoming',
    availability_summary: 'Pre-registration open',
    total_units: 200,
    amenities: ['Rooftop Lounge', 'Business Center', 'Valet Parking', 'Retail Mall', 'Sky Gym'],
    features: ['City View', 'Floor-to-ceiling Glass', 'Smart Building', 'Green Certified'],
    created_at: '2024-03-01',
    updated_at: '2024-06-15',
  },
];

const mockUnits: Unit[] = [
  {
    id: 'u1',
    property_id: '1',
    title_en: 'Type A — 1 Bedroom Suite',
    title_ar: 'النوع أ — جناح غرفة نوم واحدة',
    style_code: 'TYPE-A',
    brochure_image: floorplan1,
    description_en: 'An elegantly designed one-bedroom suite offering open-plan living with premium sea views.',
    description_ar: 'جناح بغرفة نوم واحدة مصمم بأناقة مع إطلالة بحرية مميزة.',
    availability_status: 'available',
    price_starting_from: 85000,
    area_sqm: 75,
    bedrooms: 1,
    bathrooms: 1,
    balconies: 1,
    living_rooms: 1,
    floor: '3-12',
    maid_room: false,
    laundry_room: false,
    extra_features: ['Walk-in Closet', 'Built-in Kitchen'],
    created_at: '2024-01-15',
    updated_at: '2024-06-01',
  },
  {
    id: 'u2',
    property_id: '1',
    title_en: 'Type B — 2 Bedroom Residence',
    title_ar: 'النوع ب — شقة غرفتين نوم',
    style_code: 'TYPE-B',
    brochure_image: floorplan1,
    description_en: 'A spacious two-bedroom residence with generous living areas and a private balcony overlooking the sea.',
    description_ar: 'شقة بغرفتي نوم واسعة مع مساحات معيشة كبيرة وشرفة خاصة مطلة على البحر.',
    availability_status: 'available',
    price_starting_from: 135000,
    area_sqm: 120,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    living_rooms: 1,
    floor: '5-18',
    maid_room: true,
    laundry_room: true,
    extra_features: ['Master En-suite', 'Storage Room', 'Utility Balcony'],
    created_at: '2024-01-15',
    updated_at: '2024-06-01',
  },
  {
    id: 'u3',
    property_id: '1',
    title_en: 'Type C — 3 Bedroom Penthouse',
    title_ar: 'النوع ج — بنتهاوس 3 غرف نوم',
    style_code: 'TYPE-C',
    brochure_image: floorplan1,
    description_en: 'An exclusive penthouse with three bedrooms, a private terrace, and unmatched panoramic views.',
    description_ar: 'بنتهاوس حصري بثلاث غرف نوم مع تراس خاص وإطلالات بانورامية لا مثيل لها.',
    availability_status: 'reserved',
    price_starting_from: 280000,
    area_sqm: 210,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    living_rooms: 2,
    floor: '19-20',
    maid_room: true,
    laundry_room: true,
    extra_features: ['Private Terrace', 'Jacuzzi', 'Double Parking', 'Private Elevator'],
    created_at: '2024-01-15',
    updated_at: '2024-06-01',
  },
  {
    id: 'u4',
    property_id: '2',
    title_en: 'Villa Model A — 4 Bedroom',
    title_ar: 'فيلا نموذج أ — 4 غرف نوم',
    style_code: 'VILLA-A',
    brochure_image: floorplan1,
    description_en: 'A stunning four-bedroom villa with private garden, double garage, and premium finishes throughout.',
    description_ar: 'فيلا مذهلة بأربع غرف نوم مع حديقة خاصة وكراج مزدوج.',
    availability_status: 'available',
    price_starting_from: 320000,
    area_sqm: 350,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    living_rooms: 2,
    floor: 'G+1',
    maid_room: true,
    laundry_room: true,
    extra_features: ['Private Garden', 'Double Garage', 'Majlis', 'Storage'],
    created_at: '2023-08-10',
    updated_at: '2024-05-20',
  },
];

// ─── SIMULATED DELAY ─────────────────────────────────────
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── API FUNCTIONS ───────────────────────────────────────
export async function getProperties(): Promise<Property[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/buildings?populate=*`);
    if (res.ok) {
      const json: StrapiResponse<StrapiBuilding[]> = await res.json();
      return json.data.map(mapBuildingToProperty);
    }
  } catch (error) {
    console.log('Using mock data - Strapi not available');
  }
  await delay(400);
  return mockProperties;
}

export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/buildings?filters[slug][$eq]=${slug}&populate=*`);
    if (res.ok) {
      const json: StrapiResponse<StrapiBuilding[]> = await res.json();
      if (json.data.length > 0) {
        return mapBuildingToProperty(json.data[0]);
      }
    }
  } catch (error) {
    console.log('Using mock data - Strapi not available');
  }
  await delay(300);
  return mockProperties.find((p) => p.slug === slug);
}

export async function getUnitsByProperty(propertyId: string): Promise<Unit[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/units?filters[property][documentId][$eq]=${propertyId}&populate=*`);
    if (res.ok) {
      const json: StrapiResponse<StrapiUnit[]> = await res.json();
      return json.data.map(unit => mapStrapiUnit(unit, propertyId));
    }
  } catch (error) {
    console.log('Using mock data - Strapi not available');
  }
  await delay(300);
  return mockUnits.filter((u) => u.property_id === propertyId);
}

export async function submitInterestForm(inquiry: Inquiry): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          message: inquiry.message,
          preferred_contact: inquiry.preferred_contact,
        }
      }),
    });
    if (res.ok) {
      return { success: true };
    }
  } catch (error) {
    console.log('Using mock submission - Strapi not available');
  }
  await delay(600);
  console.log('Inquiry submitted:', inquiry);
  return { success: true };
}

export { mockProperties, mockUnits };
