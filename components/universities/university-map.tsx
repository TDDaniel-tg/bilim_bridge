"use client"

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Fix для иконок Leaflet в Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface University {
  id: string
  nameEn: string
  country: string
  city: string
  latitude: number
  longitude: number
  logo?: string
  qsRanking?: number
  acceptanceRate?: number
}

interface UniversityMapProps {
  universities: University[]
}

export default function UniversityMap({ universities }: UniversityMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Инициализация карты
    const map = L.map(mapContainerRef.current).setView([20, 0], 2)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // Удалить старые маркеры
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    if (universities.length === 0) return

    // Создать новые маркеры
    const markers: L.Marker[] = []
    const bounds: L.LatLngTuple[] = []

    universities.forEach(uni => {
      if (!uni.latitude || !uni.longitude) return

      const marker = L.marker([uni.latitude, uni.longitude])

      // Popup с информацией
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <h3 class="font-semibold text-base mb-2">${uni.nameEn}</h3>
          <p class="text-sm text-gray-600 mb-2">${uni.city}, ${uni.country}</p>
          ${uni.qsRanking ? `
            <div class="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
              QS #${uni.qsRanking}
            </div>
          ` : ''}
          ${uni.acceptanceRate ? `
            <p class="text-sm mb-2">
              Acceptance: <strong>${uni.acceptanceRate}%</strong>
            </p>
          ` : ''}
          <a 
            href="/universities/${uni.id}" 
            class="inline-block mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            View Details
          </a>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'university-popup'
      })

      marker.addTo(mapRef.current!)
      markers.push(marker)
      bounds.push([uni.latitude, uni.longitude])
    })

    markersRef.current = markers

    // Подогнать карту под все маркеры
    if (bounds.length > 0) {
      mapRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      })
    }
  }, [universities])

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[600px] rounded-lg overflow-hidden"
      style={{ zIndex: 0 }}
    />
  )
}

