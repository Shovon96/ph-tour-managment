import { DeleteConfirmModal } from "@/components/DeleteConfirmModal"
import { AddDivisionModal } from "@/components/modules/admin/division/AddDivisionModal"
import { AddTourTypeModal } from "@/components/modules/admin/tour-types/AddTourTypeModal"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useGetDivisionsQuery } from "@/redux/features/division.api"
import Loader from "@/utils/Loader"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

export function AddDivision() {

    const { data, isLoading } = useGetDivisionsQuery(undefined)

    if (isLoading) {
        return <Loader />
    }

    // const handleDeleteDivision = async (id: string) => {
    //     const toastId = toast.loading("Deleting Division...")
    //     try {
    //         const res = await deleteTourType(id).unwrap()
    //         if (res.success) {
    //             toast.success("Tour Type Deleted", { id: toastId })
    //         }
    //     } catch (error: any) {
    //         console.log(error.message)
    //     }
    // }

    return (
        <div className="max-w-4xl ml-0 md:ml-[10%]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Total Divisions: {data?.length}</h2>
                <AddDivisionModal />
            </div>
            <div className=" border border-primary p-4 rounded-md shadow-md shadow-primary">
                <Table>
                    <TableCaption>A list of your divisions.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] text-primary text-md font-bold">Name</TableHead>
                            <TableHead className="text-right text-primary text-md font-bold">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((item: { name: string, _id: string }) => (
                            <TableRow key={item._id}>
                                <TableCell className="font-medium">{item?.name}</TableCell>
                                <TableCell className="text-right">
                                    <Trash2 />
                                    {/* <DeleteConfirmModal
                                        onConfirm={() => handleDeleteDivision(item._id)}>
                                    </DeleteConfirmModal> */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
