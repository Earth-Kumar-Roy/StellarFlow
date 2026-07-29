export function logEvent(eventName: string, details?: Record<string, any>) {
  console.log(`[StellarFlow Analytics] ${eventName}`, details || {});
}