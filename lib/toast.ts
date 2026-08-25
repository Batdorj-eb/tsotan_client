export type ToastType = "ok" | "error";

export type ToastDetail = {
  message: string;
  type: ToastType;
};

const EVENT = "tsotan-toast";

export function toast(message: string, type: ToastType = "ok") {
  if (typeof window === "undefined" || !message) return;
  window.dispatchEvent(new CustomEvent<ToastDetail>(EVENT, { detail: { message, type } }));
}

export function onToast(handler: (detail: ToastDetail) => void) {
  const listener = (event: Event) => {
    const custom = event as CustomEvent<ToastDetail>;
    if (custom.detail?.message) handler(custom.detail);
  };
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
