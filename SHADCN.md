# Adding shadcn/ui Components

This project is configured to work with shadcn/ui components. Since we're using path aliases and have the necessary dependencies installed, you can easily add more components.

## How to Add Components

### Manual Method

1. Visit [ui.shadcn.com](https://ui.shadcn.com)
2. Browse the components library
3. Click on a component you want to add
4. Copy the component code
5. Create a new file in `src/components/ui/` (e.g., `dialog.tsx`)
6. Paste the code and save

### Example: Adding a Badge Component

Create `src/components/ui/badge.tsx`:

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

Then use it in your components:

```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="secondary">New</Badge>
```

## Available Components

Some popular components you might want to add:
- Dialog/Modal
- Dropdown Menu
- Select
- Tabs
- Tooltip
- Badge
- Avatar
- Alert
- Sheet (Drawer)
- Popover
- Command (Command palette)
- And many more!

Check out the full list at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)
