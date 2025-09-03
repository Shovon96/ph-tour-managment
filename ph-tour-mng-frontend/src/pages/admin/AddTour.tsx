import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format, formatISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetDivisionsQuery } from "@/redux/features/division.api";
import { useAddTourMutation, useGetTourTypesQuery } from "@/redux/features/tour.api";
import { useFieldArray, useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { CalendarIcon, CircleX, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import MultipleImageUploader from "@/components/MultipleImageUploader";
import { useState } from "react";
import type { FileMetadata } from "@/hooks/use-file-upload";
import z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  costFrom: z.number().min(1, "Cost is required"),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  departureLocation: z.string().min(1, "Departure location is required"),
  arrivalLocation: z.string().min(1, "Arrival location is required"),
  included: z.array(z.object({ value: z.string() })),
  excluded: z.array(z.object({ value: z.string() })),
  amenities: z.array(z.object({ value: z.string() })),
  tourPlan: z.array(z.object({ value: z.string() })),
  maxGuest: z.number().min(1, "Max guest is required"),
  minAge: z.number().min(1, "Minimum age is required"),
  division: z.string().min(1, "Division is required"),
  tourType: z.string().min(1, "Tour type is required"),
});

export default function AddTour() {

  const [images, setImages] = useState<(File | FileMetadata)[] | []>([])

  const { data: tourTypeData, isLoading: isLoadingTourTypes } = useGetTourTypesQuery(undefined);
  const { data: divisionData, isLoading: isLoadingDivisions } = useGetDivisionsQuery(undefined);
  const [addTour] = useAddTourMutation();

  const divisionOptions = divisionData?.map((division: { _id: string, name: string }) => ({
    value: division._id,
    label: division.name
  }));

  const tourTypeOptions = tourTypeData?.data?.map((tourType: { _id: string, name: string }) => ({
    value: tourType._id,
    label: tourType.name
  }));

  // console.log(divisionOptions)
  // console.log(tourTypeOptions)

  // Default Values Set in Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      costFrom: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
      departureLocation: "",
      arrivalLocation: "",
      included: [{ value: "" }],
      excluded: [{ value: "" }],
      amenities: [{ value: "" }],
      tourPlan: [{ value: "" }],
      maxGuest: 0,
      minAge: 0,
      division: "",
      tourType: "",
    },
  });

  // Included
  const { fields: includedFields,
    append: appendIncluded,
    remove: removeIncluded
  } = useFieldArray({
    control: form.control,
    name: "included"
  })

  // Excluded
  const { fields: excludedFields,
    append: appendExcluded,
    remove: removeExcluded
  } = useFieldArray({
    control: form.control,
    name: "excluded"
  })

  // Amenities
  const { fields: amenitiesFields,
    append: appendAmenities,
    remove: removeAmenities
  } = useFieldArray({
    control: form.control,
    name: "amenities"
  })

  // Tour Plan
  const { fields: tourPlanFields,
    append: appendTourPlan,
    remove: removeTourPlan
  } = useFieldArray({
    control: form.control,
    name: "tourPlan"
  })

  // Handle Form Submission
  const handleSubmit: SubmitHandler<FieldValues> = async (data) => {
    const tourData = {
      ...data,
      startDate: formatISO(data.startDate),
      endDate: formatISO(data.endDate),
      included: data?.included?.map((item: { value: string }) => item.value),
      excluded: data?.excluded?.map((item: { value: string }) => item.value),
      amenities: data?.amenities?.map((item: { value: string }) => item.value),
      tourPlan: data?.tourPlan?.map((item: { value: string }) => item.value),
    }
    // console.log(tourData)
    const formData = new FormData();

    formData.append("data", JSON.stringify(tourData));
    images.forEach((image) => formData.append("files", image as File));

    try {
      const addingToast = toast.loading("Adding Tour...");
      const res = await addTour(formData).unwrap();
      if (res.success) {
        toast.success("Tour Added Successfully!", { id: addingToast });
        form.reset();
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="w-full max-w-4xl mx-auto px-5 mt-8 border border-primary p-4 rounded-md shadow-md shadow-primary">
      <Card>
        <CardHeader>
          <CardTitle>Add New Tour</CardTitle>
          <CardDescription>Add a new tour to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="add-tour-form"
              className="space-y-5"
              onSubmit={form.handleSubmit(handleSubmit)}
            >

              {/* Name/Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location and Cost */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costFrom"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <Input type="number" {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Departure and Arrival Locations */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="departureLocation"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Departure Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arrivalLocation"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Arrival Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Division and Tour Type */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem className="flex-1 ">
                      <FormLabel>Division</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoadingDivisions}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {divisionOptions?.map(
                            (item: { label: string; value: string }) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tourType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Tour Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoadingTourTypes}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tourTypeOptions?.map(
                            (option: { value: string; label: string }) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Max Guests and Minimum Age */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="maxGuest"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Max Guest</FormLabel>
                      <FormControl>
                        <Input type="number" {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minAge"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minimum Age</FormLabel>
                      <FormControl>
                        <Input type="number" {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Start Date and End Date */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                              new Date(
                                new Date().setDate(new Date().getDate() - 1)
                              )
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                              new Date(
                                new Date().setDate(new Date().getDate() - 1)
                              )
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description and Upload Images */}
              <div className="flex gap-5 items-stretch">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="h-[205px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex-1 mt-5">
                  <MultipleImageUploader onChange={setImages} />
                </div>
              </div>

              <div className="border-t border-muted w-full "></div>

              {/* Included Fields */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Included</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => appendIncluded({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>

                <div className="flex flex-wrap">
                  {includedFields.map((item, index) => {
                    const count = includedFields.length

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "relative px-2 mt-2",
                          // width dynamic based on count
                          count === 1 && "w-full",
                          count === 2 && "w-1/2",
                          count === 3 && "w-1/3",
                          count >= 4 && "w-1/4",
                          // responsive tweak
                          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        )}
                      >
                        <FormField
                          control={form.control}
                          name={`included.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} className="w-full" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          onClick={() => removeIncluded(index)}
                          variant="destructive"
                          size="icon"
                          type="button"
                          className="absolute right-2 top-2 h-6 w-6 text-foreground bg-transparent dark:bg-accent hover:bg-border"
                        >
                          <CircleX />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Excluded Fields */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Excluded</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => appendExcluded({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>

                <div className="flex flex-wrap">
                  {excludedFields.map((item, index) => {
                    const count = excludedFields.length

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "relative px-2 mt-2",
                          // width dynamic based on count
                          count === 1 && "w-full",
                          count === 2 && "w-1/2",
                          count === 3 && "w-1/3",
                          count >= 4 && "w-1/4",
                          // responsive tweak
                          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        )}
                      >
                        <FormField
                          control={form.control}
                          name={`excluded.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} className="w-full" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          onClick={() => removeExcluded(index)}
                          variant="destructive"
                          size="icon"
                          type="button"
                          className="absolute right-2 top-2 h-6 w-6 text-foreground bg-transparent dark:bg-accent hover:bg-border"
                        >
                          <CircleX />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Amenities</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => appendAmenities({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>

                <div className="flex flex-wrap">
                  {amenitiesFields.map((item, index) => {
                    const count = amenitiesFields.length

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "relative px-2 mt-2",
                          // width dynamic based on count
                          count === 1 && "w-full",
                          count === 2 && "w-1/2",
                          count === 3 && "w-1/3",
                          count >= 4 && "w-1/4",
                          // responsive tweak
                          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        )}
                      >
                        <FormField
                          control={form.control}
                          name={`amenities.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} className="w-full" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          onClick={() => removeAmenities(index)}
                          variant="destructive"
                          size="icon"
                          type="button"
                          className="absolute right-2 top-2 h-6 w-6 text-foreground bg-transparent dark:bg-accent hover:bg-border"
                        >
                          <CircleX />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Tour Plan */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Tour Plan</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => appendTourPlan({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>

                <div className="flex flex-wrap">
                  {tourPlanFields.map((item, index) => {
                    const count = tourPlanFields.length

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "relative px-2 mt-2",
                          // width dynamic based on count
                          count === 1 && "w-full",
                          count === 2 && "w-1/2",
                          count === 3 && "w-1/3",
                          count >= 4 && "w-1/4",
                          // responsive tweak
                          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        )}
                      >
                        <FormField
                          control={form.control}
                          name={`tourPlan.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} className="w-full" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          onClick={() => removeTourPlan(index)}
                          variant="destructive"
                          size="icon"
                          type="button"
                          className="absolute right-2 top-2 h-6 w-6 text-foreground bg-transparent dark:bg-accent hover:bg-border"
                        >
                          <CircleX />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>

            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" form="add-tour-form">
            Create Tour
          </Button>
        </CardFooter>
      </Card>
    </div >
  );
}