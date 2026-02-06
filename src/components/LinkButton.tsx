import clsx from 'clsx';
import { type ComponentPropsWithoutRef } from 'react';
import { Link } from 'react-router-dom';

interface LinkButtonProps extends ComponentPropsWithoutRef<typeof Link> {}

export default function LinkButton({ children, ...props }: LinkButtonProps) {
  return (
    <Link
      {...props}
      className={clsx(
        props.className ?? '',
        'cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100',
        'dark:text-gray-200 dark:hover:bg-gray-800',
      )}
    >
      {children}
    </Link>
  );
}
