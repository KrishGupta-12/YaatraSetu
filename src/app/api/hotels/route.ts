
import { NextResponse } from 'next/server';
import allHotels from '@/lib/mock-data/hotels.json';
import { z } from 'zod';

const searchSchema = z.object({
  city: z.string().optional(),
  price_min: z.coerce.number().optional(),
  price_max: z.coerce.number().optional(),
  ratings: z.preprocess((val) => String(val).split(',').map(Number), z.array(z.number())).optional(),
  amenities: z.preprocess((val) => String(val).split(','), z.array(z.string())).optional(),
  sortBy: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const params = searchSchema.parse({
      city: searchParams.get('city'),
      price_min: searchParams.get('price_min'),
      price_max: searchParams.get('price_max'),
      ratings: searchParams.get('ratings'),
      amenities: searchParams.get('amenities'),
      sortBy: searchParams.get('sortBy'),
    });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let filteredHotels = [...allHotels];

    if (params.city) {
      filteredHotels = filteredHotels.filter(hotel => hotel.city.toLowerCase() === params.city?.toLowerCase());
    }
    if (params.price_min !== undefined) {
      filteredHotels = filteredHotels.filter(hotel => hotel.price >= params.price_min!);
    }
     if (params.price_max !== undefined) {
      filteredHotels = filteredHotels.filter(hotel => hotel.price <= params.price_max!);
    }
    if (params.ratings && params.ratings.length > 0 && !isNaN(params.ratings[0])) {
      filteredHotels = filteredHotels.filter(hotel => params.ratings!.includes(hotel.rating));
    }
    if (params.amenities && params.amenities.length > 0 && params.amenities[0] !== '') {
       filteredHotels = filteredHotels.filter(hotel => params.amenities!.every(amenity => hotel.amenities.includes(amenity)));
    }
    
    switch (params.sortBy) {
        case 'price-asc':
            filteredHotels.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredHotels.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredHotels.sort((a, b) => b.rating - a.rating);
            break;
        case 'popularity':
        default:
            // Default order is assumed to be popularity
            break;
    }

    return NextResponse.json(filteredHotels);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid search parameters', errors: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

    