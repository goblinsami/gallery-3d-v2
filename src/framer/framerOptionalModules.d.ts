declare module "react" {
  export type CSSProperties = Record<string, string | number | undefined>;
  export interface RefObject<T> {
    current: T;
  }

  export function createElement(
    type: string,
    props?: Record<string, unknown> | null,
    ...children: unknown[]
  ): unknown;
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useMemo<T>(factory: () => T, deps?: readonly unknown[]): T;
  export function useRef<T>(initialValue: T): RefObject<T>;
  export function useState<T>(initialValue: T | (() => T)): [T, (value: T) => void];
}

declare module "framer" {
  export const ControlType: Record<string, string>;
  export function addPropertyControls(component: unknown, controls: Record<string, unknown>): void;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}
