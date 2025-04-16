"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider, useFormContext, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Check, ChevronRight, ChevronLeft, Ruler, Truck, CreditCard, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/components/ui/CartContext"
import Container from "@/app/Components/Container"
import Banner from "@/components/ui/banner"
import Image from "next/image"

// Define a curated list of countries for the dropdown
const countriesList = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "ZA", name: "South Africa" },
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "KE", name: "Kenya" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "NZ", name: "New Zealand" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
].sort((a, b) => a.name.localeCompare(b.name))

// Define the schema for the entire form
const checkoutSchema = z.object({
  // Step 1: Measurements
  measurements: z.object({
    gender: z.enum(["male", "female"]),
    outfitType: z.string().min(1, "Please select an outfit type"),
    height: z.string().min(1, "Height is required"),
    shoulder: z.string().min(1, "Shoulder width is required"),
    chest: z.string().optional(),
    bust: z.string().optional(),
    waist: z.string().min(1, "Waist measurement is required"),
    hip: z.string().min(1, "Hip measurement is required"),
    sleeve: z.string().min(1, "Sleeve length is required"),
    inseam: z.string().optional(),
    neck: z.string().optional(),
    extraNote: z.string().optional(),
    measurementUnit: z.enum(["inches", "cm"]),
  }),

  // Step 2: Delivery Details
  delivery: z.object({
    fullName: z.string().min(3, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State/Province is required"),
    city: z.string().min(1, "City is required"),
    address: z.string().min(5, "Delivery address is required"),
    postalCode: z.string().optional(),
    deliverySpeed: z.enum(["standard", "express"]),
  }),

  // Step 3: Payment (minimal validation as payment will be handled by payment provider)
  payment: z.object({
    paymentMethod: z.enum(["card", "paypal", "bank"]),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  }),
})

// Update the type definition to use the Zod schema
type CheckoutFormData = z.infer<typeof checkoutSchema>

// Outfit types
const outfitTypes = {
  male: ["Senator (Owanbe)", "Ankara", "Corporate", "Vintage"],
  female: ["Owanbe Classical", "Bridal/Ankara", "Corset/Padded", "Gowns"],
}

const countryOptions = countriesList

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const { cartItems, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  // Now update the useForm call to properly use the type
  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      measurements: {
        gender: "male",
        outfitType: outfitTypes.male[0],
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
        measurementUnit: "inches", // Explicitly set default
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
        deliverySpeed: "standard", // Explicitly set default
      },
      payment: {
        paymentMethod: "card", // Explicitly set default
        agreeToTerms: false,
      },
    },
    mode: "onChange",
  })

  // Update the onSubmit function to use the correct type
  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    setFormError("")

    // For step 1 and 2, we'll handle navigation manually instead of relying on form submission
    if (step < 3) {
      handleNextStep()
      return
    }

    // Final submission (step 3)
    try {
      // Validate payment step
      await checkoutSchema.shape.payment.parseAsync(data.payment)

      setIsSubmitting(true)

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Here you would integrate with your payment provider
      console.log("Order data:", {
        products: cartItems,
        totalAmount: orderTotal,
        customerInfo: data.delivery,
        measurements: data.measurements,
        paymentMethod: data.payment.paymentMethod,
        paymentStatus: "paid",
        paymentRef: "ORDER_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      })

      // Clear cart and redirect to success page
      clearCart()
      router.push("/checkout/success")
    } catch (error) {
      console.error("Payment validation error:", error)
      setFormError("Please complete all payment information before submitting.")
      setIsSubmitting(false)
    }
  }

  // Add this new function to handle next step navigation
  const handleNextStep = async () => {
    try {
      const data = methods.getValues()

      if (step === 1) {
        // Validate measurements step
        await checkoutSchema.shape.measurements.parseAsync(data.measurements)
      } else if (step === 2) {
        // Validate delivery step
        await checkoutSchema.shape.delivery.parseAsync(data.delivery)
      }

      // If validation passes, move to the next step
      setStep(step + 1)
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" })
      setFormError("") // Clear any error messages
    } catch (error) {
      console.error("Validation error:", error)
      setFormError("Please fill in all required fields correctly before proceeding.")

      // Trigger form validation to show field-specific errors
      methods.trigger()
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
  const selectedCountry = methods.watch("delivery.country")
  const selectedDeliverySpeed = methods.watch("delivery.deliverySpeed")

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

  // Add a function to validate the current step
  const validateCurrentStep = async () => {
    try {
      if (step === 1) {
        const measurementsData = methods.getValues("measurements")
        await checkoutSchema.shape.measurements.parseAsync(measurementsData)
        return true
      } else if (step === 2) {
        const deliveryData = methods.getValues("delivery")
        await checkoutSchema.shape.delivery.parseAsync(deliveryData)
        return true
      } else if (step === 3) {
        const paymentData = methods.getValues("payment")
        await checkoutSchema.shape.payment.parseAsync(paymentData)
        return true
      }
      return false
    } catch (error) {
      console.error("Validation error:", error)
      setFormError("Please fill in all required fields correctly before proceeding.")
      return false
    }
  }

  // Add this to handle manual step navigation
  const handleStepChange = async (newStep: number) => {
    // Only validate when moving forward
    if (newStep > step) {
      const isValid = await validateCurrentStep()
      if (!isValid) return
    }

    setFormError("")
    setStep(newStep)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // If cart is empty, redirect to collections
  if (cartItems.length === 0) {
    return (
      <>
        <Banner title="CHECKOUT" description="Complete your purchase with our secure checkout process." />
        <Container>
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-[#F5F3F0] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-8 w-8 text-[#46332E]" />
              </div>
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
      <Banner title="CHECKOUT" description="Complete your purchase with our secure checkout process." />
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
                  className={`flex flex-col items-center relative z-10 ${item.number < step ? "cursor-pointer" : ""}`}
                  onClick={() => item.number < step && handleStepChange(item.number)}
                >
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
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  {formError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm">{formError}</p>
                    </div>
                  )}

                  <div>
                    {step === 1 && <MeasurementsStep key="step1" />}
                    {step === 2 && <DeliveryStep key="step2" countryOptions={countryOptions} />}
                    {step === 3 && <PaymentStep key="step3" />}
                  </div>

                  {/* Replace the form submit button section with this improved version */}
                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormError("") // Clear any error messages
                        handleStepChange(Math.max(1, step - 1))
                      }}
                      disabled={step === 1 || isSubmitting}
                      className="flex items-center"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>

                    {step < 3 ? (
                      <Button
                        type="button" // Changed from submit to button
                        onClick={handleNextStep}
                        className="bg-[#46332E] hover:bg-[#46332E]/90 text-white transition-all duration-300"
                      >
                        Continue
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
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
                        ) : (
                          "Complete Order"
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </FormProvider>
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

// Replace the MeasurementsStep function with this improved version
// Step 1: Measurements Form
function MeasurementsStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CheckoutFormData>()

  const gender = watch("measurements.gender")
  const measurementUnit = watch("measurements.measurementUnit")
  const outfitType = watch("measurements.outfitType")

  // Set a default outfit type when gender changes
  useEffect(() => {
    if (gender === "male" && !outfitTypes.male.includes(outfitType)) {
      setValue("measurements.outfitType", outfitTypes.male[0], { shouldValidate: true })
    } else if (gender === "female" && !outfitTypes.female.includes(outfitType)) {
      setValue("measurements.outfitType", outfitTypes.female[0], { shouldValidate: true })
    }
  }, [gender, outfitType, setValue])

  // Helper function to handle input changes and validate
  const handleInputChange = (field: string, value: string) => {
    setValue(`measurements.${field}` as any, value, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
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
            <p className="text-sm">For hips, measure at the fullest part, approximately 8`&#34;` below your waist.</p>
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
              onValueChange={(value) => {
                setValue("measurements.measurementUnit", value as "inches" | "cm", { shouldValidate: true })
              }}
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
              onValueChange={(value) => {
                setValue("measurements.gender", value as "male" | "female", { shouldValidate: true })
              }}
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
              value={outfitType}
              onValueChange={(value) => {
                setValue("measurements.outfitType", value, { shouldValidate: true })
              }}
            >
              <SelectTrigger id="outfitType" className="w-full mt-1">
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
              <p className="text-red-500 text-sm mt-1">{errors.measurements.outfitType.message}</p>
            )}
          </div>

          {/* Common Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="height" className="text-base font-medium">
                Height ({measurementUnit}) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="height"
                type="text"
                className="mt-1"
                {...register("measurements.height")}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
              {errors.measurements?.height && (
                <p className="text-red-500 text-sm mt-1">{errors.measurements.height.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="shoulder" className="text-base font-medium">
                Shoulder Width ({measurementUnit}) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shoulder"
                type="text"
                className="mt-1"
                {...register("measurements.shoulder")}
                onChange={(e) => handleInputChange("shoulder", e.target.value)}
              />
              {errors.measurements?.shoulder && (
                <p className="text-red-500 text-sm mt-1">{errors.measurements.shoulder.message}</p>
              )}
            </div>

            {gender === "male" ? (
              <div>
                <Label htmlFor="chest" className="text-base font-medium">
                  Chest ({measurementUnit})
                </Label>
                <Input
                  id="chest"
                  type="text"
                  className="mt-1"
                  {...register("measurements.chest")}
                  onChange={(e) => handleInputChange("chest", e.target.value)}
                />
                {errors.measurements?.chest && (
                  <p className="text-red-500 text-sm mt-1">{errors.measurements.chest.message}</p>
                )}
              </div>
            ) : (
              <div>
                <Label htmlFor="bust" className="text-base font-medium">
                  Bust ({measurementUnit})
                </Label>
                <Input
                  id="bust"
                  type="text"
                  className="mt-1"
                  {...register("measurements.bust")}
                  onChange={(e) => handleInputChange("bust", e.target.value)}
                />
                {errors.measurements?.bust && (
                  <p className="text-red-500 text-sm mt-1">{errors.measurements.bust.message}</p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="waist" className="text-base font-medium">
                Waist ({measurementUnit}) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="waist"
                type="text"
                className="mt-1"
                {...register("measurements.waist")}
                onChange={(e) => handleInputChange("waist", e.target.value)}
              />
              {errors.measurements?.waist && (
                <p className="text-red-500 text-sm mt-1">{errors.measurements.waist.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hip" className="text-base font-medium">
                Hip ({measurementUnit}) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hip"
                type="text"
                className="mt-1"
                {...register("measurements.hip")}
                onChange={(e) => handleInputChange("hip", e.target.value)}
              />
              {errors.measurements?.hip && (
                <p className="text-red-500 text-sm mt-1">{errors.measurements.hip.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="sleeve" className="text-base font-medium">
                Sleeve Length ({measurementUnit}) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sleeve"
                type="text"
                className="mt-1"
                {...register("measurements.sleeve")}
                onChange={(e) => handleInputChange("sleeve", e.target.value)}
              />
              {errors.measurements?.sleeve && (
                <p className="text-red-500 text-sm mt-1">{errors.measurements.sleeve.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="inseam" className="text-base font-medium">
                Inseam / Trouser Length ({measurementUnit})
              </Label>
              <Input
                id="inseam"
                type="text"
                className="mt-1"
                {...register("measurements.inseam")}
                onChange={(e) => handleInputChange("inseam", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="neck" className="text-base font-medium">
                Neck Circumference ({measurementUnit})
              </Label>
              <Input
                id="neck"
                type="text"
                className="mt-1"
                {...register("measurements.neck")}
                onChange={(e) => handleInputChange("neck", e.target.value)}
              />
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

          <div className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </div>
        </div>
      </div>
    </div>
  )
}

// Replace the DeliveryStep function with this improved version
// Step 2: Delivery Details
function DeliveryStep({ countryOptions }: { countryOptions: { code: string; name: string }[] }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CheckoutFormData>()

  const selectedCountry = watch("delivery.country")

  // Helper function to handle input changes and validate
  const handleInputChange = (field: string, value: string) => {
    setValue(`delivery.${field}` as any, value, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#46332E] mb-6">Delivery Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fullName" className="text-base font-medium">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            className="mt-1"
            {...register("delivery.fullName")}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
          />
          {errors.delivery?.fullName && <p className="text-red-500 text-sm mt-1">{errors.delivery.fullName.message}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-base font-medium">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            className="mt-1"
            {...register("delivery.email")}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          {errors.delivery?.email && <p className="text-red-500 text-sm mt-1">{errors.delivery.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone" className="text-base font-medium">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            className="mt-1"
            {...register("delivery.phone")}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
          {errors.delivery?.phone && <p className="text-red-500 text-sm mt-1">{errors.delivery.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="country" className="text-base font-medium">
            Country <span className="text-red-500">*</span>
          </Label>
          <Select
            value={selectedCountry}
            onValueChange={(value) => {
              setValue("delivery.country", value, { shouldValidate: true })
            }}
          >
            <SelectTrigger id="country" className="w-full mt-1">
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
          {errors.delivery?.country && <p className="text-red-500 text-sm mt-1">{errors.delivery.country.message}</p>}
        </div>

        <div>
          <Label htmlFor="state" className="text-base font-medium">
            State / Province / Region <span className="text-red-500">*</span>
          </Label>
          <Input
            id="state"
            type="text"
            className="mt-1"
            {...register("delivery.state")}
            onChange={(e) => handleInputChange("state", e.target.value)}
          />
          {errors.delivery?.state && <p className="text-red-500 text-sm mt-1">{errors.delivery.state.message}</p>}
        </div>

        <div>
          <Label htmlFor="city" className="text-base font-medium">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            type="text"
            className="mt-1"
            {...register("delivery.city")}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
          {errors.delivery?.city && <p className="text-red-500 text-sm mt-1">{errors.delivery.city.message}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address" className="text-base font-medium">
            Street Address <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="address"
            className="mt-1"
            {...register("delivery.address")}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
          {errors.delivery?.address && <p className="text-red-500 text-sm mt-1">{errors.delivery.address.message}</p>}
        </div>

        <div>
          <Label htmlFor="postalCode" className="text-base font-medium">
            Postal / Zip Code
          </Label>
          <Input
            id="postalCode"
            type="text"
            className="mt-1"
            {...register("delivery.postalCode")}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Delivery Speed</Label>
        <RadioGroup
          defaultValue="standard"
          className="mt-2 space-y-3"
          value={watch("delivery.deliverySpeed")}
          onValueChange={(value) => {
            setValue("delivery.deliverySpeed", value as "standard" | "express", { shouldValidate: true })
          }}
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

      <div className="text-sm text-gray-500">
        <span className="text-red-500">*</span> Required fields
      </div>
    </div>
  )
}

// Step 3: Payment
function PaymentStep() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CheckoutFormData>()
  const { cartItems, cartTotal } = useCart()
  const deliverySpeed = watch("delivery.deliverySpeed")
  const selectedCountry = watch("delivery.country")
  const paymentMethod = watch("payment.paymentMethod")


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

  const shippingCost = calculateShippingCost(selectedCountry, deliverySpeed)
  const totalAmount = cartTotal + shippingCost

  // Helper function to handle payment method change
  const handlePaymentMethodChange = (value: string) => {
    setValue("payment.paymentMethod", value as "card" | "paypal" | "bank", { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
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
              <p className="font-medium">${((item.salePrice || item.price) * item.quantity).toFixed(2)}</p>
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
        <h3 className="font-medium text-[#46332E] mb-3">
          Payment Method <span className="text-red-500">*</span>
        </h3>

        <RadioGroup value={paymentMethod} className="space-y-3" onValueChange={handlePaymentMethodChange}>
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

              {paymentMethod === "card" && (
                <div className="mt-4 space-y-3 border-t pt-3">
                  <div>
                    <Label htmlFor="cardNumber" className="text-sm font-medium">
                      Card Number
                    </Label>
                    <Input id="cardNumber" type="text" className="mt-1" placeholder="1234 5678 9012 3456" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="expiryDate" className="text-sm font-medium">
                        Expiry Date
                      </Label>
                      <Input id="expiryDate" type="text" className="mt-1" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-sm font-medium">
                        CVV
                      </Label>
                      <Input id="cvv" type="text" className="mt-1" placeholder="123" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="nameOnCard" className="text-sm font-medium">
                      Name on Card
                    </Label>
                    <Input id="nameOnCard" type="text" className="mt-1" placeholder="John Doe" />
                  </div>
                </div>
              )}
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

              {paymentMethod === "paypal" && (
                <div className="mt-4 space-y-3 border-t pt-3">
                  <p className="text-sm text-[#46332E]/70">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-2 border p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
            <RadioGroupItem value="bank" id="bank" className="mt-1 text-[#46332E]" />
            <div className="flex-1">
              <Label htmlFor="bank" className="font-medium cursor-pointer">
                Bank Transfer
              </Label>
              <p className="text-sm text-[#46332E]/70">Direct bank transfer (processing may take 1-2 business days</p>
            </div>
          </div>
        </RadioGroup>

        <div className="mt-6">
          <div className="flex items-center space-x-2">
            <Input
              type="checkbox"
              id="agreeToTerms"
              className="h-5 w-5 rounded text-[#46332E] focus:ring-0 focus:ring-offset-0 border-[#46332E]/30"
              {...register("payment.agreeToTerms")}
            />
            <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer">
              I agree to the{" "}
              <a href="#" className="text-[#46332E] underline underline-offset-2">
                terms and conditions
              </a>{" "}
              <span className="text-red-500">*</span>
            </Label>
          </div>
          {errors.payment?.agreeToTerms && (
            <p className="text-red-500 text-sm mt-1">{errors.payment.agreeToTerms.message}</p>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <span className="text-red-500">*</span> Required fields
      </div>
    </div>
  )
}
