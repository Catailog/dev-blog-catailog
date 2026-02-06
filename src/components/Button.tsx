import clsx from 'clsx';
import { type ComponentPropsWithoutRef } from 'react';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        props.className ?? '',
        'cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100',
        'dark:text-gray-200 dark:hover:bg-gray-800',
      )}
    >
      {children}
    </button>
  );
}
