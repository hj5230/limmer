import { FC, JSX } from 'preact/compat'
import { ScrollArea, Theme } from '@radix-ui/themes'
import './index.css'

interface SkeletonProps {
  children?: React.ReactNode
}

export const Skeleton: FC<SkeletonProps> = ({
  children,
}): JSX.Element => {
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
