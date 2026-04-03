import {
  CustomerRegisterRequest,
  CustomerLoginRequest,
  AuthResponse,
  CustomerProfile,
  CustomerProfileUpdate,
  ChangePasswordRequest,
  CreateCustomerBookingRequest,
  CreateCustomerBookingResponse,
  CustomerBookingsResponse,
  CancelBookingRequest,
  CancelBookingResponse,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyEmailRequest,
  SendEmailOTPResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  CustomerReviewsResponse,
  CustomerCouponsResponse,
  MessageResponse,
} from '@/types/customer';

export class CustomerService {
  private static baseURL = 'https://dev.kacc.mn/api/customers';

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add token to headers if provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const defaultOptions: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, defaultOptions);

      // Parse as text first to handle non-JSON error responses
      const text = await response.text();
      let data: Record<string, unknown> = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        // Non-JSON body (e.g. server 500 HTML/text)
        if (!response.ok) {
          if (response.status === 401) this.clearToken();
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      if (!response.ok) {
        // Clear saved token on 401 (expired/invalid)
        if (response.status === 401) {
          this.clearToken();
        }
        // Extract error message from API response
        const errorMessage = (data.error || data.message || data.detail || `HTTP error! status: ${response.status}`) as string;
        throw new Error(errorMessage);
      }

      return data as T;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Helper to add token as query parameter (as per API spec)
  private static addTokenToUrl(url: string, token: string): string {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}token=${encodeURIComponent(token)}`;
  }

  // ============================================================
  // Authentication & Registration
  // ============================================================

  /**
   * Register a new customer with email and password
   * POST /api/customers/register/
   */
  static async register(data: CustomerRegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Login with email and password
   * POST /api/customers/login/
   */
  static async login(data: CustomerLoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Logout and invalidate token
   * POST /api/customers/logout/
   */
  static async logout(token: string): Promise<MessageResponse> {
    const url = this.addTokenToUrl('/logout/', token);
    return this.request<MessageResponse>(url, {
      method: 'POST',
    });
  }

  // ============================================================
  // Profile Management
  // ============================================================

  /**
   * Get current user profile
   * GET /api/customers/profile/
   */
  static async getProfile(token: string): Promise<CustomerProfile> {
    const url = this.addTokenToUrl('/profile/', token);
    return this.request<CustomerProfile>(url);
  }

  /**
   * Update user profile (partial update)
   * PATCH /customers/profile/
   */
  static async updateProfile(
    token: string,
    data: CustomerProfileUpdate
  ): Promise<{ message: string; customer: CustomerProfile }> {
    const url = this.addTokenToUrl('/profile/', token);
    return this.request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Change password
   * PATCH /api/customers/change-password/
   */
  static async changePassword(
    token: string,
    data: ChangePasswordRequest
  ): Promise<MessageResponse> {
    const url = this.addTokenToUrl('/change-password/', token);
    return this.request<MessageResponse>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete account (soft delete)
   * DELETE /api/customers/delete/
   */
  static async deleteAccount(token: string): Promise<MessageResponse> {
    const url = this.addTokenToUrl('/delete/', token);
    return this.request<MessageResponse>(url, {
      method: 'DELETE',
    });
  }

  /**
   * Deactivate account
   * POST /customers/deactivate/
   */
  static async deactivateAccount(token: string): Promise<MessageResponse> {
    const url = this.addTokenToUrl('/deactivate/', token);
    return this.request<MessageResponse>(url, {
      method: 'POST',
    });
  }

  // ============================================================
  // Customer Bookings
  // ============================================================

  /**
   * Create a new booking (logged in or guest)
   * POST /api/customers/booking/create/
   */
  static async createBooking(
    data: CreateCustomerBookingRequest,
    token?: string
  ): Promise<CreateCustomerBookingResponse> {
    let url = '/booking/create/';
    if (token) {
      url = this.addTokenToUrl(url, token);
    }
    return this.request<CreateCustomerBookingResponse>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get booking history with optional status filter
   * GET /api/customers/bookings/
   */
  static async getBookings(
    token: string,
    status?: 'pending' | 'confirmed' | 'canceled' | 'finished'
  ): Promise<CustomerBookingsResponse> {
    let url = '/bookings/';
    url = this.addTokenToUrl(url, token);
    if (status) {
      url += `&status=${status}`;
    }
    return this.request<CustomerBookingsResponse>(url);
  }

  /**
   * Cancel a booking
   * POST /customers/booking/cancel/
   */
  static async cancelBooking(
    token: string,
    data: CancelBookingRequest
  ): Promise<CancelBookingResponse> {
    const url = this.addTokenToUrl('/booking/cancel/', token);
    return this.request<CancelBookingResponse>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============================================================
  // OTP & Verification
  // ============================================================

  /**
   * Send OTP to phone number
   * POST /api/customers/otp/send/
   */
  static async sendOTP(data: SendOTPRequest): Promise<SendOTPResponse> {
    return this.request<SendOTPResponse>('/otp/send/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Verify OTP and login
   * POST /api/customers/otp/verify/
   */
  static async verifyOTP(data: VerifyOTPRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/otp/verify/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Send email OTP for verification
   * POST /api/customers/verify/email/send/
   */
  static async sendEmailOTP(token: string): Promise<SendEmailOTPResponse> {
    const url = this.addTokenToUrl('/verify/email/send/', token);
    return this.request<SendEmailOTPResponse>(url, {
      method: 'POST',
    });
  }

  /**
   * Verify email with OTP
   * POST /api/customers/verify/email/
   */
  static async verifyEmail(
    token: string,
    data: VerifyEmailRequest
  ): Promise<MessageResponse> {
    const url = this.addTokenToUrl('/verify/email/', token);
    return this.request<MessageResponse>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============================================================
  // Reviews
  // ============================================================

  /**
   * Get user's reviews
   * GET /api/customers/reviews/
   */
  static async getReviews(token: string): Promise<CustomerReviewsResponse> {
    const url = this.addTokenToUrl('/reviews/', token);
    return this.request<CustomerReviewsResponse>(url);
  }

  /**
   * Create a review for a hotel
   * POST /api/customers/reviews/
   */
  static async createReview(
    token: string,
    data: CreateReviewRequest
  ): Promise<CreateReviewResponse> {
    const url = this.addTokenToUrl('/reviews/', token);
    return this.request<CreateReviewResponse>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============================================================
  // Coupons
  // ============================================================

  /**
   * Get user's active coupons
   * GET /api/customers/coupons/
   */
  static async getCoupons(token: string): Promise<CustomerCouponsResponse> {
    const url = this.addTokenToUrl('/coupons/', token);
    return this.request<CustomerCouponsResponse>(url);
  }

  // ============================================================
  // Local Storage Helpers for Token Management
  // ============================================================

  /**
   * Save auth token to localStorage
   */
  static saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Get auth token from localStorage
   */
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Remove auth token from localStorage
   */
  static clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
