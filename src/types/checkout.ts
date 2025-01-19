export interface CheckoutFormData {
  lastName: string;      // 姓
  firstName: string;     // 名
  email: string;
  phone: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address1: string;
  address2: string;
  paymentMethod: 'credit' | 'bank';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  bankName: string;
  branchName: string;
  accountType: 'ordinary' | 'current';
  accountNumber: string;
  accountName: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface SavedPaymentMethods {
  creditCards: Array<{
    id: string;
    lastFour: string;
    expiry: string;
    name: string;
  }>;
  bankAccounts: Array<{
    id: string;
    bankName: string;
    branchName: string;
    accountType: 'ordinary' | 'current';
    accountNumber: string;
    accountName: string;
  }>;
}

export interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    stock: number;
  };
  quantity: number;
  size?: string;
}

export interface ShippingFormProps {
  formData: CheckoutFormData;
  errors: ValidationErrors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePostalCodeLookup: () => Promise<void>;
}

export interface PaymentFormProps {
  formData: CheckoutFormData;
  errors: ValidationErrors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  savedPaymentMethods: SavedPaymentMethods;
  handlePaymentMethodSelect: (type: 'credit' | 'bank', id: string) => void;
  savePaymentMethod: () => Promise<void>;
  isSavingPaymentMethod: boolean;
}

export interface CartItemsProps {
  items: CartItem[];
  updateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

export interface OrderSummaryProps {
  items: CartItem[];
  isLoading: boolean;
}

export interface OrderDetails {
  cartItems: CartItem[];
  shippingDetails: {
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    postalCode: string;
    prefecture: string;
    city: string;
    address1: string;
    address2: string;
  };
  paymentDetails: CreditCardPayment | BankTransferPayment;
}

interface CreditCardPayment {
  type: 'credit';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

interface BankTransferPayment {
  type: 'bank';
  bankName: string;
  branchName: string;
  accountType: 'ordinary' | 'current';
  accountNumber: string;
  accountName: string;
}