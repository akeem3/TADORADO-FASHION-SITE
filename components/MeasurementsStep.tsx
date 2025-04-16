"use client"

import type React from "react"
import { useFormContext } from "react-hook-form"
import { z } from "zod"

// Define the schema for measurements to ensure type safety
const measurementsSchema = z.object({
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
})

type MeasurementsData = z.infer<typeof measurementsSchema>

// Define the form data type that includes measurements
type FormData = {
  measurements: MeasurementsData
  [key: string]: any
}

interface MeasurementsStepProps {
  onNext: () => void
}

const MeasurementsStep: React.FC<MeasurementsStepProps> = ({ onNext }) => {
  const { register, handleSubmit, setValue } = useFormContext<FormData>()

  // Provide immediate feedback when a field is filled
  const handleInputChange = (field: string, value: string) => {
    setValue(`measurements.${field}` as any, value, { shouldValidate: true })
  }

  const onSubmit = () => {
    onNext()
  }

  return (
    <div>
      <h2>Measurements</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="height">Height (cm):</label>
          <input
            type="number"
            id="height"
            {...register("measurements.height")}
            onChange={(e) => handleInputChange("height", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="weight">Weight (kg):</label>
          <input
            type="number"
            id="weight"
            {...register("measurements.weight" as any)}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Next</button>
        </div>
      </form>
    </div>
  )
}

export default MeasurementsStep
