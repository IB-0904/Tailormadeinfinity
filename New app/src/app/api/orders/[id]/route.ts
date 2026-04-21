import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_mvp_only_please_change';

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
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
    const { status } = await req.json();
    const orderId = parseInt(params.id);

    if (!orderId || isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // Determine what update to perform based on role
    if (decoded.role === 'COURIER') {
      const order = await prisma.order.findUnique({ where: { id: orderId } });

      if (!order) {
         return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      if (status === 'ACCEPTED' && order.status === 'PENDING') {
         // Accept order
         const updatedOrder = await prisma.order.update({
           where: { id: orderId },
           data: { status: 'ACCEPTED', courierId: decoded.userId }
         });
         return NextResponse.json({ order: updatedOrder }, { status: 200 });
      } else if ((status === 'IN_TRANSIT' || status === 'DELIVERED') && order.courierId === decoded.userId) {
         // Update status of accepted order
         const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status }
          });
          return NextResponse.json({ order: updatedOrder }, { status: 200 });
      } else {
          return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }
    } else if (decoded.role === 'ADMIN') {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status }
          });
          return NextResponse.json({ order: updatedOrder }, { status: 200 });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
