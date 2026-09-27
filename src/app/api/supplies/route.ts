import { NextResponse } from 'next/server';
import { getAllSupplies, saveSupply, deleteSupply } from '../../../lib/db';
import { SupplyItem } from '../../../types/asset';

export async function GET() {
  try {
    const supplies = getAllSupplies();
    return NextResponse.json({ success: true, data: supplies });
  } catch (error) {
    console.error('Error fetching supplies:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch supplies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: SupplyItem = await request.json();
    if (!body.id || !body.code || !body.name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    saveSupply(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error('Error saving supply:', error);
    return NextResponse.json({ success: false, error: 'Failed to save supply' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body: SupplyItem = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Missing supply ID' }, { status: 400 });
    }
    saveSupply(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error('Error updating supply:', error);
    return NextResponse.json({ success: false, error: 'Failed to update supply' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing supply ID' }, { status: 400 });
    }
    deleteSupply(id);
    return NextResponse.json({ success: true, message: 'Supply deleted successfully' });
  } catch (error) {
    console.error('Error deleting supply:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete supply' }, { status: 500 });
  }
}
