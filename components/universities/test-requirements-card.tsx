"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, FileText, Languages } from "lucide-react"

interface TestRequirementsCardProps {
    minToefl?: number | null
    minIelts?: number | null
    minSat?: number | null
    minAct?: number | null
    minGpa?: number | null
}

export function TestRequirementsCard({
    minToefl,
    minIelts,
    minSat,
    minAct,
    minGpa
}: TestRequirementsCardProps) {
    const hasAnyRequirement = minToefl || minIelts || minSat || minAct || minGpa

    if (!hasAnyRequirement) {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Test Requirements
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Language Tests */}
                {(minToefl || minIelts) && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Languages className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium">English Proficiency</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-6">
                            {minToefl && (
                                <Badge variant="secondary" className="text-sm">
                                    TOEFL: {minToefl}+
                                </Badge>
                            )}
                            {minIelts && (
                                <Badge variant="secondary" className="text-sm">
                                    IELTS: {minIelts}+
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Standardized Tests */}
                {(minSat || minAct) && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium">Standardized Tests</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-6">
                            {minSat && (
                                <Badge variant="secondary" className="text-sm">
                                    SAT: {minSat}+
                                </Badge>
                            )}
                            {minAct && (
                                <Badge variant="secondary" className="text-sm">
                                    ACT: {minAct}+
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* GPA */}
                {minGpa && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium">Academic Performance</h4>
                        </div>
                        <div className="ml-6">
                            <Badge variant="secondary" className="text-sm">
                                Minimum GPA: {minGpa.toFixed(2)}
                            </Badge>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
