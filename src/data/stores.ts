export interface StoreLocation {
  id: string;
  name: string;
  city: string;
  area: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  days: string;
  features: string[];
  isFlagship: boolean;
  mapEmbedPlaceholder: string;
}

export const PHYSICAL_STORES: StoreLocation[] = [];
