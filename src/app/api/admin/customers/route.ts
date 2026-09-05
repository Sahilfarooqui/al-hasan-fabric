import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const customers = await prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
  if (req.nextUrl.searchParams.get('format') === 'csv') {
    const header = 'name,phone,email,whatsappConsent,createdAt\n';
    const rows = customers
      .map((c) =>
        [c.name, c.phone, c.email || '', c.whatsappConsent ? 'yes' : 'no', c.createdAt.toISOString()]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');
    return new NextResponse(header + rows, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="customers.csv"',
      },
    });
  }
  return NextResponse.json({ customers });
}
