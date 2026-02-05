import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('bouquets')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Map snake_case from database to camelCase for frontend types
    const mappedData = data.map((bouquet: any) => ({
      id: bouquet.id,
      name: bouquet.name,
      description: bouquet.description,
      shortDescription: bouquet.description || '',
      price: parseFloat(bouquet.price),
      images: bouquet.image_url ? [bouquet.image_url] : [],
      category: bouquet.category,
      allowsCustomization: true,
      featured: bouquet.is_featured,
      active: bouquet.is_active,
      createdAt: bouquet.created_at,
    }))

    return NextResponse.json(mappedData, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bouquets' },
      { status: 500 }
    )
  }
}
