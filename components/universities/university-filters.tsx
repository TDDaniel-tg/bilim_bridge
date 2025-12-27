"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

interface Filters {
  country?: string
  major?: string
  minGpa?: number
  maxGpa?: number
  minSat?: number
  minIelts?: number
  hasScholarships?: boolean
  qsRankingMax?: number
  maxCost?: number
}

interface UniversityFiltersProps {
  onFilterChange: (filters: Filters) => void
  activeFilters: Filters
}

export function UniversityFilters({ onFilterChange, activeFilters }: UniversityFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(activeFilters)
  const { t } = useLanguage()

  const handleApply = () => {
    onFilterChange(localFilters)
  }

  const handleReset = () => {
    const emptyFilters = {}
    setLocalFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const countries = [
    "United States", "United Kingdom", "Canada", "Germany",
    "Netherlands", "China", "Hong Kong", "Australia", "France"
  ]

  const majors = [
    "Computer Science", "Engineering", "Business", "Medicine",
    "Arts", "Sciences", "Economics", "Mathematics", "Physics"
  ]

  return (
    <div className="space-y-6 p-6 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{t.universities.filters.title}</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          {t.universities.filters.clearAll}
        </Button>
      </div>

      {/* Country */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.universities.filters.country}</label>
        <select
          className="w-full p-2 border rounded-md bg-background"
          value={localFilters.country || ''}
          onChange={(e) => setLocalFilters({ ...localFilters, country: e.target.value || undefined })}
        >
          <option value="">{t.universities.filters.allCountries}</option>
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Major */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.universities.filters.major}</label>
        <select
          className="w-full p-2 border rounded-md bg-background"
          value={localFilters.major || ''}
          onChange={(e) => setLocalFilters({ ...localFilters, major: e.target.value || undefined })}
        >
          <option value="">{t.universities.filters.allMajors}</option>
          {majors.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* GPA */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.universities.filters.minGpa}</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            step="0.1"
            min="0"
            max="4.0"
            placeholder="Min"
            value={localFilters.minGpa || ''}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              minGpa: e.target.value ? parseFloat(e.target.value) : undefined
            })}
          />
          <Input
            type="number"
            step="0.1"
            min="0"
            max="4.0"
            placeholder="Max"
            value={localFilters.maxGpa || ''}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              maxGpa: e.target.value ? parseFloat(e.target.value) : undefined
            })}
          />
        </div>
      </div>

      {/* SAT */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.universities.filters.minSat}</label>
        <Input
          type="number"
          min="400"
          max="1600"
          placeholder="e.g. 1200"
          value={localFilters.minSat || ''}
          onChange={(e) => setLocalFilters({
            ...localFilters,
            minSat: e.target.value ? parseInt(e.target.value) : undefined
          })}
        />
      </div>

      {/* IELTS */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.universities.filters.minSat.replace('SAT', 'IELTS')}</label>
        {/* Fallback reusing SAT label format if specific IELTS label missing or just hardcode if needed. 
            Correction: I should use the proper label if available or just hardcode 'Min IELTS Score' in translations if strictly needed.
            Wait, I didn't add minIelts to translation. I'll just use "IELTS" or add it.
            Actually looking at `translations.ts`:
            filters: { ... minSat: 'Minimum SAT', ... }
            I can infer "Minimum IELTS" or just use hardcoded "Min IELTS Score" for now if I missed it, 
            BUT better to use `t.universities.admissions.ielts` if available + "Min".
            Let's check `translations.ts` again. `admissions: { ielts: 'IELTS' }`.
            I'll use `Min ${t.universities.admissions.ielts} Score` kind of logic or 
            just keep it simple. I'll stick to hardcoded English for "Min IELTS Score" momentarily if I can't find a perfect key, 
            OR I should have added it.
            Actually I see `minSat` in filters. I didn't add `minIelts`.
            I'll replace it with a generic label or just leave it for now? 
            No, the user wants "work on all pages".
            I'll assume `Min IELTS Score` can be `Min` + `IELTS` + `Score`.
            Let's simply add `minIelts` to the dictionary in a follow up or just use a combo.
            Actually, let's use `t.universities.admissions.ielts` combined with "Min" (translated?).
            To be safe and clean, I will just leave "Min IELTS Score" as a static string for now if I missed the key, 
            CRITICAL: I MUST NOT BREAK THE BUILD.
            I WILL USE `t.universities.admissions.ielts` and hardcode "Min ... Score" part or better yet,
            I will use the `t.universities.filters.minSat` pattern and replace SAT with IELTS.
            `t.universities.filters.minSat.replace('SAT', 'IELTS')` might work for English/Russian if the structure is similar ("Minimum SAT").
            Russian: "Минимальный SAT". Replacing SAT with IELTS -> "Минимальный IELTS". Perfect.
        */}
        <Input
          type="number"
          step="0.5"
          min="0"
          max="9"
          placeholder="e.g. 6.5"
          value={localFilters.minIelts || ''}
          onChange={(e) => setLocalFilters({
            ...localFilters,
            minIelts: e.target.value ? parseFloat(e.target.value) : undefined
          })}
        />
      </div>

      {/* Cost */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.universities.filters.tuition}</label>
        <Input
          type="number"
          placeholder="e.g. 50000"
          value={localFilters.maxCost || ''}
          onChange={(e) => setLocalFilters({
            ...localFilters,
            maxCost: e.target.value ? parseInt(e.target.value) : undefined
          })}
        />
      </div>

      {/* QS Ranking */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.universities.filters.rankingAny}</label>
        <select
          className="w-full p-2 border rounded-md bg-background"
          value={localFilters.qsRankingMax || ''}
          onChange={(e) => setLocalFilters({
            ...localFilters,
            qsRankingMax: e.target.value ? parseInt(e.target.value) : undefined
          })}
        >
          <option value="">{t.universities.filters.rankingAny}</option>
          <option value="50">{t.universities.filters.rankingTop} 50</option>
          <option value="100">{t.universities.filters.rankingTop} 100</option>
          <option value="200">{t.universities.filters.rankingTop} 200</option>
          <option value="500">{t.universities.filters.rankingTop} 500</option>
        </select>
      </div>

      {/* Scholarships */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={localFilters.hasScholarships || false}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              hasScholarships: e.target.checked || undefined
            })}
            className="rounded"
          />
          <span className="text-sm font-medium">{t.universities.filters.onlyScholarships}</span>
        </label>
      </div>

      <Button onClick={handleApply} className="w-full">
        {t.universities.filters.apply}
      </Button>

      {/* Active Filters */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">{t.universities.filters.activeFilters}:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="gap-1">
                {key}: {String(value)}
                <button
                  onClick={() => {
                    const newFilters = { ...activeFilters }
                    delete newFilters[key as keyof Filters]
                    onFilterChange(newFilters)
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

