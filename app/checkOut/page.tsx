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

// Define form data type
interface CheckoutFormData {
  measurements: {
    gender: "male" | "female";
    outfitType: string;
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
  };
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
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "ZA", name: "South Africa" },
  { code: "KE", name: "Kenya" },
  // Add more countries as needed
];

// Dummy data for outfit types
const outfitTypes = {
  male: ["Suit", "Shirt", "Trousers", "Jacket"],
  female: ["Dress", "Blouse", "Skirt", "Pants"],
};

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<CheckoutFormData>({
    defaultValues: {
      measurements: {
        gender: "male",
        outfitType: "",
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
      },
      delivery: {
        fullName: "",
        email: "",
        phone: "",
        country: "US",
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
    mode: "onChange",
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
      setStep(step + 1);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Final submission
    setIsSubmitting(true);
    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would integrate with your payment provider
      console.log("Order data:", {
        products: cartItems,
        totalAmount: cartTotal,
        customerInfo: data.delivery,
        measurements: data.measurements,
        paymentStatus: "paid",
        paymentRef:
          "ORDER_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      });

      // Clear cart and redirect to success page
      clearCart();
      router.push("/checkOut/success");
    } catch (error) {
      console.error("Error processing order:", error);
      alert("There was a problem processing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Calculate shipping cost based on country and delivery speed
  const calculateShippingCost = (country: string, deliverySpeed: string) => {
    // Group countries by shipping zones
    const zone1 = ["US", "CA"]; // North America
    const zone2 = ["GB", "FR", "DE", "IT", "ES"]; // Europe
    const zone3 = ["NG", "GH", "ZA", "KE"]; // Africa

    let baseRate = 10; // Default international rate

    if (zone1.includes(country)) {
      baseRate = 8;
    } else if (zone2.includes(country)) {
      baseRate = 12;
    } else if (zone3.includes(country)) {
      baseRate = 15;
    }

    // Express delivery costs more
    return deliverySpeed === "express" ? baseRate * 2.5 : baseRate;
  };

  // Get the selected country and delivery speed
  const selectedCountry = watch("delivery.country");
  const selectedDeliverySpeed = watch("delivery.deliverySpeed");

  // Calculate shipping cost
  const shippingCost = calculateShippingCost(
    selectedCountry,
    selectedDeliverySpeed
  );

  // Calculate total with shipping
  const orderTotal = cartTotal + shippingCost;

  // Add global styles for smooth scrolling
  useEffect(() => {
    // Add smooth scrolling to the document
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      // Clean up
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  // If cart is empty, redirect to collections
  if (cartItems.length === 0) {
    return (
      <>
        {/* <Banner title="CHECKOUT" description="Complete your purchase with our secure checkout process." /> */}
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
                className="bg-[#46332E] hover:bg-[#46332E]/90"
              >
                Browse Collections
              </Button>
            </div>
          </div>
        </Container>
      </>
    );
  }

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
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
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
                      cartItems={cartItems}
                      cartTotal={cartTotal}
                      shippingCost={shippingCost}
                    />
                  )}
                </AnimatePresence>

                {/* Step Navigation Buttons */}
                <div className="flex justify-between items-center mt-10">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1}
                    className="flex items-center border border-[#d6ccc2] text-[#46332E] hover:bg-[#f5f3f0] transition-all duration-200 rounded-xl px-5 py-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center bg-[#46332E] hover:bg-[#46332E]/90 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
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
                      "Complete Order"
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
                  {cartItems.map((item) => (
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
                            $
                            {(
                              (item.salePrice || item.price) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-[#46332E]/70">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#46332E]/70">Shipping</span>
                    <span className="font-medium">
                      ${shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {step === 1 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-md text-sm">
                    <h3 className="font-medium text-blue-800 mb-2">
                      Measurement Tips:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-blue-700">
                      <li>Use a soft measuring tape</li>
                      <li>Keep one finger space between tape and skin</li>
                      <li>Select your preferred measurement unit</li>
                      <li>For accurate fit, have someone help you</li>
                    </ul>
                  </div>
                )}

                {step === 2 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-md text-sm">
                    <h3 className="font-medium text-blue-800 mb-2">
                      Shipping Information:
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-blue-700">
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
  register: UseFormRegister<CheckoutFormData>;
  watch: UseFormWatch<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

function MeasurementsStep({
  register,
  watch,
  setValue,
  errors,
}: MeasurementsStepProps) {
  const gender = watch("measurements.gender");
  const measurementUnit = watch("measurements.measurementUnit");

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
      <div className="bg-[#F5F3F0] p-5 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-[#46332E] mb-3">
          Measurement Instructions
        </h2>
        <p className="text-[#46332E]/80 mb-4">
          For the perfect custom fit, please provide your measurements
          accurately. Use a soft measuring tape and keep one finger space
          between the tape and your skin.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
              1
            </div>
            <p className="text-sm">
              Stand straight with your arms relaxed at your sides for most
              measurements.
            </p>
          </div>
          <div className="flex items-start">
            <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
              2
            </div>
            <p className="text-sm">
              For chest/bust, measure at the fullest part while breathing
              normally.
            </p>
          </div>
          <div className="flex items-start">
            <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
              3
            </div>
            <p className="text-sm">
              For waist, measure at your natural waistline (the narrowest part).
            </p>
          </div>
          <div className="flex items-start">
            <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
              4
            </div>
            <p className="text-sm">
              For hips, measure at the fullest part, approximately 8&#34; below
              your waist.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#46332E] mb-6">
          Your Measurements
        </h2>

        <div className="space-y-6">
          {/* Measurement Unit Selection */}
          <div className="mb-6">
            <Label className="text-base font-semibold text-[#46332E]">
              Measurement Unit
            </Label>
            <RadioGroup
              defaultValue={measurementUnit}
              onValueChange={(value) =>
                handleRadioChange("measurements.measurementUnit", value)
              }
              className="flex gap-6 mt-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="inches"
                  id="inches"
                  className="text-[#46332E] w-5 h-5 rounded-full border-2 border-[#46332E] focus:ring-[#46332E]"
                />
                <Label
                  htmlFor="inches"
                  className="text-[#46332E] cursor-pointer text-sm sm:text-base"
                >
                  Inches
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="cm"
                  id="cm"
                  className="text-[#46332E] w-5 h-5 rounded-full border-2 border-[#46332E] focus:ring-[#46332E]"
                />
                <Label
                  htmlFor="cm"
                  className="text-[#46332E] cursor-pointer text-sm sm:text-base"
                >
                  Centimeters
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Gender Selection */}
          <div className="mb-6">
            <Label className="text-base font-semibold text-[#46332E]">
              Gender
            </Label>
            <RadioGroup
              defaultValue={gender}
              onValueChange={(value) =>
                handleRadioChange("measurements.gender", value)
              }
              className="flex gap-6 mt-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="male"
                  id="male"
                  className="text-[#46332E] w-5 h-5 rounded-full border-2 border-[#46332E] focus:ring-[#46332E]"
                />
                <Label
                  htmlFor="male"
                  className="text-[#46332E] cursor-pointer text-sm sm:text-base"
                >
                  Male
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="female"
                  id="female"
                  className="text-[#46332E] w-5 h-5 rounded-full border-2 border-[#46332E] focus:ring-[#46332E]"
                />
                <Label
                  htmlFor="female"
                  className="text-[#46332E] cursor-pointer text-sm sm:text-base"
                >
                  Female
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Outfit Type */}
          <div className="mb-6">
            <Label
              htmlFor="outfitType"
              className="text-base font-semibold text-[#46332E]"
            >
              Outfit Type
            </Label>

            <Select
              onValueChange={(value) =>
                setValue("measurements.outfitType", value)
              }
              defaultValue={watch("measurements.outfitType")}
            >
              <SelectTrigger className="w-full mt-2 rounded-xl border border-[#d6ccc2] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E] shadow-sm transition-all">
                <SelectValue placeholder="Select outfit type" />
              </SelectTrigger>

              <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-md text-[#46332E]">
                {(gender === "male"
                  ? outfitTypes.male
                  : outfitTypes.female
                ).map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="hover:bg-[#f5f3f0] px-4 py-2 cursor-pointer rounded-md transition-all"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.measurements?.outfitType && (
              <p className="text-red-500 text-sm mt-2">
                {errors.measurements.outfitType.message}
              </p>
            )}
          </div>

          {/* Common Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Height */}
            <div>
              <Label
                htmlFor="height"
                className="text-base font-semibold text-[#46332E]"
              >
                Height ({measurementUnit})
              </Label>
              <Input
                id="height"
                type="text"
                {...register("measurements.height")}
                className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
              />
              {errors.measurements?.height && (
                <p className="text-red-500 text-sm mt-2">Height is required</p>
              )}
            </div>

            {/* Shoulder */}
            <div>
              <Label
                htmlFor="shoulder"
                className="text-base font-semibold text-[#46332E]"
              >
                Shoulder Width ({measurementUnit})
              </Label>
              <Input
                id="shoulder"
                type="text"
                {...register("measurements.shoulder")}
                className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
              />
              {errors.measurements?.shoulder && (
                <p className="text-red-500 text-sm mt-2">
                  Shoulder width is required
                </p>
              )}
            </div>

            {/* Chest or Bust */}
            {gender === "male" ? (
              <div>
                <Label
                  htmlFor="chest"
                  className="text-base font-semibold text-[#46332E]"
                >
                  Chest ({measurementUnit})
                </Label>
                <Input
                  id="chest"
                  type="text"
                  {...register("measurements.chest")}
                  className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
                />
              </div>
            ) : (
              <div>
                <Label
                  htmlFor="bust"
                  className="text-base font-semibold text-[#46332E]"
                >
                  Bust ({measurementUnit})
                </Label>
                <Input
                  id="bust"
                  type="text"
                  {...register("measurements.bust")}
                  className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
                />
              </div>
            )}

            {/* Waist */}
            <div>
              <Label
                htmlFor="waist"
                className="text-base font-semibold text-[#46332E]"
              >
                Waist ({measurementUnit})
              </Label>
              <Input
                id="waist"
                type="text"
                {...register("measurements.waist")}
                className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
              />
              {errors.measurements?.waist && (
                <p className="text-red-500 text-sm mt-2">
                  Waist measurement is required
                </p>
              )}
            </div>

            {/* Hip */}
            <div>
              <Label
                htmlFor="hip"
                className="text-base font-semibold text-[#46332E]"
              >
                Hip ({measurementUnit})
              </Label>
              <Input
                id="hip"
                type="text"
                {...register("measurements.hip")}
                className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
              />
              {errors.measurements?.hip && (
                <p className="text-red-500 text-sm mt-2">
                  Hip measurement is required
                </p>
              )}
            </div>

            {/* Sleeve */}
            <div>
              <Label
                htmlFor="sleeve"
                className="text-base font-semibold text-[#46332E]"
              >
                Sleeve Length ({measurementUnit})
              </Label>
              <Input
                id="sleeve"
                type="text"
                {...register("measurements.sleeve")}
                className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
              />
              {errors.measurements?.sleeve && (
                <p className="text-red-500 text-sm mt-2">
                  Sleeve length is required
                </p>
              )}
            </div>

            {/* Inseam */}
            <div>
              <Label
                htmlFor="inseam"
                className="text-base font-semibold text-[#46332E]"
              >
                Inseam / Trouser Length ({measurementUnit})
              </Label>
              <Input
                id="inseam"
                type="text"
                {...register("measurements.inseam")}
                className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
              />
            </div>

            {/* Neck */}
            <div>
              <Label
                htmlFor="neck"
                className="text-base font-semibold text-[#46332E]"
              >
                Neck Circumference ({measurementUnit})
              </Label>
              <Input
                id="neck"
                type="text"
                {...register("measurements.neck")}
                className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label
              htmlFor="extraNote"
              className="text-base font-semibold text-[#46332E]"
            >
              Additional Notes{" "}
              <span className="text-sm text-[#46332E]/60">(Optional)</span>
            </Label>
            <Textarea
              id="extraNote"
              placeholder="Any specific requirements or details about your measurements..."
              {...register("measurements.extraNote")}
              className="mt-2 px-4 py-3 min-h-[120px] border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E] placeholder:text-[#46332E]/50"
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
      <h2 className="text-xl font-semibold text-[#46332E] mb-6">
        Delivery Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <Label
            htmlFor="fullName"
            className="text-base font-semibold text-[#46332E]"
          >
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            {...register("delivery.fullName")}
            className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
          />
          {errors.delivery?.fullName && (
            <p className="text-red-500 text-sm mt-1">Full name is required</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label
            htmlFor="email"
            className="text-base font-semibold text-[#46332E]"
          >
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            {...register("delivery.email")}
            className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
          />
          {errors.delivery?.email && (
            <p className="text-red-500 text-sm mt-1">Valid email is required</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label
            htmlFor="phone"
            className="text-base font-semibold text-[#46332E]"
          >
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register("delivery.phone")}
            className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
          />
          {errors.delivery?.phone && (
            <p className="text-red-500 text-sm mt-1">
              Valid phone number is required
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <Label
            htmlFor="country"
            className="text-base font-semibold text-[#46332E]"
          >
            Country
          </Label>
          <Select
            onValueChange={(value) => setValue("delivery.country", value)}
            defaultValue={selectedCountry}
          >
            <SelectTrigger className="w-full mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm text-[#46332E] focus:outline-none focus:ring-2 focus:ring-[#46332E]">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto text-[#46332E]">
              {countryOptions.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.delivery?.country && (
            <p className="text-red-500 text-sm mt-1">Country is required</p>
          )}
        </div>

        {/* State */}
        <div>
          <Label
            htmlFor="state"
            className="text-base font-semibold text-[#46332E]"
          >
            State / Province / Region
          </Label>
          <Input
            id="state"
            type="text"
            {...register("delivery.state")}
            className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
          />
          {errors.delivery?.state && (
            <p className="text-red-500 text-sm mt-1">
              State/Province is required
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <Label
            htmlFor="city"
            className="text-base font-semibold text-[#46332E]"
          >
            City
          </Label>
          <Input
            id="city"
            type="text"
            {...register("delivery.city")}
            className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
          />
          {errors.delivery?.city && (
            <p className="text-red-500 text-sm mt-1">City is required</p>
          )}
        </div>

        {/* Street Address */}
        <div className="md:col-span-2">
          <Label
            htmlFor="address"
            className="text-base font-semibold text-[#46332E]"
          >
            Street Address
          </Label>
          <Textarea
            id="address"
            {...register("delivery.address")}
            className="mt-2 px-4 py-3 min-h-[100px] border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E] placeholder:text-[#46332E]/50"
            placeholder="Enter full delivery address"
          />
          {errors.delivery?.address && (
            <p className="text-red-500 text-sm mt-1">
              Delivery address is required
            </p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <Label
            htmlFor="postalCode"
            className="text-base font-semibold text-[#46332E]"
          >
            Postal / Zip Code
          </Label>
          <Input
            id="postalCode"
            type="text"
            {...register("delivery.postalCode")}
            className="mt-2 px-4 py-3 border border-[#d6ccc2] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#46332E] text-[#46332E]"
          />
        </div>
      </div>

      {/* Delivery Speed */}
      <div>
        <Label className="text-base font-semibold text-[#46332E]">
          Delivery Speed
        </Label>
        <RadioGroup
          defaultValue={watch("delivery.deliverySpeed")}
          className="mt-3 space-y-4"
          onValueChange={(value) =>
            handleRadioChange("delivery.deliverySpeed", value)
          }
        >
          {/* Standard */}
          <div className="flex items-start gap-3 border border-[#e0dcd6] p-4 rounded-xl hover:bg-[#f9f9f9] transition-colors duration-200 shadow-sm cursor-pointer">
            <RadioGroupItem
              value="standard"
              id="standard"
              className="mt-1 text-[#46332E] border-[#46332E] focus:ring-[#46332E]"
            />
            <div className="flex-1">
              <Label
                htmlFor="standard"
                className="font-medium text-[#46332E] cursor-pointer"
              >
                Standard Delivery
              </Label>
              <p className="text-sm text-[#46332E]/70 mt-1">
                7–14 business days
              </p>
              <p className="text-sm font-medium mt-1 text-[#46332E]">
                {selectedCountry === "US" || selectedCountry === "CA"
                  ? "$8.00"
                  : ["GB", "FR", "DE", "IT", "ES"].includes(selectedCountry)
                  ? "$12.00"
                  : "$15.00"}
              </p>
            </div>
          </div>

          {/* Express */}
          <div className="flex items-start gap-3 border border-[#e0dcd6] p-4 rounded-xl hover:bg-[#f9f9f9] transition-colors duration-200 shadow-sm cursor-pointer">
            <RadioGroupItem
              value="express"
              id="express"
              className="mt-1 text-[#46332E] border-[#46332E] focus:ring-[#46332E]"
            />
            <div className="flex-1">
              <Label
                htmlFor="express"
                className="font-medium text-[#46332E] cursor-pointer"
              >
                Express Delivery
              </Label>
              <p className="text-sm text-[#46332E]/70 mt-1">
                3–5 business days
              </p>
              <p className="text-sm font-medium mt-1 text-[#46332E]">
                {selectedCountry === "US" || selectedCountry === "CA"
                  ? "$20.00"
                  : ["GB", "FR", "DE", "IT", "ES"].includes(selectedCountry)
                  ? "$30.00"
                  : "$37.50"}
              </p>
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
  setValue: UseFormSetValue<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  cartItems: CartProduct[];
  cartTotal: number;
  shippingCost: number;
}

function PaymentStep({
  watch,
  setValue,
  errors,
  cartItems,
  cartTotal,
  shippingCost,
}: PaymentStepProps) {
  const deliverySpeed = watch("delivery.deliverySpeed");
  const totalAmount = cartTotal + shippingCost;

  // In the PaymentStep component, update the handleRadioChange and handleCheckboxChange functions:
  const handleRadioChange = (field: Path<CheckoutFormData>, value: string) => {
    setValue(field, value);
  };

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
      <h2 className="text-xl font-semibold text-[#46332E] mb-6">
        Order Summary & Payment
      </h2>

      {/* Order Details */}
      <div className="bg-[#F5F3F0] p-6 rounded-2xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-[#46332E] mb-4">
          Order Details
        </h3>

        <div className="space-y-5">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div>
                <p className="text-base font-medium text-[#46332E]">
                  {item.name}
                </p>
                <p className="text-sm text-[#46332E]/60">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="text-base font-medium text-[#46332E]">
                ${(item.salePrice || item.price) * item.quantity}
              </p>
            </div>
          ))}

          <div className="border-t border-[#d6ccc2] pt-4 space-y-2 text-[#46332E] text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>
                Shipping ({deliverySpeed === "express" ? "Express" : "Standard"}
                )
              </span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-[#F5F3F0] p-6 rounded-2xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-[#46332E] mb-4">
          Payment Method
        </h3>

        <RadioGroup
          defaultValue={watch("payment.paymentMethod")}
          className="space-y-4"
          onValueChange={(value) =>
            handleRadioChange("payment.paymentMethod", value)
          }
        >
          {/* Card Option */}
          <div className="flex items-start space-x-3 border border-[#d6ccc2] p-4 rounded-xl bg-white hover:bg-[#fdfcfb] transition-colors cursor-pointer">
            <RadioGroupItem
              value="card"
              id="card"
              className="mt-1 text-[#46332E]"
            />
            <div className="flex-1">
              <Label
                htmlFor="card"
                className="text-base font-medium text-[#46332E] cursor-pointer"
              >
                Credit / Debit Card
              </Label>
              <p className="text-sm text-[#46332E]/70 mt-1">
                Secure payment via credit or debit card
              </p>
              <div className="flex gap-2 mt-3">
                <Image
                  src="/placeholder.svg?height=30&width=40"
                  alt="Visa"
                  width={40}
                  height={30}
                  className="rounded-md"
                />
                <Image
                  src="/placeholder.svg?height=30&width=40"
                  alt="Mastercard"
                  width={40}
                  height={30}
                  className="rounded-md"
                />
                <Image
                  src="/placeholder.svg?height=30&width=40"
                  alt="Amex"
                  width={40}
                  height={30}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>

          {/* PayPal Option */}
          <div className="flex items-start space-x-3 border border-[#d6ccc2] p-4 rounded-xl bg-white hover:bg-[#fdfcfb] transition-colors cursor-pointer">
            <RadioGroupItem
              value="paypal"
              id="paypal"
              className="mt-1 text-[#46332E]"
            />
            <div className="flex-1">
              <Label
                htmlFor="paypal"
                className="text-base font-medium text-[#46332E] cursor-pointer"
              >
                PayPal
              </Label>
              <p className="text-sm text-[#46332E]/70 mt-1">
                Fast and secure payment with PayPal
              </p>
              <div className="mt-3">
                <Image
                  src="/placeholder.svg?height=30&width=80"
                  alt="PayPal"
                  width={80}
                  height={30}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Bank Transfer Option */}
          <div className="flex items-start space-x-3 border border-[#d6ccc2] p-4 rounded-xl bg-white hover:bg-[#fdfcfb] transition-colors cursor-pointer">
            <RadioGroupItem
              value="bank"
              id="bank"
              className="mt-1 text-[#46332E]"
            />
            <div className="flex-1">
              <Label
                htmlFor="bank"
                className="text-base font-medium text-[#46332E] cursor-pointer"
              >
                Bank Transfer
              </Label>
              <p className="text-sm text-[#46332E]/70 mt-1">
                Direct bank transfer (processing may take 1–2 business days)
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Terms & Agreement */}
      <div className="flex items-start space-x-3 mt-6">
        <div className="mt-1">
          <Checkbox
            id="agreeToTerms"
            className="text-[#46332E] border-gray-300 rounded"
            checked={watch("payment.agreeToTerms")}
            onCheckedChange={(checked) =>
              handleCheckboxChange("payment.agreeToTerms", checked as boolean)
            }
          />
        </div>
        <div>
          <label
            htmlFor="agreeToTerms"
            className="text-sm text-[#46332E] cursor-pointer leading-relaxed"
          >
            I agree to the{" "}
            <span className="underline hover:text-[#46332E]/80">
              Terms and Conditions
            </span>
            ,{" "}
            <span className="underline hover:text-[#46332E]/80">
              Privacy Policy
            </span>
            , and{" "}
            <span className="underline hover:text-[#46332E]/80">
              Refund Policy
            </span>
          </label>
          {errors.payment?.agreeToTerms && (
            <p className="text-sm text-red-500 mt-1">
              You must agree to the terms and conditions
            </p>
          )}
        </div>
      </div>

      {/* Order Disclaimer Note */}
      <div className="bg-[#F5F3F0] p-5 rounded-2xl shadow-sm border border-[#d6ccc2]">
        <p className="text-sm text-[#46332E] leading-relaxed">
          <span className="font-semibold">Note:</span> By clicking{" "}
          <span className="font-medium text-[#46332E]">
            &#34;Complete Order&#34;
          </span>
          , you agree to place an order for custom-tailored clothing based on
          the measurements you provided. Please ensure all measurements are
          accurate.
        </p>
      </div>
    </motion.div>
  );
}
