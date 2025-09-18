import axios, { AxiosInstance } from "axios";

// Configuration
const API_BASE_URL = "https://zimobhtejidbcsrujhxd.supabase.co/rest/v1";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbW9iaHRlamlkYmNzcnVqaHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTgxNzYsImV4cCI6MjA3MzY3NDE3Nn0.oi_IEKXYWgSUwrCNGVWtZhRf2ys92N028Kp1Km9vOXE";

// Types
export type CampaignObjective =
  | "WEBSITE_CONVERSIONS"
  | "WEBSITE_TRAFFIC"
  | "SALES"
  | "APP_INSTALLATION"
  | "LEAD"
  | "BRAND"
  | "VIDEO_VIEWS";

export interface Company {
  id: number;
  name: string;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  company_id?: number;
  created_at: string;
  web_assignment_company?: Company;
}

export interface Campaign {
  id: number;
  name: string;
  enabled: boolean;
  campaign_objective: CampaignObjective;
  impressions: number;
  clicks: number;
  ctr: string;
  video_views: number;
  vtr: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
  select?: string;
  filters?: Record<string, any>;
}

export interface SupabaseError {
  code: string;
  details: string | null;
  hint: string | null;
  message: string;
}

// Base Axios Client
class SupabaseAxiosClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(
          "❌ Response Error:",
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  // Generic GET method with pagination
  async get<T>(
    endpoint: string,
    options: QueryOptions = {}
  ): Promise<PaginatedResponse<T>> {
    const {
      page = 0,
      limit = 20,
      orderBy = "id",
      orderDir = "desc",
      select = "*",
      filters = {},
    } = options;

    // Build query parameters
    const params = new URLSearchParams();

    // Pagination
    params.append("offset", (page * limit).toString());
    params.append("limit", limit.toString());

    // Ordering
    params.append("order", `${orderBy}.${orderDir}`);

    // Column selection
    params.append("select", select);

    // Filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const url = `${endpoint}?${params.toString()}`;

    try {
      const response = await this.client.get<T[]>(url, {
        headers: {
          Range: `${page * limit}-${page * limit + limit - 1}`,
        },
      });

      // Extract total count from Content-Range header
      const contentRange = response.headers["content-range"];
      const total = contentRange
        ? parseInt(contentRange.split("/")[1])
        : response.data.length;
      const totalPages = Math.ceil(total / limit);

      return {
        data: response.data,
        total,
        totalPages,
        currentPage: page,
        hasNext: page < totalPages - 1,
        hasPrev: page > 0,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Generic POST method
  async post<T>(endpoint: string, data: Partial<T>): Promise<T[]> {
    try {
      const response = await this.client.post<T[]>(endpoint, data, {
        headers: {
          Prefer: "return=representation",
        },
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Generic PUT method
  async put<T>(
    endpoint: string,
    data: Partial<T>,
    filters: Record<string, any> = {}
  ): Promise<T[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, `eq.${value}`);
    });

    const url = params.toString() ? `${endpoint}?${params}` : endpoint;

    try {
      const response = await this.client.patch<T[]>(url, data, {
        headers: {
          Prefer: "return=representation",
        },
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Generic DELETE method (blocked by RLS but included for completeness)
  async delete(endpoint: string, filters: Record<string, any>): Promise<void> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, `eq.${value}`);
    });

    const url = `${endpoint}?${params}`;

    try {
      await this.client.delete(url);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get single record by ID
  async getById<T>(
    endpoint: string,
    id: number,
    select: string = "*"
  ): Promise<T | null> {
    try {
      const response = await this.client.get<T[]>(
        `${endpoint}?id=eq.${id}&select=${select}`
      );
      return response.data[0] || null;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get count only
  async count(
    endpoint: string,
    filters: Record<string, any> = {}
  ): Promise<number> {
    const params = new URLSearchParams();
    params.append("select", "count");

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    try {
      const response = await this.client.get<[{ count: number }]>(
        `${endpoint}?${params}`
      );
      return response.data[0]?.count || 0;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Error handling
  private handleError(error: any): Error {
    if (error.response?.data) {
      const supabaseError: SupabaseError = error.response.data;
      return new Error(`${supabaseError.code}: ${supabaseError.message}`);
    }
    return error;
  }
}

// Companies API
export class CompaniesAPI {
  constructor(private client: SupabaseAxiosClient) {}

  async getAll(options?: QueryOptions): Promise<PaginatedResponse<Company>> {
    return this.client.get<Company>("/web_assignment_company", options);
  }

  async getById(id: number): Promise<Company | null> {
    return this.client.getById<Company>("/web_assignment_company", id);
  }

  async create(company: Partial<Company>): Promise<Company[]> {
    return this.client.post<Company>("/web_assignment_company", company);
  }

  async update(id: number, company: Partial<Company>): Promise<Company[]> {
    return this.client.put<Company>("/web_assignment_company", company, { id });
  }

  async search(
    name: string,
    options?: QueryOptions
  ): Promise<PaginatedResponse<Company>> {
    return this.client.get<Company>("/web_assignment_company", {
      ...options,
      filters: { name: `ilike.*${name}*` },
    });
  }

  async count(): Promise<number> {
    return this.client.count("/web_assignment_company");
  }
}

// Users API
export class UsersAPI {
  constructor(private client: SupabaseAxiosClient) {}

  async getAll(options?: QueryOptions): Promise<PaginatedResponse<User>> {
    const defaultOptions = {
      ...options,
      select: "*,web_assignment_company(id,name)",
    };
    return this.client.get<User>("/web_assignment_users", defaultOptions);
  }

  async getById(id: number): Promise<User | null> {
    return this.client.getById<User>(
      "/web_assignment_users",
      id,
      "*,web_assignment_company(id,name)"
    );
  }

  async create(user: Partial<User>): Promise<User[]> {
    return this.client.post<User>("/web_assignment_users", user);
  }

  async update(id: number, user: Partial<User>): Promise<User[]> {
    return this.client.put<User>("/web_assignment_users", user, { id });
  }

  async getByCompany(
    companyId: number,
    options?: QueryOptions
  ): Promise<PaginatedResponse<User>> {
    return this.client.get<User>("/web_assignment_users", {
      ...options,
      select: "*,web_assignment_company(id,name)",
      filters: { company_id: `eq.${companyId}` },
    });
  }

  async searchByEmail(
    email: string,
    options?: QueryOptions
  ): Promise<PaginatedResponse<User>> {
    return this.client.get<User>("/web_assignment_users", {
      ...options,
      select: "*,web_assignment_company(id,name)",
      filters: { email: `ilike.*${email}*` },
    });
  }

  async searchByName(
    name: string,
    options?: QueryOptions
  ): Promise<PaginatedResponse<User>> {
    return this.client.get<User>("/web_assignment_users", {
      ...options,
      select: "*,web_assignment_company(id,name)",
      filters: { name: `ilike.*${name}*` },
    });
  }

  async count(): Promise<number> {
    return this.client.count("/web_assignment_users");
  }
}

// Campaigns API
export class CampaignsAPI {
  constructor(private client: SupabaseAxiosClient) {}

  async getAll(options?: QueryOptions): Promise<PaginatedResponse<Campaign>> {
    return this.client.get<Campaign>("/web_assignment_campaigns", options);
  }

  async getById(id: number): Promise<Campaign | null> {
    return this.client.getById<Campaign>("/web_assignment_campaigns", id);
  }

  async create(campaign: Partial<Campaign>): Promise<Campaign[]> {
    return this.client.post<Campaign>("/web_assignment_campaigns", campaign);
  }

  async update(id: number, campaign: Partial<Campaign>): Promise<Campaign[]> {
    return this.client.put<Campaign>("/web_assignment_campaigns", campaign, {
      id,
    });
  }

  async getByObjective(
    objective: CampaignObjective,
    options?: QueryOptions
  ): Promise<PaginatedResponse<Campaign>> {
    return this.client.get<Campaign>("/web_assignment_campaigns", {
      ...options,
      filters: { campaign_objective: `eq.${objective}` },
    });
  }

  async getEnabled(
    options?: QueryOptions
  ): Promise<PaginatedResponse<Campaign>> {
    return this.client.get<Campaign>("/web_assignment_campaigns", {
      ...options,
      filters: { enabled: "eq.true" },
    });
  }

  async getDisabled(
    options?: QueryOptions
  ): Promise<PaginatedResponse<Campaign>> {
    return this.client.get<Campaign>("/web_assignment_campaigns", {
      ...options,
      filters: { enabled: "eq.false" },
    });
  }

  async search(
    name: string,
    options?: QueryOptions
  ): Promise<PaginatedResponse<Campaign>> {
    return this.client.get<Campaign>("/web_assignment_campaigns", {
      ...options,
      filters: { name: `ilike.*${name}*` },
    });
  }

  async getTopPerforming(
    limit: number = 10
  ): Promise<PaginatedResponse<Campaign>> {
    return this.client.get<Campaign>("/web_assignment_campaigns", {
      limit,
      orderBy: "clicks",
      orderDir: "desc",
      filters: { enabled: "eq.true" },
    });
  }

  async getHighCTR(
    minCtr: number = 1.0,
    options?: QueryOptions
  ): Promise<PaginatedResponse<Campaign>> {
    return this.client.get<Campaign>("/web_assignment_campaigns", {
      ...options,
      filters: { ctr: `gte.${minCtr}` },
    });
  }

  async count(): Promise<number> {
    return this.client.count("/web_assignment_campaigns");
  }

  async countByObjective(): Promise<Record<CampaignObjective, number>> {
    const objectives: CampaignObjective[] = [
      "WEBSITE_CONVERSIONS",
      "WEBSITE_TRAFFIC",
      "SALES",
      "APP_INSTALLATION",
      "LEAD",
      "BRAND",
      "VIDEO_VIEWS",
    ];

    const counts = await Promise.all(
      objectives.map(async (objective) => {
        const count = await this.client.count("/web_assignment_campaigns", {
          campaign_objective: `eq.${objective}`,
        });
        return { objective, count };
      })
    );

    return counts.reduce(
      (acc, { objective, count }) => {
        acc[objective] = count;
        return acc;
      },
      {} as Record<CampaignObjective, number>
    );
  }
}

// Main API Client
export class SupabaseAPI {
  public companies: CompaniesAPI;
  public users: UsersAPI;
  public campaigns: CampaignsAPI;
  private client: SupabaseAxiosClient;

  constructor() {
    this.client = new SupabaseAxiosClient();
    this.companies = new CompaniesAPI(this.client);
    this.users = new UsersAPI(this.client);
    this.campaigns = new CampaignsAPI(this.client);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.companies.count();
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const supabaseAPI = new SupabaseAPI();

// Usage Examples:
/*

// Initialize
import { supabaseAPI, QueryOptions } from './supabase-client';

// Get campaigns with pagination
const campaigns = await supabaseAPI.campaigns.getAll({
  page: 0,
  limit: 20,
  orderBy: 'impressions',
  orderDir: 'desc'
});

// Search campaigns
const searchResults = await supabaseAPI.campaigns.search('캠페인', {
  page: 0,
  limit: 10
});

// Get users with company info
const users = await supabaseAPI.users.getAll({
  page: 0,
  limit: 10
});

// Create new campaign
const newCampaign = await supabaseAPI.campaigns.create({
  name: '새로운 캠페인',
  enabled: true,
  campaign_objective: 'WEBSITE_TRAFFIC',
  impressions: 0,
  clicks: 0,
  ctr: '0.0000',
  video_views: 0,
  vtr: '0.0000'
});

// Get top performing campaigns
const topCampaigns = await supabaseAPI.campaigns.getTopPerforming(5);

// Count campaigns by objective
const objectiveCounts = await supabaseAPI.campaigns.countByObjective();

// Filter campaigns by objective
const salesCampaigns = await supabaseAPI.campaigns.getByObjective('SALES');

// Get users by company
const companyUsers = await supabaseAPI.users.getByCompany(1);

// Update campaign
const updated = await supabaseAPI.campaigns.update(1, {
  enabled: false
});

*/
