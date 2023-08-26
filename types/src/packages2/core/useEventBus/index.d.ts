import { type EventBusIdentifier, type UseEventBusReturn } from './constants';
export declare function useEventBus<T = unknown>(key: EventBusIdentifier): UseEventBusReturn<T>;
