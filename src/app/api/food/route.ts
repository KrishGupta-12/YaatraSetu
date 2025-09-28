
import { NextResponse } from 'next/server';
import menuItems from '@/lib/mock-data/menu.json';
import { z } from 'zod';

const searchSchema = z.object({
  pnr: z.string().length(10),
  station: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
    const { pnr } = searchSchema.parse({
      pnr: searchParams.get('pnr'),
    });

    if (!pnr) {
         return NextResponse.json({ message: 'PNR is required' }, { status: 400 });
    }

    // Simulate network delay and logic to find deliverable restaurants
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would use the PNR to get the train route and find restaurants.
    // For this mock, we'll just return all menu items as if they are from one restaurant.
    return NextResponse.json({
        restaurant: {
            name: "Railicious Restaurant",
            rating: 4.2,
            deliveringTo: "Ratlam (RTM)",
        },
        menu: menuItems
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid search parameters', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

    