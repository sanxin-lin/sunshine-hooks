import type { Ref } from 'vue';
export type UseEventSourceOptions = EventSourceInit;
export declare function useEventSource(url: string | URL, events?: string[], options?: UseEventSourceOptions): {
    eventSource: Ref<EventSource | null>;
    event: Ref<string | null>;
    data: Ref<string | null>;
    status: Ref<"OPEN" | "CONNECTING" | "CLOSED">;
    error: Ref<Event | null>;
    close: () => void;
};
export type UseEventSourceReturn = ReturnType<typeof useEventSource>;
