import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
}

export function Header({ title, leftAction, rightAction }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="w-10">{leftAction}</div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
        <div className="w-10 flex justify-end">{rightAction}</div>
      </div>
    </header>
  );
}
