export interface Request {
    request_type: 'order' | 'delivery';
    from_city: string;
    to_city: string;
    parcel_type?: 'Gadgets' | 'Drinks' | 'Clothes' | 'Medicines' | 'Other';
    dispatch_date?: Date;
    description?: string;
    create_at?: Date;
    updated_at?: string;
}

export interface RequestCamel {
    id: string;
    requestType: string;
    fromCity: string;
    toCity: string;
    parcelType: string;
    dispatchDate: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}