import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

import SurfRating from '@/prisma/providers/SurfRating';
import { CreateSurfRatingInputType } from '@/types/api';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!req.url) {
    return NextResponse.json(
      {
        message: 'No URL provided.',
      },
      {
        status: 400,
      }
    );
  }
  const token = await getToken({ req });
  if (!token?.id) {
    return NextResponse.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }

  const prevValues = await new SurfRating(token.id).getbyActivityAndUserId(id);
  return NextResponse.json(prevValues, {
    status: 200,
  });
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  if (!req.url) {
    return NextResponse.json(
      {
        message: 'No URL provided.',
      },
      {
        status: 400,
      }
    );
  }
  const token = await getToken({ req });
  if (!token?.id) {
    return NextResponse.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }
  const { searchParams } = new URL(req.url);
  const surfActivityId = searchParams.get('surfActivityId');
  if (!surfActivityId) {
    return NextResponse.json(
      {
        message: 'Missing surfActivityId',
      },
      {
        status: 400,
      }
    );
  }

  await new SurfRating(token.id).deletebyActivityAndUserId(surfActivityId);
  return NextResponse.json(
    {
      message: 'Surf activity deleted successfully',
    },
    {
      status: 201,
    }
  );
}

export async function POST(req: NextRequest, res: NextResponse) {
  if (!req.url) {
    return NextResponse.json(
      {
        message: 'No URL provided.',
      },
      {
        status: 400,
      }
    );
  }

  try {
    const token = await getToken({ req });
    if (!token?.id) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    const data: CreateSurfRatingInputType = await req.json();

    // Create a new SurfActivity entry
    await new SurfRating(token.id).create(data);

    return NextResponse.json(
      {
        message: 'Surf activity saved successfully',
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('Error creating surf activity:', error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
      },
      {
        status: 500,
      }
    );
  }
}
