import type { MatchSummary } from '@/app/custom/actions';

const STORAGE_KEY = 'ever-custom-state-v1';

export type CustomMode = 'choose' | 'describe' | 'build';

export interface PersistedSelection {
    valueId: string;
    valueName: string;
}

export interface PersistedState {
    mode?: CustomMode;
    stepIndex?: number;
    selections?: Record<string, PersistedSelection>;
    completed?: boolean;
    matches?: MatchSummary | null;
}

export function loadCustomState(): PersistedState {
    if (typeof window === 'undefined') return {};
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export function patchCustomState(patch: PersistedState): void {
    if (typeof window === 'undefined') return;
    try {
        const existing = loadCustomState();
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...patch }));
    } catch {
        /* ignore quota / privacy-mode errors */
    }
}

export function clearCustomState(): void {
    if (typeof window === 'undefined') return;
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        /* ignore */
    }
}
