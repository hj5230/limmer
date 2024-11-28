import { JSX } from 'preact/compat'
import { ScrollArea, Theme } from '@radix-ui/themes'
import '@/components/Skeleton/index.css'

interface SkeletonProps {
  children?: React.ReactNode
}

export function Skeleton({
  children,
}: SkeletonProps): JSX.Element {
  return (
    <Theme>
      <main>
        <div className="border">
          <ScrollArea>{children}</ScrollArea>
        </div>
      </main>
    </Theme>
  )
}
