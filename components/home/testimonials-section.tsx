"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Quote, Star } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

export function TestimonialsSection() {
  const { t } = useLanguage()

  const testimonials = [
    {
      name: "Айгерим Нурбекова",
      role: `MIT ${t.home.testimonials.roles.student}`,
      content: "Bilim Bridge помог мне найти идеальный университет! ИИ-ассистент дал отличные рекомендации, и я поступила в MIT с полной стипендией. Невероятная платформа!",
      rating: 5,
      initials: "АН",
      color: "bg-purple-500"
    },
    {
      name: "Нурсултан Әлімов",
      role: `Stanford ${t.home.testimonials.roles.student}`,
      content: "Очень удобный интерфейс и полезные функции. Особенно понравилась оценка соответствия - она точно показала мои шансы. Рекомендую всем абитуриентам!",
      rating: 5,
      initials: "НӘ",
      color: "bg-blue-500"
    },
    {
      name: "Дана Қасымова",
      role: `Oxford ${t.home.testimonials.roles.student}`,
      content: "Благодаря Bilim Bridge я нашла все необходимые стипендии и гранты. Чек-листы помогли не пропустить ни одного дедлайна. Поступила в Оксфорд!",
      rating: 5,
      initials: "ДҚ",
      color: "bg-pink-500"
    },
    {
      name: "Арман Токтаров",
      role: `Cambridge ${t.home.testimonials.roles.student}`,
      content: "Платформа сэкономила мне кучу времени на поиск университетов. Все в одном месте, удобно и быстро. Советую всем кто планирует учиться за рубежом!",
      rating: 5,
      initials: "АТ",
      color: "bg-orange-500"
    },
    {
      name: "Малика Сейдахметова",
      role: `Harvard ${t.home.testimonials.roles.student}`,
      content: "ИИ-ассистент просто супер! Ответил на все мои вопросы и помог с выбором специальности. Теперь я в Гарварде, спасибо Bilim Bridge!",
      rating: 5,
      initials: "МС",
      color: "bg-green-500"
    },
    {
      name: "Ерлан Жумабаев",
      role: `Yale ${t.home.testimonials.roles.student}`,
      content: "Отличная платформа с огромной базой университетов. Функция сравнения помогла выбрать лучший вариант. Очень доволен результатом!",
      rating: 5,
      initials: "ЕЖ",
      color: "bg-blue-500"
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.home.testimonials.title} <span className="text-gradient-primary">{t.home.testimonials.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.home.testimonials.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="card-glass border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="pt-6 pb-6">
                {/* Rating stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                {/* Quote icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-3" />

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {testimonial.content}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <Avatar className={testimonial.color}>
                    <AvatarFallback className="text-white font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

