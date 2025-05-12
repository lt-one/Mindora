"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants> & {
      variant?: "default" | "outline"
      orientation?: "horizontal" | "vertical"
    }
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      orientation = "horizontal",
      ...props
    },
    ref
  ) => {
    return (
      <ToggleGroupContext.Provider value={{ variant, size }}>
        <ToggleGroupPrimitive.Root
          ref={ref}
          data-orientation={orientation}
          className={cn(
            "flex",
            orientation === "horizontal" ? "space-x-px" : "flex-col space-y-px",
            className
          )}
          {...props}
        />
      </ToggleGroupContext.Provider>
    )
  }
)
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)
  const itemVariant = variant || context.variant
  const itemSize = size || context.size

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: itemVariant,
          size: itemSize,
        }),
        // 修改边框圆角，内部项目边框连接
        "data-[orientation=horizontal]:first:rounded-l-md data-[orientation=horizontal]:last:rounded-r-md data-[orientation=horizontal]:border-x-0 data-[orientation=horizontal]:first:border-l data-[orientation=horizontal]:last:border-r",
        "data-[orientation=vertical]:first:rounded-t-md data-[orientation=vertical]:last:rounded-b-md data-[orientation=vertical]:border-y-0 data-[orientation=vertical]:first:border-t data-[orientation=vertical]:last:border-b",
        "border border-input",
        className
      )}
      {...props}
    />
  )
})
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem } 