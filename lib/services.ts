import type { ServiceItem } from "./types";

export function isRootService(item: ServiceItem) {
  return !item.parentId;
}

export function rootServices(items: ServiceItem[]) {
  return items.filter(isRootService);
}

export function childServices(items: ServiceItem[], parentId: number) {
  return items.filter((item) => item.parentId === parentId);
}
