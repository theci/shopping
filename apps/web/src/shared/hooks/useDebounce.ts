'use client';

import { useState, useEffect } from 'react';

/**
 * 값 디바운스 훅
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 콜백 함수 디바운스 훅
 * @param callback - 디바운스할 함수
 * @param delay - 지연 시간 (ms)
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number = 300
): T {
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = ((...args: Parameters<T>) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    const newTimerId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimerId(newTimerId);
  }) as T;

  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  return debouncedCallback;
}
