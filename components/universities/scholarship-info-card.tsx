"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, Award, Globe, TrendingUp } from "lucide-react"

interface ScholarshipInfoCardProps {
    hasMeritScholarships?: boolean
    meritDescription?: string | null
    hasNeedBased?: boolean
    needBasedDescription?: string | null
    needBasedIntl?: boolean
    hasFullRide?: boolean
    finAidPercentage?: number | null
}

export function ScholarshipInfoCard({
    hasMeritScholarships,
    meritDescription,
    hasNeedBased,
    needBasedDescription,
    needBasedIntl,
    hasFullRide,
    finAidPercentage
}: ScholarshipInfoCardProps) {
    const hasAnyScholarship = hasMeritScholarships || hasNeedBased || hasFullRide

    if (!hasAnyScholarship && !finAidPercentage) {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Scholarships & Financial Aid
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Financial Aid Statistics */}
                {finAidPercentage && (
                    <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                            <span className="font-semibold">{(finAidPercentage * 100).toFixed(0)}%</span> of students receive financial aid
                        </AlertDescription>
                    </Alert>
                )}

                {/* Full Ride Scholarships */}
                {hasFullRide && (
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="h-5 w-5 text-yellow-600" />
                            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Full-Ride Scholarships Available</h4>
                        </div>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            This university offers full-ride scholarships covering tuition, room & board
                        </p>
                    </div>
                )}

                {/* Merit-Based Scholarships */}
                {hasMeritScholarships && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="h-4 w-4 text-primary" />
                            <h4 className="font-medium">Merit-Based Scholarships</h4>
                            <Badge variant="secondary">Available</Badge>
                        </div>
                        {meritDescription && (
                            <p className="text-sm text-muted-foreground ml-6 whitespace-pre-line">
                                {meritDescription}
                            </p>
                        )}
                    </div>
                )}

                {/* Need-Based Aid */}
                {hasNeedBased && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <h4 className="font-medium">Need-Based Financial Aid</h4>
                            <Badge variant="secondary">Available</Badge>
                            {needBasedIntl && (
                                <Badge variant="outline" className="gap-1">
                                    <Globe className="h-3 w-3" />
                                    International Students
                                </Badge>
                            )}
                        </div>
                        {needBasedDescription && (
                            <p className="text-sm text-muted-foreground ml-6 whitespace-pre-line">
                                {needBasedDescription}
                            </p>
                        )}
                    </div>
                )}

                {!hasAnyScholarship && finAidPercentage && (
                    <p className="text-sm text-muted-foreground">
                        While specific scholarship programs are not listed, {(finAidPercentage * 100).toFixed(0)}% of students receive some form of financial assistance.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
