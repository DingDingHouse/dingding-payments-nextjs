// Add these to your existing types file

export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type RequestType = 'recharge' | 'redeem';

export interface Request {
    _id: string;
    userId: {
        _id: string;
        name: string;
        username: string;
    };
    type: string;
    amount: number;
    status: RequestStatus;
    transactionId?: string;
    qrReference?: string;
    paymentScreenshot?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    approverId?: {
        _id: string;
        name: string;
        username: string;
    };
    processedAt?: string;
}
export type RequestQuery = {
    page?: number;
    limit?: number;
    status?: RequestStatus;
    type?: RequestType;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    from?: string;
    to?: string;
}