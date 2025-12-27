"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, TrendingUp, Award, Heart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useLanguage } from "@/lib/contexts/language-context"

interface UniversityCardProps {
  university: {
    id: string
    nameEn: string
    country: string
    city: string
    logo?: string | null
    qsRanking?: number | null
    acceptanceRate?: number | null
    tuitionIntl?: number | null
    hasFullRide?: boolean
    hasMeritScholarships?: boolean
  }
  fitScore?: number
  onFavorite?: () => void
  isFavorited?: boolean
}

export function UniversityCard({
  university,
  fitScore,
  onFavorite,
  isFavorited
}: UniversityCardProps) {
  const { t } = useLanguage()

  const getCategoryColor = (score?: number) => {
    if (!score) return ""
    if (score <= 40) return "text-red-600 bg-red-50"
    if (score <= 70) return "text-yellow-600 bg-yellow-50"
    return "text-green-600 bg-green-50"
  }

  const getCategoryLabel = (score?: number) => {
    if (!score) return null
    if (score <= 40) return t.universities.card.reach
    if (score <= 70) return t.universities.card.target
    return t.universities.card.safety
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {university.logo && (
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={university.logo}
                  alt={university.nameEn}
                  fill
                  className="object-contain rounded"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Link href={`/universities/${university.id}`}>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                  {university.nameEn}
                </h3>
              </Link>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {t.universities.card.location.replace('{city}', university.city).replace('{country}', university.country)}
              </div>
            </div>
          </div>
          {onFavorite && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onFavorite}
              className="flex-shrink-0"
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rankings and Stats */}
        <div className="flex flex-wrap gap-2">
          {university.qsRanking && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {t.universities.card.qs.replace('{rank}', university.qsRanking.toString())}
            </Badge>
          )}
          {university.acceptanceRate && (
            <Badge variant="outline">
              {t.universities.card.acceptance.replace('{rate}', university.acceptanceRate.toString())}
            </Badge>
          )}
          {university.hasFullRide && (
            <Badge className="bg-green-600 hover:bg-green-700">
              <Award className="h-3 w-3 mr-1" />
              {t.universities.card.fullRide}
            </Badge>
          )}
        </div>

        {/* Financial Info */}
        {university.tuitionIntl && (
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="font-semibold">
              {formatCurrency(university.tuitionIntl)}
            </span>
            <span className="text-muted-foreground ml-1">{t.universities.card.perYear}</span>
          </div>
        )}

        {/* Fit Score */}
        {fitScore !== undefined && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t.universities.card.fit}:</span>
              <Badge className={getCategoryColor(fitScore)}>
                {fitScore}% - {getCategoryLabel(fitScore)}
              </Badge>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href={`/universities/${university.id}`} className="flex-1">
            <Button className="w-full" size="sm">
              {t.universities.card.viewDetails}
            </Button>
          </Link>
          {university.hasMeritScholarships && (
            <Badge variant="outline" className="flex items-center">
              {t.universities.card.scholarships}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

