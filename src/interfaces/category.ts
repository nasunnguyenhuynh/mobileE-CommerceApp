// 👇️ named export
export interface Category {
    id: number;
    name: string;
}

export interface PaymentMethod extends Category {}
