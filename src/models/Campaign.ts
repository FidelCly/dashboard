export interface ICampaignCreatePayload {
  promotionId: number;
  subject: string;
  textData: string;
}

export interface ICampaignUpdatePayload {
  id: number;
  promotionId: number;
  shopId: number;
  subject: string;
  textData?: string;
  isActivate: boolean;
}

export interface ICampaign {
  startAt: any;
  endAt: any;
  id?: number;
  promotionId: number;
  subject: string;
  textData?: string;
}