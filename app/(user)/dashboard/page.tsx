'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

const sections = [
  {
    title: 'Muay Thai Gyms',
    path: '/data/gyms',
    buttonText: 'Add Gym',
    addPath: '/data/gyms/create',
  },
  {
    title: 'Food Listings',
    path: '/data/food',
    buttonText: 'Add Food',
    addPath: '/data/food/create',
  },
  {
    title: 'Accommodation',
    path: '/data/accommodation',
    buttonText: 'Add Hotel',
    addPath: '/data/accommodation/create',
  },
  {
    title: 'Attractions',
    path: '/data/attraction',
    buttonText: 'Add Attraction',
    addPath: '/data/attraction/create',
  },
  {
    title: 'User Accounts',
    path: '/admin/users',
    buttonText: null,
  },
]

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-red-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <Link
                href={section.path}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Manage
              </Link>
              {section.buttonText && section.addPath && (
                <Link href={section.addPath}>
                  <Button className="flex gap-1 items-center" variant="outline">
                    <PlusIcon className="w-4 h-4" />
                    {section.buttonText}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
