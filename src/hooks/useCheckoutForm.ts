import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CheckoutFormData, ValidationErrors, CartItem } from '@/types/checkout';
import { formatCardNumber, formatPostalCode, formatPhoneNumber } from '@/utils/formatters';
import * as api from '@/api/checkout';

const initialFormData: CheckoutFormData = {
  lastName: '',
  firstName: '',
  email: '',
  phone: '',
  postalCode: '',
  prefecture: '',
  city: '',
  address1: '',
  address2: '',
  paymentMethod: 'credit',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  cardName: '',
  bankName: '',
  branchName: '',
  accountType: 'ordinary',
  accountNumber: '',
  accountName: '',
};

export function useCheckoutForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingPaymentMethod, setIsSavingPaymentMethod] = useState(false);
  const [orderDetails, setOrderDetails] = useState<CartItem[] | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        break;
      case 'postalCode':
        formattedValue = formatPostalCode(value);
        break;
      case 'phone':
        formattedValue = formatPhoneNumber(value);
        break;
      case 'cardExpiry':
        formattedValue = value
          .replace(/\D/g, '')
          .replace(/^(\d{2})/, '$1/')
          .substr(0, 5);
        break;
      case 'cardCvc':
        formattedValue = value.replace(/\D/g, '').substr(0, 4);
        break;
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePostalCodeLookup = async () => {
    const postalCode = formData.postalCode.replace(/-/g, '');
    if (!postalCode || postalCode.length < 7) {
      toast.error('正しい郵便番号を入力してください');
      return;
    }

    try {
      const data = await api.fetchAddressByPostalCode(postalCode);
      if (data.code === 200) {
        setFormData(prev => ({
          ...prev,
          prefecture: data.data.pref,
          city: data.data.address,
          address1: ''
        }));
        toast.success('住所を自動入力しました');
      } else {
        toast.error('該当する住所が見つかりませんでした');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('郵便番号からの住所取得に失敗しました');
    }
  };

  const handlePaymentMethodSelect = (type: 'credit' | 'bank', id: string) => {
    // ... この関数はコンポーネントで実装します
  };

  const savePaymentMethod = async () => {
    // ... この関数はコンポーネントで実装します
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    const validationErrors = validateCheckoutForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('入力内容に誤りがあります');
      const firstError = document.querySelector('[class*="border-red-500"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.submitOrder({
        cartItems: orderDetails,
        shippingDetails: {
          lastName: formData.lastName,
          firstName: formData.firstName,
          email: formData.email,
          phone: formData.phone.replace(/-/g, ''),
          postalCode: formData.postalCode.replace(/-/g, ''),
          prefecture: formData.prefecture,
          city: formData.city,
          address1: formData.address1,
          address2: formData.address2,
        },
        paymentDetails: formData.paymentMethod === 'credit'
          ? {
              type: 'credit',
              cardNumber: formData.cardNumber.replace(/\s/g, ''),
              cardExpiry: formData.cardExpiry,
              cardCvc: formData.cardCvc,
              cardName: formData.cardName,
            }
          : {
              type: 'bank',
              bankName: formData.bankName,
              branchName: formData.branchName,
              accountType: formData.accountType,
              accountNumber: formData.accountNumber,
              accountName: formData.accountName,
            }
      });

      if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      } else {
        router.push('/orders/complete');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('注文の処理中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    isSavingPaymentMethod,
    orderDetails,
    setOrderDetails,
    handleInputChange,
    handlePostalCodeLookup,
    handlePaymentMethodSelect,
    savePaymentMethod,
    handleSubmit,
  };
}