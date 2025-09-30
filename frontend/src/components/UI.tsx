import React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { CheckCircle2, X, AlertTriangle } from 'lucide-react';

const cn = (...classes: Array<string | undefined | null | false>) =>
  twMerge(classes.filter(Boolean).join(' '));

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary',
        secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:ring-slate-400',
        ghost: 'bg-transparent text-slate-300 hover:bg-slate-800 focus-visible:ring-slate-600'
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-6'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = 'Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-md border border-border bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn('text-xs font-semibold uppercase tracking-wide text-slate-400', className)} {...props} />
));
Label.displayName = 'Label';

export const Table = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('w-full overflow-hidden rounded-lg border border-slate-800', className)} {...props} />
);

export const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('grid grid-cols-[1fr_auto] items-center gap-4 bg-slate-900 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid-cols-[2fr_repeat(2,_1fr)_auto]', className)} {...props} />
);

export const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('divide-y divide-slate-800', className)} {...props} />
);

export const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 text-sm text-slate-100 md:grid-cols-[2fr_repeat(2,_1fr)_auto]', className)} {...props} />
);

export const TableCell = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('truncate', className)} {...props} />
);

type ToastVariant = 'success' | 'error' | 'info';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

interface ToastItem extends ToastOptions {
  id: number;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const remove = React.useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = React.useCallback<ToastContextValue['toast']>((options) => {
    const id = Date.now() + Math.random();
    const variant = options.variant ?? 'info';
    setToasts((current) => [...current, { id, variant, ...options }]);
    window.setTimeout(() => {
      remove(id);
    }, 3000);
  }, [remove]);

  const value = React.useMemo<ToastContextValue>(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};

const iconForVariant = (variant: ToastVariant) => {
  switch (variant) {
    case 'success':
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-400" />;
    default:
      return <CheckCircle2 className="h-4 w-4 text-primary" />;
  }
};

const ToastViewport: React.FC<{ toasts: ToastItem[]; onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => (
  <div className="pointer-events-none fixed inset-x-0 top-4 flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/95 p-4 shadow-lg backdrop-blur"
      >
        <div className="mt-1">{iconForVariant(toast.variant ?? 'info')}</div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-100">{toast.title}</p>
          {toast.description ? (
            <p className="mt-1 text-xs text-slate-400">{toast.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="rounded bg-transparent p-1 text-slate-500 transition hover:text-slate-200"
          aria-label="Dismiss"
          onClick={() => onDismiss(toast.id)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ))}
  </div>
);
