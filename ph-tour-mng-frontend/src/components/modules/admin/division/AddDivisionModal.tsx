import SingleImageUploader from "@/components/SingleImageUploader"
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
import { Textarea } from "@/components/ui/textarea"
import { useAddDivisionMutation } from "@/redux/features/division.api"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function AddDivisionModal() {

    const [image, setImage] = useState<File | null>(null)
    const [open, setOpen] = useState(false);
    const [addDivision] = useAddDivisionMutation();

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
        }
    })

    const onSubmit = async (data: any) => {
        const formData = new FormData();

        formData.append("data", JSON.stringify(data));
        formData.append("file", image as File);

        // console.log(formData.get("data"));
        // console.log(formData.get("file"));

        try {
            const addingToast = toast.loading("Adding Division...");
            const res = await addDivision(formData).unwrap();
            if (res.success) {
                toast.success("Tour Type Added Successfully", { id: addingToast });
                form.reset();
                setOpen(false);
            }
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Division</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Division</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form id="add-division-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Division Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            required
                                            placeholder="Cox's Bazar"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="my-4">
                                    <FormLabel>Division Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            required
                                            placeholder="Lorem Ipsum..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SingleImageUploader onChange={setImage} />
                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button disabled={!image} form="add-division-form" type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
