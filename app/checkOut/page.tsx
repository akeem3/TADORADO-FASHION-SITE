"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Ruler,
  Truck,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Container from "@/app/Components/Container";
import Image from "next/image";
// Import the Path type from react-hook-form to properly type the setValue calls
import type {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
  Path,
} from "react-hook-form";

// Update the CartProduct type to match what's in your CartContext
import { useCart, type CartProduct } from "@/components/ui/CartContext";
import { usePathname } from "next/navigation";

// Define form data type
interface CheckoutFormData {
  measurements: Array<{
    gender: "male" | "female";
    height: string;
    shoulder: string;
    chest?: string;
    bust?: string;
    waist: string;
    hip: string;
    sleeve: string;
    inseam?: string;
    neck?: string;
    extraNote?: string;
    measurementUnit: "inches" | "cm";
    label?: string; // For user to label each set (e.g. "For Dad", "For Me")
    outfitType: string;
  }>;
  delivery: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    address: string;
    postalCode?: string;
    deliverySpeed: "standard" | "express";
  };
  payment: {
    paymentMethod: "card" | "paypal" | "bank";
    agreeToTerms: boolean;
  };
}

// Dummy data for countries
const countriesList = [
  { code: "NG", name: "Nigeria" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const { cartItems, cartTotal } = useCart();
  const [buyNowItem, setBuyNowItem] = useState<CartProduct | null>(null);
  const [buyNowMode, setBuyNowMode] = useState(false);
  const pathname = usePathname();

  // Add filters state for dynamic style dropdown
  const [filters, setFilters] = useState<{
    male: { ageGroups: string[]; subCategories: string[] };
    female: { ageGroups: string[]; subCategories: string[] };
  }>({
    male: { ageGroups: [], subCategories: [] },
    female: { ageGroups: [], subCategories: [] },
  });

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch filters for dynamic style dropdown
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch("/api/products/filters", {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setFilters(
            data || {
              male: { ageGroups: [], subCategories: [] },
              female: { ageGroups: [], subCategories: [] },
            }
          );
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  const [measurements, setMeasurements] = useState<
    CheckoutFormData["measurements"]
  >([
    {
      gender: "male",
      height: "",
      shoulder: "",
      chest: "",
      bust: "",
      waist: "",
      hip: "",
      sleeve: "",
      inseam: "",
      neck: "",
      extraNote: "",
      measurementUnit: "inches",
      label: "",
      outfitType: "",
    },
  ]);
  const [activeMeasurementIndex, setActiveMeasurementIndex] = useState(0);

  const methods = useForm<CheckoutFormData>({
    defaultValues: {
      measurements: [
        {
          gender: "male",
          height: "",
          shoulder: "",
          chest: "",
          bust: "",
          waist: "",
          hip: "",
          sleeve: "",
          inseam: "",
          neck: "",
          extraNote: "",
          measurementUnit: "inches",
          label: "",
          outfitType: "",
        },
      ],
      delivery: {
        fullName: "",
        email: "",
        phone: "",
        country: "NG",
        state: "",
        city: "",
        address: "",
        postalCode: "",
        deliverySpeed: "standard",
      },
      payment: {
        paymentMethod: "card",
        agreeToTerms: false,
      },
    },
    mode: "onBlur", // Changed from onChange to onBlur for better UX
  });

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: CheckoutFormData) => {
    if (step < 3) {
      // Check for errors in the current step before proceeding
      let hasErrors = false;

      if (step === 1) {
        // Validate measurements step
        if (
          !data.measurements[activeMeasurementIndex].height ||
          !data.measurements[activeMeasurementIndex].shoulder ||
          !data.measurements[activeMeasurementIndex].waist ||
          !data.measurements[activeMeasurementIndex].hip ||
          !data.measurements[activeMeasurementIndex].sleeve
        ) {
          hasErrors = true;
          alert(
            "Please fill in all required measurement fields before continuing."
          );
        }
      } else if (step === 2) {
        // Validate delivery step
        if (
          !data.delivery.fullName ||
          !data.delivery.email ||
          !data.delivery.phone ||
          !data.delivery.country ||
          !data.delivery.state ||
          !data.delivery.city ||
          !data.delivery.address
        ) {
          hasErrors = true;
          alert(
            "Please fill in all required delivery fields before continuing."
          );
        }
      }

      if (!hasErrors) {
        setStep(step + 1);
        // Scroll to top when changing steps
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // For the final step, check if terms are agreed to
    if (!data.payment.agreeToTerms) {
      alert(
        "You must agree to the terms and conditions to complete your order."
      );
      return;
    }

    // Final submission
    setIsSubmitting(true);
    try {
      // Determine which items to send based on buy now mode
      const itemsToSend = buyNowMode && buyNowItem ? [buyNowItem] : cartItems;
      const totalAmountToSend = buyNowMode ? buyNowTotal : cartTotal;

      // Call the backend order API to trigger the Excel export
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerInfo: data.delivery,
          measurements: data.measurements,
          deliveryInfo: data.delivery,
          paymentInfo: {
            method: data.payment.paymentMethod,
            status: "paid",
          },
          cartItems: itemsToSend,
          totalAmount: totalAmountToSend,
          shippingCost,
          taxAmount: 0,
          notes: "",
        }),
      });
      const result = await response.json();
      if (result.success) {
        router.push("/checkOut/success");
        // Cart clearing is now handled in success page after confirmed processing
      } else {
        alert("Order failed: " + (result.error || "Unknown error"));
        setIsSubmitting(false);
      }
    } catch {
      alert("There was a problem processing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Calculate shipping cost based on country and delivery speed
  const calculateShippingCost = (country: string, deliverySpeed: string) => {
    // Country-specific base shipping rates in Naira
    let baseRate = 0;

    switch (country) {
      case "US":
        baseRate = 15000; // ₦15,000 for US
        break;
      case "GB":
        baseRate = 16000; // ₦16,000 for UK
        break;
      case "CA":
        baseRate = 18000; // ₦18,000 for Canada
        break;
      case "NG":
        baseRate = 5000; // ₦5,000 for Nigeria
        break;
      default:
        baseRate = 15000; // Default to US rate for other countries
        break;
    }

    // Express delivery costs 50% more
    return deliverySpeed === "express" ? Math.round(baseRate * 1.5) : baseRate;
  };

  // Get the selected country and delivery speed
  const selectedCountry = watch("delivery.country");
  const selectedDeliverySpeed = watch("delivery.deliverySpeed");

  // Calculate shipping cost
  const shippingCost = calculateShippingCost(
    selectedCountry,
    selectedDeliverySpeed
  );

  // Calculate buyNowTotal and order totals
  const buyNowTotal = buyNowItem ? buyNowItem.price * buyNowItem.quantity : 0;
  const subtotal = buyNowMode ? buyNowTotal : cartTotal;
  const orderTotal = subtotal + shippingCost;

  // Payment processing state (single CTA flow)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Initiate Paystack payment from the parent (validated and gated)
  const initiatePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const formData = methods.getValues();
      const customerEmail = formData.delivery.email;
      const customerName = formData.delivery.fullName;
      const customerPhone = formData.delivery.phone;

      const items = buyNowMode && buyNowItem ? [buyNowItem] : cartItems;
      const orderItems = items
        .map((item) => `${item.name} (${item.quantity}x)`)
        .join(", ");

      const measurementsText = formData.measurements
        .map(
          (m, index) =>
            `Person ${index + 1}: ${m.height}${m.measurementUnit}, ${
              m.shoulder
            }${m.measurementUnit}, ${m.waist}${m.measurementUnit}, ${m.hip}${
              m.measurementUnit
            }, ${m.sleeve}${m.measurementUnit}`
        )
        .join("; ");

      const deliveryAddress = `${formData.delivery.address}, ${formData.delivery.city}, ${formData.delivery.state}, ${formData.delivery.country}`;

      const pendingOrder = {
        customerInfo: {
          fullName: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: formData.delivery.address,
          city: formData.delivery.city,
          state: formData.delivery.state,
          country: formData.delivery.country,
        },
        cartItems: items,
        totalAmount: subtotal,
        shippingCost,
        taxAmount: 0,
        measurements: formData.measurements,
        deliverySpeed: formData.delivery.deliverySpeed,
        orderItems,
        deliveryAddress,
      };
      sessionStorage.setItem("pendingOrder", JSON.stringify(pendingOrder));

      const resp = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerEmail,
          amount: orderTotal,
          currency: "NGN",
          customerName,
          customerPhone,
          orderItems,
          measurements: measurementsText,
          deliveryAddress,
        }),
      });
      const data = await resp.json();
      if (data?.success && data?.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        alert(
          data?.message || "Payment initialization failed. Please try again."
        );
        setIsProcessingPayment(false);
      }
    } catch {
      alert("There was a problem starting the payment. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  // On mount, check for buyNowItem in sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window.sessionStorage.getItem("buyNowItem");
      if (item) {
        try {
          setBuyNowItem(JSON.parse(item));
          setBuyNowMode(true);
        } catch {
          setBuyNowItem(null);
          setBuyNowMode(false);
        }
      }
    }
    // Clean up buyNowItem if user leaves checkout
    return () => {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("buyNowItem");
      }
    };
  }, [pathname]);

  // Add global styles for smooth scrolling
  useEffect(() => {
    // Add smooth scrolling to the document
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      // Clean up
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  // If not buyNowMode and cart is empty, redirect to collections
  if (!buyNowMode && cartItems.length === 0) {
    return (
      <>
        <Container>
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-[#46332E] mb-4">
                Your cart is empty
              </h2>
              <p className="text-[#46332E]/70 mb-8">
                Add some items to your cart before proceeding to checkout.
              </p>
              <Button
                onClick={() => router.push("/collections")}
                className="rounded-xl bg-[#46332E] text-white hover:bg-[#46332E]/90"
              >
                Browse Collections
              </Button>
            </div>
          </div>
        </Container>
      </>
    );
  }

  // Add a function to check if the current step has errors before proceeding
  // Add this function before the return statement in the main component

  const checkStepValidity = async (currentStep: number) => {
    let isValid = true;

    if (currentStep === 1) {
      // Validate ALL measurements step fields for ALL people
      const validationPromises = measurements.map((_, index) =>
        methods.trigger([
          `measurements.${index}.height`,
          `measurements.${index}.shoulder`,
          `measurements.${index}.waist`,
          `measurements.${index}.hip`,
          `measurements.${index}.sleeve`,
          `measurements.${index}.outfitType`,
        ])
      );

      const results = await Promise.all(validationPromises);
      isValid = results.every((result) => result);
    } else if (currentStep === 2) {
      // Validate delivery step fields
      const result = await methods.trigger([
        "delivery.fullName",
        "delivery.email",
        "delivery.phone",
        "delivery.country",
        "delivery.state",
        "delivery.city",
        "delivery.address",
      ]);
      isValid = result;
    } else if (currentStep === 3) {
      // Validate payment step fields
      const result = await methods.trigger("payment.agreeToTerms");
      isValid = result;
    }

    return isValid;
  };

  return (
    <>
      {/* <Banner title="CHECKOUT" description="Complete your purchase with our secure checkout process." /> */}
      <Container>
        <div className="py-12 max-w-7xl mx-auto">
          {/* Checkout Steps Indicator */}
          <div className="mb-10">
            <div className="flex justify-between items-center max-w-3xl mx-auto px-4">
              {[
                { number: 1, title: "Measurements", icon: Ruler },
                { number: 2, title: "Delivery", icon: Truck },
                { number: 3, title: "Payment", icon: CreditCard },
              ].map((item) => (
                <div
                  key={item.number}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      step >= item.number
                        ? "bg-[#46332E] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > item.number ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm text-center ${
                      step >= item.number
                        ? "text-[#46332E] font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative max-w-3xl mx-auto mt-4 px-4">
              <div className="absolute top-0 left-[calc(16.67%+8px)] right-[calc(16.67%+8px)] h-1 bg-gray-200 -z-0"></div>
              <div
                className="absolute top-0 left-[calc(16.67%+8px)] h-1 bg-[#46332E] -z-0 transition-all duration-500"
                style={{ width: `${(step - 1) * 66.67}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 px-4 sm:px-6">
            {/* Form Section */}
            <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <MeasurementsStep
                      key="step1"
                      measurements={measurements}
                      setMeasurements={setMeasurements}
                      activeMeasurementIndex={activeMeasurementIndex}
                      setActiveMeasurementIndex={setActiveMeasurementIndex}
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                      filters={filters}
                    />
                  )}
                  {step === 2 && (
                    <DeliveryStep
                      key="step2"
                      countryOptions={countriesList}
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                    />
                  )}
                  {step === 3 && (
                    <PaymentStep
                      key="step3"
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                      cartItems={
                        buyNowMode && buyNowItem ? [buyNowItem] : cartItems
                      }
                      cartTotal={
                        buyNowMode && buyNowItem ? buyNowTotal : cartTotal
                      }
                      shippingCost={shippingCost}
                      register={register} // Add this line
                      buyNowMode={buyNowMode}
                      buyNowItem={buyNowItem}
                      buyNowTotal={buyNowTotal}
                    />
                  )}
                </AnimatePresence>

                {/* Update the button click handler to use this validation function
                Replace the existing Button in the form navigation with this: */}

                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1}
                    className="rounded-xl flex items-center"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    type="button"
                    className="rounded-xl bg-[#46332E] text-white hover:bg-[#46332E]/90 transition-all duration-300"
                    disabled={isSubmitting}
                    onClick={async () => {
                      const isValid = await checkStepValidity(step);
                      if (!isValid) return;

                      if (step < 3) {
                        setStep(step + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        return;
                      }

                      // Step 3: must agree to terms, then initialize Paystack
                      const formData = watch();
                      if (!formData.payment.agreeToTerms) {
                        alert("Please agree to the terms to continue.");
                        return;
                      }

                      // Trigger Paystack payment init (single CTA)
                      await initiatePayment();
                    }}
                  >
                    {isSubmitting || isProcessingPayment ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : step === 3 ? (
                      <>
                        Complete & Pay <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-5 sm:p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-[#46332E] mb-4">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {(buyNowMode && buyNowItem ? [buyNowItem] : cartItems).map(
                    (item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 pb-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-[#46332E] line-clamp-1">
                            {item.name}
                          </h3>
                          <div className="flex justify-between">
                            <p className="text-sm text-[#46332E]/70">
                              Qty: {item.quantity}
                            </p>
                            <p className="font-medium">
                              ₦{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-[#46332E]/70">Subtotal</span>
                    <span className="font-medium">
                      ₦
                      {(buyNowMode && buyNowItem
                        ? buyNowTotal
                        : cartTotal
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#46332E]/70">Shipping</span>
                    <span className="font-medium">
                      ₦{shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₦{orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {step === 1 && (
                  <div className="mt-6 p-4 bg-[#F5F3F0] rounded-md text-sm">
                    <h3 className="font-medium text-[#46332E] mb-2">
                      Measurement Tips:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-[#46332E]">
                      <li>Use a soft measuring tape</li>
                      <li>Keep one finger space between tape and skin</li>
                      <li>Select your preferred measurement unit</li>
                      <li>For accurate fit, have someone help you</li>
                    </ul>
                  </div>
                )}

                {step === 2 && (
                  <div className="mt-6 p-4 bg-[#F5F3F0] rounded-md text-sm">
                    <h3 className="font-medium text-[#46332E] mb-2">
                      Shipping Information:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-[#46332E]">
                      <li>We ship worldwide to over 180 countries</li>
                      <li>Standard delivery: 7-14 business days</li>
                      <li>Express delivery: 3-5 business days</li>
                      <li>Free shipping on orders over $200</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

// Step 1: Measurements Form
interface MeasurementsStepProps {
  measurements: CheckoutFormData["measurements"];
  setMeasurements: React.Dispatch<
    React.SetStateAction<CheckoutFormData["measurements"]>
  >;
  activeMeasurementIndex: number;
  setActiveMeasurementIndex: React.Dispatch<React.SetStateAction<number>>;
  register: UseFormRegister<CheckoutFormData>;
  watch: UseFormWatch<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  filters: {
    male: { ageGroups: string[]; subCategories: string[] };
    female: { ageGroups: string[]; subCategories: string[] };
  };
}

function MeasurementsStep({
  measurements,
  setMeasurements,
  activeMeasurementIndex,
  setActiveMeasurementIndex,
  register,
  watch,
  setValue,
  errors,
  filters,
}: MeasurementsStepProps) {
  const gender = watch(`measurements.${activeMeasurementIndex}.gender`);
  const measurementUnit = watch(
    `measurements.${activeMeasurementIndex}.measurementUnit`
  );

  // In the MeasurementsStep component, update the handleRadioChange function:
  const handleRadioChange = (field: Path<CheckoutFormData>, value: string) => {
    setValue(field, value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Enhanced Measurement Instructions */}
      <div className="bg-gradient-to-r from-[#F5F3F0] to-[#E8E4E0] p-6 rounded-xl border border-[#46332E]/10 mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-[#46332E] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
            <Ruler className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-semibold text-[#46332E]">
            Measurement Instructions
          </h2>
        </div>
        <p className="text-[#46332E]/80 mb-6 leading-relaxed">
          For the perfect custom fit, please provide your measurements
          accurately. Use a soft measuring tape and keep one finger space
          between the tape and your skin.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start bg-white/50 p-3 rounded-lg">
            <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
              1
            </div>
            <p className="text-sm font-medium">
              Stand straight with your arms relaxed at your sides for most
              measurements.
            </p>
          </div>
          <div className="flex items-start bg-white/50 p-3 rounded-lg">
            <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
              2
            </div>
            <p className="text-sm font-medium">
              For chest/bust, measure at the fullest part while breathing
              normally.
            </p>
          </div>
          <div className="flex items-start bg-white/50 p-3 rounded-lg">
            <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
              3
            </div>
            <p className="text-sm font-medium">
              For waist, measure at your natural waistline (the narrowest part).
            </p>
          </div>
          <div className="flex items-start bg-white/50 p-3 rounded-lg">
            <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
              4
            </div>
            <p className="text-sm font-medium">
              For hips, measure at the fullest part, approximately 8&#34; below
              your waist.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Person Selection */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#46332E]">
            Who are you measuring?
          </h3>
          <span className="text-sm text-[#46332E]/60">
            {measurements.length}{" "}
            {measurements.length === 1 ? "person" : "people"}
          </span>
        </div>

        {/* Person Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {measurements.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setActiveMeasurementIndex(idx)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                idx === activeMeasurementIndex
                  ? "bg-[#46332E] text-white shadow-md"
                  : "bg-gray-100 text-[#46332E] hover:bg-gray-200"
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current"></div>
              {m.label || `Person ${idx + 1}`}
              {idx === activeMeasurementIndex && <Check className="w-3 h-3" />}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              try {
                // Add a new measurement entry with proper typing
                const newMeasurement: CheckoutFormData["measurements"][0] = {
                  gender: "male",
                  height: "",
                  shoulder: "",
                  chest: "",
                  bust: "",
                  waist: "",
                  hip: "",
                  sleeve: "",
                  inseam: "",
                  neck: "",
                  extraNote: "",
                  measurementUnit: "inches",
                  label: "",
                  outfitType: "",
                };

                setMeasurements((prev) => {
                  const newMeasurements = [...prev, newMeasurement];
                  // Set the active index to the new measurement (last index)
                  setActiveMeasurementIndex(newMeasurements.length - 1);
                  return newMeasurements;
                });
              } catch (error) {
                console.error("Error adding new person:", error);
                alert(
                  "There was an error adding a new person. Please try again."
                );
              }
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#F5F3F0] text-[#46332E] hover:bg-[#E8E4E0] transition-all duration-200 flex items-center gap-2 border border-[#E5D3C6]"
          >
            <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
              <span className="text-xs">+</span>
            </div>
            Add Another Person
          </button>
        </div>

        {/* Person Label Input */}
        <div className="mb-6">
          <Label
            htmlFor="label"
            className="text-base font-medium text-[#46332E]"
          >
            Label this person (e.g., &quot;For Me&quot;, &quot;For Dad&quot;,
            &quot;For Mom&quot;)
          </Label>
          <Input
            id="label"
            type="text"
            className="rounded-xl border border-[#E5D3C6]"
            placeholder="Enter a name or label for this person..."
            value={measurements[activeMeasurementIndex].label || ""}
            onChange={(e) => {
              const updated = [...measurements];
              updated[activeMeasurementIndex].label = e.target.value;
              setMeasurements(updated);
            }}
          />
        </div>

        {/* Remove Person Button */}
        {measurements.length > 1 && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => {
                try {
                  const newMeasurements = measurements.filter(
                    (_, idx) => idx !== activeMeasurementIndex
                  );
                  setMeasurements(newMeasurements);
                  setActiveMeasurementIndex(
                    Math.max(0, activeMeasurementIndex - 1)
                  );
                } catch (error) {
                  console.error("Error removing person:", error);
                  alert(
                    "There was an error removing this person. Please try again."
                  );
                }
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 flex items-center gap-2 border border-red-200"
            >
              <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                <span className="text-xs">×</span>
              </div>
              Remove This Person
            </button>
          </div>
        )}
      </div>

      {/* Current Person's Measurements */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center mb-6">
          <div className="bg-[#46332E] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
            {activeMeasurementIndex + 1}
          </div>
          <h2 className="text-xl font-semibold text-[#46332E]">
            {measurements[activeMeasurementIndex].label ||
              `Person ${activeMeasurementIndex + 1}`}{" "}
            Measurements
          </h2>
        </div>

        <div className="space-y-6">
          {/* Measurement Unit Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-base font-medium text-[#46332E]">
              Measurement Unit
            </Label>
            <RadioGroup
              defaultValue={measurementUnit}
              className="flex gap-6 mt-3"
              onValueChange={(value) =>
                handleRadioChange(
                  `measurements.${activeMeasurementIndex}.measurementUnit`,
                  value
                )
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="inches"
                  id="inches"
                  className="text-[#46332E]"
                />
                <Label htmlFor="inches" className="cursor-pointer font-medium">
                  Inches
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cm" id="cm" className="text-[#46332E]" />
                <Label htmlFor="cm" className="cursor-pointer font-medium">
                  Centimeters
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Gender Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-base font-medium text-[#46332E]">
              Gender
            </Label>
            <RadioGroup
              defaultValue={gender}
              className="flex gap-6 mt-3"
              onValueChange={(value) =>
                handleRadioChange(
                  `measurements.${activeMeasurementIndex}.gender`,
                  value
                )
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="male"
                  id="male"
                  className="text-[#46332E]"
                />
                <Label htmlFor="male" className="cursor-pointer font-medium">
                  Male
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="female"
                  id="female"
                  className="text-[#46332E]"
                />
                <Label htmlFor="female" className="cursor-pointer font-medium">
                  Female
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Outfit Type Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-base font-medium text-[#46332E]">
              Outfit Type
            </Label>
            <Select
              onValueChange={(value) =>
                setValue(
                  `measurements.${activeMeasurementIndex}.outfitType`,
                  value
                )
              }
              defaultValue={watch(
                `measurements.${activeMeasurementIndex}.outfitType`
              )}
            >
              <SelectTrigger className="rounded-xl w-full mt-2 focus:ring-2 focus:ring-[#E5D3C6] focus:border-[#E5D3C6]">
                <SelectValue placeholder="Select outfit type" />
              </SelectTrigger>
              <SelectContent className="bg-[#FDF7F2]">
                {gender === "male"
                  ? filters.male.subCategories.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </SelectItem>
                    ))
                  : filters.female.subCategories.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
            {errors.measurements &&
              errors.measurements[activeMeasurementIndex]?.outfitType && (
                <p className="text-red-500 text-sm mt-2">
                  Outfit type is required
                </p>
              )}
          </div>

          {/* Common Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <Label
                htmlFor="height"
                className="text-base font-medium text-[#46332E]"
              >
                Height ({measurementUnit})
              </Label>
              <Input
                id="height"
                type="text"
                className="rounded-xl border border-[#E5D3C6]"
                placeholder={`Enter height in ${measurementUnit}`}
                {...register(`measurements.${activeMeasurementIndex}.height`, {
                  required: "Height is required",
                })}
              />
              {typeof errors.measurements === "object" &&
              errors.measurements &&
              errors.measurements[activeMeasurementIndex]?.height ? (
                <p className="text-red-500 text-sm mt-2">Height is required</p>
              ) : null}
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <Label
                htmlFor="shoulder"
                className="text-base font-medium text-[#46332E]"
              >
                Shoulder Width ({measurementUnit})
              </Label>
              <Input
                id="shoulder"
                type="text"
                className="rounded-xl border border-[#E5D3C6]"
                placeholder={`Enter shoulder width in ${measurementUnit}`}
                {...register(
                  `measurements.${activeMeasurementIndex}.shoulder`,
                  {
                    required: "Shoulder width is required",
                  }
                )}
              />
              {typeof errors.measurements === "object" &&
              errors.measurements &&
              errors.measurements[activeMeasurementIndex]?.shoulder ? (
                <p className="text-red-500 text-sm mt-2">
                  Shoulder width is required
                </p>
              ) : null}
            </div>

            {gender === "male" ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <Label
                  htmlFor="chest"
                  className="text-base font-medium text-[#46332E]"
                >
                  Chest ({measurementUnit})
                </Label>
                <Input
                  id="chest"
                  type="text"
                  className="rounded-xl border border-[#E5D3C6]"
                  placeholder={`Enter chest measurement in ${measurementUnit}`}
                  {...register(`measurements.${activeMeasurementIndex}.chest`)}
                />
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <Label
                  htmlFor="bust"
                  className="text-base font-medium text-[#46332E]"
                >
                  Bust ({measurementUnit})
                </Label>
                <Input
                  id="bust"
                  type="text"
                  className="rounded-xl border border-[#E5D3C6]"
                  placeholder={`Enter bust measurement in ${measurementUnit}`}
                  {...register(`measurements.${activeMeasurementIndex}.bust`)}
                />
              </div>
            )}

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <Label
                htmlFor="waist"
                className="text-base font-medium text-[#46332E]"
              >
                Waist ({measurementUnit})
              </Label>
              <Input
                id="waist"
                type="text"
                className="rounded-xl border border-[#E5D3C6]"
                placeholder={`Enter waist measurement in ${measurementUnit}`}
                {...register(`measurements.${activeMeasurementIndex}.waist`, {
                  required: "Waist measurement is required",
                })}
              />
              {typeof errors.measurements === "object" &&
              errors.measurements &&
              errors.measurements[activeMeasurementIndex]?.waist ? (
                <p className="text-red-500 text-sm mt-2">
                  Waist measurement is required
                </p>
              ) : null}
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <Label
                htmlFor="hip"
                className="text-base font-medium text-[#46332E]"
              >
                Hip ({measurementUnit})
              </Label>
              <Input
                id="hip"
                type="text"
                className="rounded-xl border border-[#E5D3C6]"
                placeholder={`Enter hip measurement in ${measurementUnit}`}
                {...register(`measurements.${activeMeasurementIndex}.hip`, {
                  required: "Hip measurement is required",
                })}
              />
              {typeof errors.measurements === "object" &&
              errors.measurements &&
              errors.measurements[activeMeasurementIndex]?.hip ? (
                <p className="text-red-500 text-sm mt-2">
                  Hip measurement is required
                </p>
              ) : null}
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <Label
                htmlFor="sleeve"
                className="text-base font-medium text-[#46332E]"
              >
                Sleeve Length ({measurementUnit})
              </Label>
              <Input
                id="sleeve"
                type="text"
                className="rounded-xl border border-[#E5D3C6]"
                placeholder={`Enter sleeve length in ${measurementUnit}`}
                {...register(`measurements.${activeMeasurementIndex}.sleeve`, {
                  required: "Sleeve length is required",
                })}
              />
              {typeof errors.measurements === "object" &&
              errors.measurements &&
              errors.measurements[activeMeasurementIndex]?.sleeve ? (
                <p className="text-red-500 text-sm mt-2">
                  Sleeve length is required
                </p>
              ) : null}
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <Label
                htmlFor="inseam"
                className="text-base font-medium text-[#46332E]"
              >
                Inseam / Trouser Length ({measurementUnit})
              </Label>
              <Input
                id="inseam"
                type="text"
                className="rounded-xl border border-[#E5D3C6]"
                placeholder={`Enter inseam length in ${measurementUnit}`}
                {...register(`measurements.${activeMeasurementIndex}.inseam`)}
              />
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <Label
                htmlFor="neck"
                className="text-base font-medium text-[#46332E]"
              >
                Neck Circumference ({measurementUnit})
              </Label>
              <Input
                id="neck"
                type="text"
                className="rounded-xl border border-[#E5D3C6]"
                placeholder={`Enter neck circumference in ${measurementUnit}`}
                {...register(`measurements.${activeMeasurementIndex}.neck`)}
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <Label
              htmlFor="extraNote"
              className="text-base font-medium text-[#46332E]"
            >
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="extraNote"
              className="rounded-xl border border-[#E5D3C6]"
              placeholder="Any specific requirements or details about your measurements..."
              {...register(`measurements.${activeMeasurementIndex}.extraNote`)}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Step 2: Delivery Details
interface DeliveryStepProps {
  countryOptions: { code: string; name: string }[];
  register: UseFormRegister<CheckoutFormData>;
  watch: UseFormWatch<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

function DeliveryStep({
  countryOptions,
  register,
  watch,
  setValue,
  errors,
}: DeliveryStepProps) {
  const selectedCountry = watch("delivery.country");

  // In the DeliveryStep component, update the handleRadioChange function:
  const handleRadioChange = (field: Path<CheckoutFormData>, value: string) => {
    setValue(field, value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Enhanced Delivery Header */}
      <div className="bg-gradient-to-r from-[#F5F3F0] to-[#E8E4E0] p-6 rounded-xl border border-[#46332E]/10 mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-[#46332E] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
            <Truck className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-semibold text-[#46332E]">
            Delivery Details
          </h2>
        </div>
        <p className="text-[#46332E]/80 leading-relaxed">
          Please provide your shipping information so we can deliver your
          custom-tailored clothing to the right address.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-[#46332E] mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="fullName"
              className="text-base font-medium text-[#46332E]"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              className="rounded-xl border border-[#E5D3C6]"
              placeholder="Enter your full name"
              {...register("delivery.fullName", {
                required: "Full name is required",
              })}
            />
            {errors.delivery?.fullName && (
              <p className="text-red-500 text-sm mt-2">Full name is required</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="email"
              className="text-base font-medium text-[#46332E]"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              className="rounded-xl border border-[#E5D3C6]"
              placeholder="Enter your email address"
              {...register("delivery.email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.delivery?.email && (
              <p className="text-red-500 text-sm mt-2">
                Valid email is required
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="phone"
              className="text-base font-medium text-[#46332E]"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              className="rounded-xl border border-[#E5D3C6]"
              placeholder="Enter your phone number"
              {...register("delivery.phone", {
                required: "Phone number is required",
              })}
            />
            {errors.delivery?.phone && (
              <p className="text-red-500 text-sm mt-2">
                Valid phone number is required
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="country"
              className="text-base font-medium text-[#46332E]"
            >
              Country
            </Label>
            <Select
              onValueChange={(value) => setValue("delivery.country", value)}
              defaultValue={selectedCountry}
            >
              <SelectTrigger className="rounded-xl w-full mt-2 focus:ring-2 focus:ring-[#E5D3C6] focus:border-[#E5D3C6]">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-[#FDF7F2]">
                {countryOptions.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.delivery?.country && (
              <p className="text-red-500 text-sm mt-2">Country is required</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-[#46332E] mb-4">
          Shipping Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="state"
              className="text-base font-medium text-[#46332E]"
            >
              State / Province / Region
            </Label>
            <Input
              id="state"
              type="text"
              className="rounded-xl border border-[#E5D3C6]"
              placeholder="Enter your state or province"
              {...register("delivery.state", {
                required: "State/Province is required",
              })}
            />
            {errors.delivery?.state && (
              <p className="text-red-500 text-sm mt-2">
                State/Province is required
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="city"
              className="text-base font-medium text-[#46332E]"
            >
              City
            </Label>
            <Input
              id="city"
              type="text"
              className="rounded-xl border border-[#E5D3C6]"
              placeholder="Enter your city"
              {...register("delivery.city", {
                required: "City is required",
              })}
            />
            {errors.delivery?.city && (
              <p className="text-red-500 text-sm mt-2">City is required</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label
              htmlFor="address"
              className="text-base font-medium text-[#46332E]"
            >
              Street Address
            </Label>
            <Textarea
              id="address"
              className="rounded-xl border border-[#E5D3C6]"
              placeholder="Enter your complete street address"
              {...register("delivery.address", {
                required: "Delivery address is required",
              })}
            />
            {errors.delivery?.address && (
              <p className="text-red-500 text-sm mt-2">
                Delivery address is required
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="postalCode"
              className="text-base font-medium text-[#46332E]"
            >
              Postal / Zip Code
            </Label>
            <Input
              id="postalCode"
              type="text"
              className="rounded-xl border border-[#E5D3C6]"
              placeholder="Enter your postal code"
              {...register("delivery.postalCode")}
            />
          </div>
        </div>
      </div>

      {/* Delivery Speed */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#46332E] mb-4">
          Delivery Speed
        </h3>
        <RadioGroup
          defaultValue={watch("delivery.deliverySpeed")}
          className="space-y-4"
          onValueChange={(value) =>
            handleRadioChange("delivery.deliverySpeed", value)
          }
        >
          <div className="flex items-start space-x-3 border-2 border-gray-200 p-4 rounded-lg hover:border-[#46332E]/30 transition-all duration-200 cursor-pointer">
            <RadioGroupItem
              value="standard"
              id="standard"
              className="mt-1 text-[#46332E]"
            />
            <div className="flex-1">
              <Label
                htmlFor="standard"
                className="font-semibold text-[#46332E] cursor-pointer text-base"
              >
                Standard Delivery
              </Label>
              <p className="text-sm text-[#46332E]/70 mt-1">
                7-14 business days
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-[#46332E]/60">
                  Perfect for most orders
                </span>
                <span className="text-lg font-bold text-[#46332E]">
                  {selectedCountry === "US"
                    ? "₦15,000"
                    : selectedCountry === "GB"
                    ? "₦16,000"
                    : selectedCountry === "CA"
                    ? "₦18,000"
                    : selectedCountry === "NG"
                    ? "₦5,000"
                    : "₦15,000"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3 border-2 border-gray-200 p-4 rounded-lg hover:border-[#46332E]/30 transition-all duration-200 cursor-pointer">
            <RadioGroupItem
              value="express"
              id="express"
              className="mt-1 text-[#46332E]"
            />
            <div className="flex-1">
              <Label
                htmlFor="express"
                className="font-semibold text-[#46332E] cursor-pointer text-base"
              >
                Express Delivery
              </Label>
              <p className="text-sm text-[#46332E]/70 mt-1">
                3-5 business days
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-[#46332E]/60">
                  Priority handling & faster delivery
                </span>
                <span className="text-lg font-bold text-[#46332E]">
                  {selectedCountry === "US"
                    ? "₦22,500"
                    : selectedCountry === "GB"
                    ? "₦24,000"
                    : selectedCountry === "CA"
                    ? "₦27,000"
                    : selectedCountry === "NG"
                    ? "₦7,500"
                    : "₦22,500"}
                </span>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>
    </motion.div>
  );
}

// Step 3: Payment
// In the PaymentStep component, update the PaymentStepProps interface:
interface PaymentStepProps {
  watch: UseFormWatch<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>; // ensure required
  errors: FieldErrors<CheckoutFormData>;
  cartItems: CartProduct[];
  cartTotal: number;
  shippingCost: number;
  register: UseFormRegister<CheckoutFormData>;
  buyNowMode?: boolean;
  buyNowItem?: CartProduct | null;
  buyNowTotal?: number;
}

// Updated PaymentStep component with Paystack integration
function PaymentStep({
  watch,
  setValue,
  errors,
  cartItems,
  cartTotal,
  shippingCost,
  register,
  buyNowMode,
  buyNowItem,
  buyNowTotal,
}: PaymentStepProps) {
  const deliverySpeed = watch("delivery.deliverySpeed");
  const totalAmount = cartTotal + shippingCost;
  // This component is display-only; payment handling occurs via parent CTA

  // Payment starts from the parent CTA; this component only displays info/errors

  // Handle checkbox changes
  const handleCheckboxChange = (
    field: Path<CheckoutFormData>,
    checked: boolean
  ) => {
    setValue(field, checked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Enhanced Payment Header */}
      <div className="bg-gradient-to-r from-[#F5F3F0] to-[#E8E4E0] p-6 rounded-xl border border-[#46332E]/10 mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-[#46332E] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
            <CreditCard className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-semibold text-[#46332E]">
            Order Summary & Payment
          </h2>
        </div>
        <p className="text-[#46332E]/80 leading-relaxed">
          Review your order details and choose your preferred payment method to
          complete your purchase.
        </p>
      </div>

      {/* Enhanced Order Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-[#46332E] mb-4">
          Order Details
        </h3>

        <div className="space-y-4">
          {(buyNowMode && buyNowItem ? [buyNowItem] : cartItems).map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex-1">
                <p className="font-semibold text-[#46332E]">{item.name}</p>
                <p className="text-sm text-[#46332E]/70">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="font-bold text-[#46332E]">
                ₦{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between py-2">
              <span className="text-[#46332E]/70">Subtotal</span>
              <span className="font-medium">
                ₦
                {(buyNowMode && buyNowItem
                  ? buyNowTotal ?? 0
                  : cartTotal ?? 0
                ).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-[#46332E]/70">
                Shipping ({deliverySpeed === "express" ? "Express" : "Standard"}
                )
              </span>
              <span className="font-medium">
                ₦{(shippingCost ?? 0).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between py-3 border-t border-gray-200 mt-2">
              <span className="text-lg font-bold text-[#46332E]">Total</span>
              <span className="text-lg font-bold text-[#46332E]">
                ₦{(totalAmount ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Paystack Payment Integration */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-[#46332E] mb-4">
          Secure Payment with Paystack
        </h3>

        <div className="bg-gradient-to-r from-[#F5F3F0] to-[#E8E4E0] p-6 rounded-xl border border-[#46332E]/10 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-[#46332E] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
              <CreditCard className="w-4 h-4" />
            </div>
            <h4 className="text-lg font-semibold text-[#46332E]">
              Secure Payment Gateway
            </h4>
          </div>
          <p className="text-[#46332E]/80 mb-4">
            Your payment will be processed securely through Paystack, supporting
            all major payment methods including:
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="bg-white px-3 py-1 rounded-md border border-[#E5D3C6]">
              <span className="text-xs font-medium text-[#46332E]">Visa</span>
            </div>
            <div className="bg-white px-3 py-1 rounded-md border border-[#E5D3C6]">
              <span className="text-xs font-medium text-[#46332E]">
                Mastercard
              </span>
            </div>
            <div className="bg-white px-3 py-1 rounded-md border border-[#E5D3C6]">
              <span className="text-xs font-medium text-[#46332E]">Verve</span>
            </div>
            <div className="bg-white px-3 py-1 rounded-md border border-[#E5D3C6]">
              <span className="text-xs font-medium text-[#46332E]">
                Bank Transfer
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#46332E]/60 text-center mt-3">
          Your payment information is encrypted and secure. We never store your
          card details.
        </p>
      </div>

      {/* Enhanced Terms and Conditions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <Checkbox
              id="agreeToTerms"
              className="text-[#46332E] border-gray-300 rounded"
              checked={watch("payment.agreeToTerms")}
              onCheckedChange={(checked) => {
                handleCheckboxChange(
                  "payment.agreeToTerms",
                  checked as boolean
                );
                // If unchecked, manually trigger validation
                if (!checked) {
                  setValue("payment.agreeToTerms", false, {
                    shouldValidate: true,
                  });
                }
              }}
              {...register("payment.agreeToTerms", {
                required: "You must agree to the terms and conditions",
              })}
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="agreeToTerms"
              className="text-base text-[#46332E] cursor-pointer font-medium"
            >
              I agree to the{" "}
              <span className="underline hover:text-[#46332E]/80 text-[#46332E]">
                Terms and Conditions
              </span>
              ,{" "}
              <span className="underline hover:text-[#46332E]/80 text-[#46332E]">
                Privacy Policy
              </span>
              , and{" "}
              <span className="underline hover:text-[#46332E]/80 text-[#46332E]">
                Refund Policy
              </span>
            </label>
            {errors.payment?.agreeToTerms && (
              <p className="text-red-500 text-sm mt-2">
                You must agree to the terms and conditions
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Important Note */}
      <div className="bg-gradient-to-r from-[#F5F3F0] to-[#E8E4E0] p-6 rounded-xl border border-[#E5D3C6]">
        <div className="flex items-start">
          <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
            <span className="text-xs font-bold">!</span>
          </div>
          <div>
            <h4 className="font-semibold text-[#46332E] mb-2">
              Important Note
            </h4>
            <p className="text-sm text-[#46332E] leading-relaxed">
              By clicking &quot;Complete Order&quot;, you agree to place an
              order for custom-tailored clothing based on the measurements you
              provided. Please ensure all measurements are accurate for the best
              fit.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
