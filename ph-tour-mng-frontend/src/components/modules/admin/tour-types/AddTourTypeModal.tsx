import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAddTourTypeMutation } from "@/redux/features/tour.api"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function AddTourTypeModal() {

    const [open, setOpen] = useState(false)
    const form = useForm()
    const [addTourType] = useAddTourTypeMutation()

    const onSubmit = async (data: any) => {
        const res = await addTourType({ name: data.name }).unwrap();
        if (res.success) {
            toast.success("Tour Type Added Successfully");
            form.reset();
            setOpen(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <Button className="bg-primary border text-foreground px-4 py-2 rounded-md hover:bg-transparent hover:border-primary hover:border hover:rounded-md cursor-pointer">Add Tour Type</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Tour Type</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form id="add-tour-type-form" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tour Type</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                required
                                                placeholder="Hiking Tour..."
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button form="add-tour-type-form" type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
