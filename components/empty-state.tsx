import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  title: string
  description: string
  createLink?: string
  createLabel?: string
}

export function EmptyState({
  title,
  description,
  createLink,
  createLabel,
}: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-12 border rounded-md'>
      <h3 className='text-lg font-medium'>{title}</h3>
      <p className='text-sm text-muted-foreground mt-1'>{description}</p>

      {createLink && createLabel && (
        <Button asChild className='mt-4'>
          <Link href={createLink}>
            <PlusIcon className='h-4 w-4 mr-2' />
            {createLabel}
          </Link>
        </Button>
      )}
    </div>
  )
}
