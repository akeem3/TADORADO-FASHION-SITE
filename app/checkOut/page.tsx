"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight, ChevronLeft, Ruler, Truck, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Container from "@/app/Components/Container"
// import Banner from "@/components/ui/banner"
import Image from "next/image"
// Import the Path type from react-hook-form to properly type the setValue calls
import type { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors, Path } from "react-hook-form"

// Update the CartProduct type to match what's in your CartContext
import { useCart, type CartProduct } from "@/components/ui/CartContext"

// Define form data type
interface CheckoutFormData {
  measurements: {
    gender: "male" | "female"
    outfitType: string
    height: string
    shoulder: string
    chest?: string
    bust?: string
    waist: string
    hip: string
    sleeve: string
    inseam?: string
    neck?: string
    extraNote?: string
    measurementUnit: "inches" | "cm"
  }
  delivery: {
    fullName: string
    email: string
    phone: string
    country: string
    state: string
    city: string
    address: string
    postalCode?: string
    deliverySpeed: "standard" | "express"
  }
  payment: {
    paymentMethod: "card" | "paypal" | "bank"
    agreeToTerms: boolean
  }
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
]

// Dummy data for outfit types
const outfitTypes = {
  male: ["Suit", "Shirt", "Trousers", "Jacket"],
  female: ["Dress", "Blouse", "Skirt", "Pants"],
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const { cartItems, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  })

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = methods

  const onSubmit = async (data: CheckoutFormData) => {
    if (step < 3) {
      setStep(step + 1)
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    // Final submission
    setIsSubmitting(true)
    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Here you would integrate with your payment provider
      console.log("Order data:", {
        products: cartItems,
        totalAmount: cartTotal,
        customerInfo: data.delivery,
        measurements: data.measurements,
        paymentStatus: "paid",
        paymentRef: "ORDER_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      })

      // Clear cart and redirect to success page
      clearCart()
      router.push("/checkOut/success")
    } catch (error) {
      console.error("Error processing order:", error)
      alert("There was a problem processing your order. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Calculate shipping cost based on country and delivery speed
  const calculateShippingCost = (country: string, deliverySpeed: string) => {
    // Group countries by shipping zones
    const zone1 = ["US", "CA"] // North America
    const zone2 = ["GB", "FR", "DE", "IT", "ES"] // Europe
    const zone3 = ["NG", "GH", "ZA", "KE"] // Africa

    let baseRate = 10 // Default international rate

    if (zone1.includes(country)) {
      baseRate = 8
    } else if (zone2.includes(country)) {
      baseRate = 12
    } else if (zone3.includes(country)) {
      baseRate = 15
    }

    // Express delivery costs more
    return deliverySpeed === "express" ? baseRate * 2.5 : baseRate
  }

  // Get the selected country and delivery speed
  const selectedCountry = watch("delivery.country")
  const selectedDeliverySpeed = watch("delivery.deliverySpeed")

  // Calculate shipping cost
  const shippingCost = calculateShippingCost(selectedCountry, selectedDeliverySpeed)

  // Calculate total with shipping
  const orderTotal = cartTotal + shippingCost

  // Add global styles for smooth scrolling
  useEffect(() => {
    // Add smooth scrolling to the document
    document.documentElement.style.scrollBehavior = "smooth"

    return () => {
      // Clean up
      document.documentElement.style.scrollBehavior = ""
    }
  }, [])

  // If cart is empty, redirect to collections
  if (cartItems.length === 0) {
    return (
      <>
        {/* <Banner title="CHECKOUT" description="Complete your purchase with our secure checkout process." /> */}
        <Container>
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-[#46332E] mb-4">Your cart is empty</h2>
              <p className="text-[#46332E]/70 mb-8">Add some items to your cart before proceeding to checkout.</p>
              <Button onClick={() => router.push("/collections")} className="bg-[#46332E] hover:bg-[#46332E]/90">
                Browse Collections
              </Button>
            </div>
          </div>
        </Container>
      </>
    )
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
                <div key={item.number} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      step >= item.number ? "bg-[#46332E] text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > item.number ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm text-center ${step >= item.number ? "text-[#46332E] font-medium" : "text-gray-500"}`}
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

                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1}
                    className="flex items-center"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    type="submit"
                    className="bg-[#46332E] hover:bg-[#46332E]/90 text-white transition-all duration-300"
                    disabled={isSubmitting}
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
                <h2 className="text-xl font-bold text-[#46332E] mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-[#46332E] line-clamp-1">{item.name}</h3>
                        <div className="flex justify-between">
                          <p className="text-sm text-[#46332E]/70">Qty: {item.quantity}</p>
                          <p className="font-medium">${((item.salePrice || item.price) * item.quantity).toFixed(2)}</p>
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
                    <span className="font-medium">${shippingCost.toFixed(2)}</span>
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
                    <h3 className="font-medium text-blue-800 mb-2">Measurement Tips:</h3>
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
                    <h3 className="font-medium text-blue-800 mb-2">Shipping Information:</h3>
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
  )
}

// Step 1: Measurements Form
interface MeasurementsStepProps {
  register: UseFormRegister<CheckoutFormData>
  watch: UseFormWatch<CheckoutFormData>
  setValue: UseFormSetValue<CheckoutFormData>
  errors: FieldErrors<CheckoutFormData>
}

function MeasurementsStep({ register, watch, setValue, errors }: MeasurementsStepProps) {
  const gender = watch("measurements.gender")
  const measurementUnit = watch("measurements.measurementUnit")

  // In the MeasurementsStep component, update the handleRadioChange function:
  const handleRadioChange = (field: Path<CheckoutFormData>, value: string) => {
    setValue(field, value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-[#F5F3F0] p-5 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-[#46332E] mb-3">Measurement Instructions</h2>
        <p className="text-[#46332E]/80 mb-4">
          For the perfect custom fit, please provide your measurements accurately. Use a soft measuring tape and keep
          one finger space between the tape and your skin.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
              1
            </div>
            <p className="text-sm">Stand straight with your arms relaxed at your sides for most measurements.</p>
          </div>
          <div className="flex items-start">
            <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
              2
            </div>
            <p className="text-sm">For chest/bust, measure at the fullest part while breathing normally.</p>
          </div>
          <div className="flex items-start">
            <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
              3
            </div>
            <p className="text-sm">For waist, measure at your natural waistline (the narrowest part).</p>
          </div>
          <div className="flex items-start">
            <div className="bg-[#46332E] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
              4
            </div>
            <p className="text-sm">For hips, measure at the fullest part, approximately 8&#34; below your waist.</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#46332E] mb-6">Your Measurements</h2>

        <div className="space-y-6">
          {/* Measurement Unit Selection */}
          <div>
            <Label className="text-base font-medium">Measurement Unit</Label>
            <RadioGroup
              defaultValue={measurementUnit}
              className="flex gap-6 mt-2"
              onValueChange={(value) => handleRadioChange("measurements.measurementUnit", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inches" id="inches" className="text-[#46332E]" />
                <Label htmlFor="inches" className="cursor-pointer">
                  Inches
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cm" id="cm" className="text-[#46332E]" />
                <Label htmlFor="cm" className="cursor-pointer">
                  Centimeters
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Gender Selection */}
          <div>
            <Label className="text-base font-medium">Gender</Label>
            <RadioGroup
              defaultValue={gender}
              className="flex gap-6 mt-2"
              onValueChange={(value) => handleRadioChange("measurements.gender", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" className="text-[#46332E]" />
                <Label htmlFor="male" className="cursor-pointer">
                  Male
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" className="text-[#46332E]" />
                <Label htmlFor="female" className="cursor-pointer">
                  Female
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Outfit Type */}
          <div>
            <Label htmlFor="outfitType" className="text-base font-medium">
              Outfit Type
            </Label>
            <Select
              onValueChange={(value) => setValue("measurements.outfitType", value)}
              defaultValue={watch("measurements.outfitType")}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select outfit type" />
              </SelectTrigger>
              <SelectContent>
                {gender === "male"
                  ? outfitTypes.male.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))
                  : outfitTypes.female.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
            {errors.measurements?.outfitType && (
              <p className="text-red-500 text-sm mt-1">Please select an outfit type</p>
            )}
          </div>

          {/* Common Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="height" className="text-base font-medium">
                Height ({measurementUnit})
              </Label>
              <Input id="height" type="text" className="mt-1" {...register("measurements.height")} />
              {errors.measurements?.height && <p className="text-red-500 text-sm mt-1">Height is required</p>}
            </div>

            <div>
              <Label htmlFor="shoulder" className="text-base font-medium">
                Shoulder Width ({measurementUnit})
              </Label>
              <Input id="shoulder" type="text" className="mt-1" {...register("measurements.shoulder")} />
              {errors.measurements?.shoulder && <p className="text-red-500 text-sm mt-1">Shoulder width is required</p>}
            </div>

            {gender === "male" ? (
              <div>
                <Label htmlFor="chest" className="text-base font-medium">
                  Chest ({measurementUnit})
                </Label>
                <Input id="chest" type="text" className="mt-1" {...register("measurements.chest")} />
              </div>
            ) : (
              <div>
                <Label htmlFor="bust" className="text-base font-medium">
                  Bust ({measurementUnit})
                </Label>
                <Input id="bust" type="text" className="mt-1" {...register("measurements.bust")} />
              </div>
            )}

            <div>
              <Label htmlFor="waist" className="text-base font-medium">
                Waist ({measurementUnit})
              </Label>
              <Input id="waist" type="text" className="mt-1" {...register("measurements.waist")} />
              {errors.measurements?.waist && <p className="text-red-500 text-sm mt-1">Waist measurement is required</p>}
            </div>

            <div>
              <Label htmlFor="hip" className="text-base font-medium">
                Hip ({measurementUnit})
              </Label>
              <Input id="hip" type="text" className="mt-1" {...register("measurements.hip")} />
              {errors.measurements?.hip && <p className="text-red-500 text-sm mt-1">Hip measurement is required</p>}
            </div>

            <div>
              <Label htmlFor="sleeve" className="text-base font-medium">
                Sleeve Length ({measurementUnit})
              </Label>
              <Input id="sleeve" type="text" className="mt-1" {...register("measurements.sleeve")} />
              {errors.measurements?.sleeve && <p className="text-red-500 text-sm mt-1">Sleeve length is required</p>}
            </div>

            <div>
              <Label htmlFor="inseam" className="text-base font-medium">
                Inseam / Trouser Length ({measurementUnit})
              </Label>
              <Input id="inseam" type="text" className="mt-1" {...register("measurements.inseam")} />
            </div>

            <div>
              <Label htmlFor="neck" className="text-base font-medium">
                Neck Circumference ({measurementUnit})
              </Label>
              <Input id="neck" type="text" className="mt-1" {...register("measurements.neck")} />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="extraNote" className="text-base font-medium">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="extraNote"
              className="mt-1"
              placeholder="Any specific requirements or details about your measurements..."
              {...register("measurements.extraNote")}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Step 2: Delivery Details
interface DeliveryStepProps {
  countryOptions: { code: string; name: string }[]
  register: UseFormRegister<CheckoutFormData>
  watch: UseFormWatch<CheckoutFormData>
  setValue: UseFormSetValue<CheckoutFormData>
  errors: FieldErrors<CheckoutFormData>
}

function DeliveryStep({ countryOptions, register, watch, setValue, errors }: DeliveryStepProps) {
  const selectedCountry = watch("delivery.country")

  // In the DeliveryStep component, update the handleRadioChange function:
  const handleRadioChange = (field: Path<CheckoutFormData>, value: string) => {
    setValue(field, value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-[#46332E] mb-6">Delivery Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fullName" className="text-base font-medium">
            Full Name
          </Label>
          <Input id="fullName" type="text" className="mt-1" {...register("delivery.fullName")} />
          {errors.delivery?.fullName && <p className="text-red-500 text-sm mt-1">Full name is required</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-base font-medium">
            Email Address
          </Label>
          <Input id="email" type="email" className="mt-1" {...register("delivery.email")} />
          {errors.delivery?.email && <p className="text-red-500 text-sm mt-1">Valid email is required</p>}
        </div>

        <div>
          <Label htmlFor="phone" className="text-base font-medium">
            Phone Number
          </Label>
          <Input id="phone" type="tel" className="mt-1" {...register("delivery.phone")} />
          {errors.delivery?.phone && <p className="text-red-500 text-sm mt-1">Valid phone number is required</p>}
        </div>

        <div>
          <Label htmlFor="country" className="text-base font-medium">
            Country
          </Label>
          <Select onValueChange={(value) => setValue("delivery.country", value)} defaultValue={selectedCountry}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {countryOptions.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.delivery?.country && <p className="text-red-500 text-sm mt-1">Country is required</p>}
        </div>

        <div>
          <Label htmlFor="state" className="text-base font-medium">
            State / Province / Region
          </Label>
          <Input id="state" type="text" className="mt-1" {...register("delivery.state")} />
          {errors.delivery?.state && <p className="text-red-500 text-sm mt-1">State/Province is required</p>}
        </div>

        <div>
          <Label htmlFor="city" className="text-base font-medium">
            City
          </Label>
          <Input id="city" type="text" className="mt-1" {...register("delivery.city")} />
          {errors.delivery?.city && <p className="text-red-500 text-sm mt-1">City is required</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address" className="text-base font-medium">
            Street Address
          </Label>
          <Textarea id="address" className="mt-1" {...register("delivery.address")} />
          {errors.delivery?.address && <p className="text-red-500 text-sm mt-1">Delivery address is required</p>}
        </div>

        <div>
          <Label htmlFor="postalCode" className="text-base font-medium">
            Postal / Zip Code
          </Label>
          <Input id="postalCode" type="text" className="mt-1" {...register("delivery.postalCode")} />
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Delivery Speed</Label>
        <RadioGroup
          defaultValue={watch("delivery.deliverySpeed")}
          className="mt-2 space-y-3"
          onValueChange={(value) => handleRadioChange("delivery.deliverySpeed", value)}
        >
          <div className="flex items-start space-x-2 border p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
            <RadioGroupItem value="standard" id="standard" className="mt-1 text-[#46332E]" />
            <div className="flex-1">
              <Label htmlFor="standard" className="font-medium cursor-pointer">
                Standard Delivery
              </Label>
              <p className="text-sm text-[#46332E]/70">7-14 business days</p>
              <p className="text-sm font-medium mt-1">
                {selectedCountry === "US" || selectedCountry === "CA"
                  ? "$8.00"
                  : ["GB", "FR", "DE", "IT", "ES"].includes(selectedCountry)
                    ? "$12.00"
                    : "$15.00"}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2 border p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
            <RadioGroupItem value="express" id="express" className="mt-1 text-[#46332E]" />
            <div className="flex-1">
              <Label htmlFor="express" className="font-medium cursor-pointer">
                Express Delivery
              </Label>
              <p className="text-sm text-[#46332E]/70">3-5 business days</p>
              <p className="text-sm font-medium mt-1">
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
  )
}

// Step 3: Payment
// In the PaymentStep component, update the PaymentStepProps interface:
interface PaymentStepProps {
  watch: UseFormWatch<CheckoutFormData>
  setValue: UseFormSetValue<CheckoutFormData>
  errors: FieldErrors<CheckoutFormData>
  cartItems: CartProduct[]
  cartTotal: number
  shippingCost: number
}

function PaymentStep({ watch, setValue, errors, cartItems, cartTotal, shippingCost }: PaymentStepProps) {
  const deliverySpeed = watch("delivery.deliverySpeed")
  const totalAmount = cartTotal + shippingCost

  // In the PaymentStep component, update the handleRadioChange and handleCheckboxChange functions:
  const handleRadioChange = (field: Path<CheckoutFormData>, value: string) => {
    setValue(field, value)
  }

  const handleCheckboxChange = (field: Path<CheckoutFormData>, checked: boolean) => {
    setValue(field, checked)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-[#46332E] mb-6">Order Summary & Payment</h2>

      <div className="bg-[#F5F3F0] p-5 rounded-lg mb-6">
        <h3 className="font-medium text-[#46332E] mb-3">Order Details</h3>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-[#46332E]/70">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">${(item.salePrice || item.price) * item.quantity}</p>
            </div>
          ))}

          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Shipping ({deliverySpeed === "express" ? "Express" : "Standard"})</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-3 font-bold">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-[#46332E] mb-3">Payment Method</h3>

        <RadioGroup
          defaultValue={watch("payment.paymentMethod")}
          className="space-y-3"
          onValueChange={(value) => handleRadioChange("payment.paymentMethod", value)}
        >
          <div className="flex items-start space-x-2 border p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
            <RadioGroupItem value="card" id="card" className="mt-1 text-[#46332E]" />
            <div className="flex-1">
              <Label htmlFor="card" className="font-medium cursor-pointer">
                Credit / Debit Card
              </Label>
              <p className="text-sm text-[#46332E]/70">Secure payment via credit or debit card</p>
              <div className="flex gap-2 mt-2">
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

          <div className="flex items-start space-x-2 border p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
            <RadioGroupItem value="paypal" id="paypal" className="mt-1 text-[#46332E]" />
            <div className="flex-1">
              <Label htmlFor="paypal" className="font-medium cursor-pointer">
                PayPal
              </Label>
              <p className="text-sm text-[#46332E]/70">Fast and secure payment with PayPal</p>
              <div className="mt-2">
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

          <div className="flex items-start space-x-2 border p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
            <RadioGroupItem value="bank" id="bank" className="mt-1 text-[#46332E]" />
            <div className="flex-1">
              <Label htmlFor="bank" className="font-medium cursor-pointer">
                Bank Transfer
              </Label>
              <p className="text-sm text-[#46332E]/70">Direct bank transfer (processing may take 1-2 business days)</p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-start space-x-2 mt-6">
        <div className="mt-1">
          <Checkbox
            id="agreeToTerms"
            className="text-[#46332E] border-gray-300 rounded"
            checked={watch("payment.agreeToTerms")}
            onCheckedChange={(checked) => handleCheckboxChange("payment.agreeToTerms", checked as boolean)}
          />
        </div>
        <div>
          <label htmlFor="agreeToTerms" className="text-sm text-[#46332E] cursor-pointer">
            I agree to the <span className="underline hover:text-[#46332E]/80">Terms and Conditions</span>,{" "}
            <span className="underline hover:text-[#46332E]/80">Privacy Policy</span>, and{" "}
            <span className="underline hover:text-[#46332E]/80">Refund Policy</span>
          </label>
          {errors.payment?.agreeToTerms && (
            <p className="text-red-500 text-sm mt-1">You must agree to the terms and conditions</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> By clicking &#34;Complete Order&#34;, you agree to place an order for custom-tailored clothing
          based on the measurements you provided. Please ensure all measurements are accurate.
        </p>
      </div>
    </motion.div>
  )
}
