import { UserAddress } from '@/types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  gender?: 'male' | 'female' | 'other';
  height?: string;
  weight?: string;
  primarySport?: string;
  addresses: UserAddress[];
  createdAt: string;
  isLoggedIn: boolean;
}

export const DEFAULT_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  mobile: '',
  addresses: [],
  createdAt: '',
  isLoggedIn: false
};

export const authService = {
  getDefaultUser(): UserProfile {
    return DEFAULT_USER;
  },

  getUser(): UserProfile {
    if (typeof window === 'undefined') return DEFAULT_USER;
    const stored = localStorage.getItem('zyphor_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && (!parsed.isLoggedIn || !parsed.name?.trim())) {
          return DEFAULT_USER;
        }
        return parsed;
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  },

  async login(mobileOrEmail: string): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const user: UserProfile = {
      ...DEFAULT_USER,
      mobile: mobileOrEmail.includes('@') ? DEFAULT_USER.mobile : mobileOrEmail,
      email: mobileOrEmail.includes('@') ? mobileOrEmail : DEFAULT_USER.email,
      isLoggedIn: true
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('zyphor_user', JSON.stringify(user));
    }
    return user;
  },

  async sendOtp(mobile: string): Promise<{ success: boolean; testOtp: string; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return {
      success: true,
      testOtp: '5699',
      message: `OTP sent to ${mobile}. For test/demo use: 5699`
    };
  },

  async verifyOtp(mobile: string, otp: string): Promise<{ success: boolean; user?: UserProfile; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (otp === '5699' || otp.length === 4) {
      const user = await this.login(mobile);
      return { success: true, user, message: 'OTP verified successfully!' };
    }
    return { success: false, message: 'Invalid OTP code. Please enter 5699.' };
  },

  async updateUser(updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = this.getUser();
    const updated = { ...current, ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem('zyphor_user', JSON.stringify(updated));
    }
    return updated;
  },

  async saveAddress(address: Omit<UserAddress, 'id'> & { id?: string }): Promise<UserAddress[]> {
    const current = this.getUser();
    let addrs = [...current.addresses];

    if (address.id) {
      addrs = addrs.map((a) => (a.id === address.id ? ({ ...a, ...address } as UserAddress) : a));
    } else {
      const newAddr: UserAddress = {
        ...address,
        id: `addr-${Date.now()}`
      };
      if (newAddr.isDefault) {
        addrs = addrs.map((a) => ({ ...a, isDefault: false }));
      }
      addrs.push(newAddr);
    }

    if (address.isDefault) {
      addrs = addrs.map((a) => ({ ...a, isDefault: a.id === address.id || (!address.id && a.id === addrs[addrs.length - 1].id) }));
    }

    await this.updateUser({ addresses: addrs });
    return addrs;
  },

  async deleteAddress(id: string): Promise<UserAddress[]> {
    const current = this.getUser();
    const filtered = current.addresses.filter((a) => a.id !== id);
    await this.updateUser({ addresses: filtered });
    return filtered;
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zyphor_user');
    }
  }
};
