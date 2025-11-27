type EventHandler = (payload?: any) => void;

const listeners: Record<string, EventHandler[]> = {};

export function emit(event: string, payload?: any) {
    (listeners[event] || []).forEach(handler => handler(payload));
}

export function on(event: string, handler: EventHandler) {
    if (!listeners[event]) {
        listeners[event] = [];
    }
    listeners[event].push(handler);
}
