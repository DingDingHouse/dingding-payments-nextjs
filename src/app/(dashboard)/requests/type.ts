// Add these to your existing types file

export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type RequestType = 'deposit' | 'withdrawal';

export interface BankDetails {
    upiId?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    ifscCode?: string;
}


export interface Request {
    _id: string;
    userId: {
        _id: string;
        name: string;
        username: string;
    };
    type: RequestType;
    amount: number;
    approvedAmount: number | null;
    status: RequestStatus;
    transactionId?: string;
    qrReference?: string;
    path: string;
    bankDetails?: BankDetails;
    approverId?: {
        _id: string;
        name: string;
        username: string;
    };
    notes?: string;
    paymentScreenshot?: string;
    createdAt: string;
    updatedAt: string;
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