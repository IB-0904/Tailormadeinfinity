import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_mvp_only_please_change';

const calculateMockDistance = (pickup: string, dropoff: string) => {
  // Simple deterministic mock distance based on string length difference + random factor
  const base = Math.abs(pickup.length - dropoff.length) * 2;
  return Math.max(1.5, base + (pickup.charCodeAt(0) % 5)); // Minimum 1.5 km
};

const calculatePrice = (distance: number) => {
  const baseFare = 5;
  const perKmRate = 2;
  return baseFare + (distance * perKmRate);
};

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: number, role: string };
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (decoded.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Only customers can place orders' }, { status: 403 });
    }

    const { pickup, dropoff } = await req.json();

    if (!pickup || !dropoff) {
      return NextResponse.json({ error: 'Pickup and dropoff are required' }, { status: 400 });
    }

    const distance = calculateMockDistance(pickup, dropoff);
    const price = calculatePrice(distance);

    const order = await prisma.order.create({
      data: {
        pickup,
        dropoff,
        distance,
        price,
        customerId: decoded.userId,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: number, role: string };
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let orders;

    if (decoded.role === 'CUSTOMER') {
      orders = await prisma.order.findMany({
        where: { customerId: decoded.userId },
        include: { courier: { select: { name: true, id: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } else if (decoded.role === 'COURIER') {
      // Couriers see available (PENDING) orders and their own orders
      orders = await prisma.order.findMany({
        where: {
          OR: [
            { status: 'PENDING' },
            { courierId: decoded.userId }
          ]
        },
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } else if (decoded.role === 'ADMIN') {
      orders = await prisma.order.findMany({
        include: {
          customer: { select: { name: true } },
          courier: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
