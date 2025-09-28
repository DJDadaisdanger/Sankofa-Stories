'use client';
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [value, setValue] = useState<T>(initialValue);

    useEffect(() => {
        // This effect runs only on the client, after the initial server render
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setValue(JSON.parse(item));
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
        }
    }, [key]);

    const setStoredValue = (newValue: T | ((val: T) => T)) => {
        try {
            const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
            setValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [value, setStoredValue];
}
