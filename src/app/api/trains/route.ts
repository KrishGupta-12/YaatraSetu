
import { NextResponse } from 'next/server';
import allTrains from '@/lib/mock-data/trains.json';
import { z } from 'zod';

const searchSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
    const { from, to } = searchSchema.parse({
      from: searchParams.get('from'),
      to: searchParams.get('to'),
    });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const filteredTrains = allTrains.filter(train => 
      train.from.toLowerCase() === from.toLowerCase() && 
      train.to.toLowerCase() === to.toLowerCase()
    );

    return NextResponse.json(filteredTrains);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid search parameters', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

    