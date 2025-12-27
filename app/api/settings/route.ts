
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const config = await prisma.siteConfig.findFirst();

        // Return default if no config exists, or the found config
        if (!config) {
            return NextResponse.json({
                siteName: 'Bilim Bridge',
                supportEmail: 'support@bilimbridge.com',
                phoneNumber: '+996 XXX XXX XXX',
                address: 'Bishkek, Kyrgyzstan',
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error fetching site config:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { siteName, supportEmail, phoneNumber, address } = body;

        // Use upsert to create if not exists, or update if exists
        // Since we want a singleton, we can try to find the first one or just always use the first ID we find?
        // A better approach for singleton in SQL is a bit tricky, but for now we can:
        // 1. Find the first record
        // 2. If exists, update it
        // 3. If not, create it

        const existing = await prisma.siteConfig.findFirst();

        let config;
        if (existing) {
            config = await prisma.siteConfig.update({
                where: { id: existing.id },
                data: { siteName, supportEmail, phoneNumber, address },
            });
        } else {
            config = await prisma.siteConfig.create({
                data: { siteName, supportEmail, phoneNumber, address },
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error updating site config:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
