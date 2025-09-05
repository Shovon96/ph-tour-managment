import { DeleteConfirmModal } from "@/components/DeleteConfirmModal"
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
import { useDeleteTourTypeMutation, useGetTourTypesQuery } from "@/redux/features/tour.api"
import Loader from "@/utils/Loader"
import { toast } from "sonner"
import { useState } from "react"
import PaginationComponent from "@/utils/Pagination"

export function AddTourType() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number | null>(null);

    const { data, isLoading } = useGetTourTypesQuery({ page: currentPage, limit })
    const [deleteTourType] = useDeleteTourTypeMutation();

    if (isLoading) {
        return <Loader />
    }

    const handleDeleteTourType = async (id: string) => {
        const toastId = toast.loading("Deleting Tour Type...")
        try {
            const res = await deleteTourType(id).unwrap()
            if (res.success) {
                toast.success("Tour Type Deleted", { id: toastId })
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const totalPage = data?.meta?.totalPage || 1;

    return (
        <div className="max-w-4xl ml-0 md:ml-[10%]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Total Tour Types: {data?.data?.length}</h2>
                <AddTourTypeModal />
            </div>
            <div className=" border border-primary p-4 rounded-md shadow-md shadow-primary">
                <Table>
                    <TableCaption>A list of your tour types.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] text-primary text-md font-bold">Name</TableHead>
                            <TableHead className="text-right text-primary text-md font-bold">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.data?.map((item: { name: string, _id: string }) => (
                            <TableRow key={item._id}>
                                <TableCell className="font-medium">{item?.name}</TableCell>
                                <TableCell className="text-right">
                                    <DeleteConfirmModal
                                        onConfirm={() => handleDeleteTourType(item._id)}>
                                    </DeleteConfirmModal>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <PaginationComponent
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setLimit={setLimit}
                totalPage={totalPage}
            />
        </div>
    )
}
