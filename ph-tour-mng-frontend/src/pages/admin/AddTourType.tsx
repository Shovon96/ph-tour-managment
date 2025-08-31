import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useGetTourTypesQuery } from "@/redux/features/tour.api"
import Loader from "@/utils/Loader"
import { Trash } from "lucide-react"

export function AddTourType() {

    const { data, isLoading } = useGetTourTypesQuery(undefined)

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="max-w-4xl ml-0 md:ml-[10%] border border-primary p-4 rounded-md shadow-md shadow-primary">
            <Table>
                <TableCaption>A list of your tour types.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-primary text-lg font-bold">Name</TableHead>
                        <TableHead className="text-right text-primary text-lg font-bold">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.data?.map((item: { name: string }, index: any) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{item?.name}</TableCell>
                            <TableCell className="text-right">
                                <button className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"><Trash /></button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
