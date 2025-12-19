import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
  size?: "sm" | "md" | "lg" | "icon";
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]",
      outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      link: "text-primary underline-offset-4 hover:underline",
    };
    const sizes = {
      sm: "h-8 rounded-md px-3 text-xs",
      md: "h-9 px-4 py-2",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9 p-0"
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Input
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Select
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            className
          )}
          ref={ref}
          {...props}
        />
        <span className="absolute right-3 top-2.5 pointer-events-none opacity-50 text-xs text-muted-foreground">▼</span>
      </div>
    );
  }
);
Select.displayName = "Select";

// Textarea
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// Card
export function Card({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)}>{children}</div>;
}
export function CardHeader({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>;
}
export function CardTitle({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <h3 className={cn("font-semibold leading-none tracking-tight", className)}>{children}</h3>;
}
export function CardContent({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

// Badge
export function Badge({ className, variant = "default", children, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "destructive" | "outline" }) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
    outline: "text-foreground border border-input",
  };
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

// Checkbox
export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => (
    <input 
        type="checkbox" 
        ref={ref}
        className={cn("h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground accent-primary", className)} 
        {...props} 
    />
));
Checkbox.displayName = "Checkbox";

// Switch
export const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, checked, ...props }, ref) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" ref={ref} className="sr-only peer" checked={checked} {...props} />
      <div className="w-9 h-5 bg-input peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
    </label>
  )
);
Switch.displayName = "Switch";

// Tabs
export function Tabs({ defaultValue, children, onValueChange, className }: { defaultValue: string, children?: React.ReactNode, onValueChange?: (val: string) => void, className?: string }) {
  const [active, setActive] = React.useState(defaultValue);
  
  const handleTabChange = (val: string) => {
      setActive(val);
      if(onValueChange) onValueChange(val);
  }

  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
           return React.cloneElement(child, { activeValue: active, onTabChange: handleTabChange } as any);
        }
        return child;
      })}
    </div>
  );
}
export function TabsList({ className, children, activeValue, onTabChange }: any) {
  return (
    <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>
      {React.Children.map(children, child => {
         if (React.isValidElement(child)) {
            return React.cloneElement(child, { activeValue, onTabChange } as any);
         }
         return child;
      })}
    </div>
  );
}
export function TabsTrigger({ value, children, activeValue, onTabChange, className }: any) {
  const isActive = activeValue === value;
  return (
    <button
      onClick={() => onTabChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}
export function TabsContent({ value, activeValue, children, className }: any) {
  if (value !== activeValue) return null;
  return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>{children}</div>;
}

// Label
export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props}>{children}</label>
}

// Avatar
export function Avatar({ src, fallback, className, ...props }: { src?: string, fallback: string, className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border", className)} {...props}>
      {src ? (
        <img className="aspect-square h-full w-full object-cover" src={src} alt="Avatar" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {fallback}
        </div>
      )}
    </div>
  );
}

// Dropdown (Simple implementation)
export function DropdownMenu({ children }: { children?: React.ReactNode }) {
    return <div className="relative inline-block text-left w-full">{children}</div>;
}

export function DropdownTrigger({ children, onClick, asChild }: { children?: React.ReactNode, onClick?: () => void, asChild?: boolean }) {
    // This is just a pass-through wrapper for custom logic in parent
    return <div onClick={onClick} className="cursor-pointer">{children}</div>;
}

export function DropdownContent({ children, isOpen, onClose, className }: { children?: React.ReactNode, isOpen: boolean, onClose: () => void, className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if(isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div ref={ref} className={cn("absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95", className)}>
            {children}
        </div>
    );
}

export function DropdownItem({ children, onClick, className }: { children?: React.ReactNode, onClick?: () => void, className?: string }) {
    return (
        <div 
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
            className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
        >
            {children}
        </div>
    );
}

export function DropdownSeparator() {
    return <div className="-mx-1 my-1 h-px bg-muted" />;
}