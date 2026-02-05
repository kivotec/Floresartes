import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const [flowersRes, colorsRes, sizesRes, complementsRes] = await Promise.all([
      supabase
        .from('flowers')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true }),
      supabase
        .from('colors')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true }),
      supabase
        .from('sizes')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true }),
      supabase
        .from('complements')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true }),
    ])

    if (flowersRes.error || colorsRes.error || sizesRes.error || complementsRes.error) {
      return NextResponse.json(
        { error: 'Failed to fetch customizations' },
        { status: 400 }
      )
    }

    // Map snake_case from database to camelCase for frontend types
    const mapFlower = (flower: any) => ({
      id: flower.id,
      name: flower.name,
      category: 'flower',
      price: flower.price,
      active: flower.is_active,
      order: flower.display_order,
    })

    const mapColor = (color: any) => ({
      id: color.id,
      name: color.name,
      category: 'color',
      hexCode: color.hex_code,
      price: color.price,
      active: color.is_active,
      order: color.display_order,
    })

    const mapSize = (size: any) => ({
      id: size.id,
      name: size.name,
      category: 'size',
      price: size.price,
      priceModifier: size.price_modifier,
      active: size.is_active,
      order: size.display_order,
    })

    const mapComplement = (complement: any) => ({
      id: complement.id,
      name: complement.name,
      category: 'complement',
      type: complement.type,
      price: complement.price,
      active: complement.is_active,
      order: complement.display_order,
    })

    return NextResponse.json(
      {
        flowers: flowersRes.data.map(mapFlower),
        colors: colorsRes.data.map(mapColor),
        sizes: sizesRes.data.map(mapSize),
        complements: complementsRes.data.map(mapComplement),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customizations' },
      { status: 500 }
    )
  }
}
