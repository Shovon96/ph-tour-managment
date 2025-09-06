import { Button } from "@/components/ui/button";
import { useGetDivisionsQuery } from "@/redux/features/division.api";
import { useGetAllToursQuery, useGetTourTypesQuery } from "@/redux/features/tour.api";
import Loader from "@/utils/Loader";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

export default function TourDetails() {
    const { slug } = useParams();
    const navigate = useNavigate()

    const { data: tours, isLoading } = useGetAllToursQuery(undefined);

    const tourData = tours?.find((item) => item.slug === slug);

    const { data: divisionData } = useGetDivisionsQuery(
        { _id: tourData?.division, fields: "name" },
        { skip: !tourData }
    );

    const { data: tourTypeData } = useGetTourTypesQuery(
        { _id: tourData?.tourType, fields: "name" },
        { skip: !tourData }
    );
    console.log(tourTypeData?.data[0]?.name)

    if (isLoading) {
        return <Loader />;
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <div className="container mx-auto p-6">
            <Button onClick={handleGoBack} variant={"outline"} className="border-2 shadow-2xs cursor-pointer shadow-primary mb-4 rounded-full h-10 w-10">
                <ArrowLeft />
            </Button>
            {/* Header */}
            <div className="flex justify-between items-center  mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{tourData?.title}</h1>
                    <div className="flex gap-4 text-gray-600 mb-4">
                        <span>📍 {tourData?.location}</span>
                        <span>💰 From ${tourData?.costFrom}</span>
                        <span>👥 Max {tourData?.maxGuest} guests</span>
                    </div>
                </div>
                <div>
                    <Button asChild>
                        <Link to={`/booking/${tourData?._id}`}>Book Now</Link>
                    </Button>
                </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {tourData?.images?.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`${tourData?.title} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                    />
                ))}
            </div>

            {/* Tour Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Tour Details</h2>
                    <div className="space-y-2">
                        <p>
                            <strong>Dates:</strong>{" "}
                            {format(
                                new Date(
                                    tourData?.startDate ? tourData?.startDate : new Date()
                                ),
                                "PP"
                            )}{" "}
                            -{" "}
                            {format(
                                new Date(tourData?.endDate ? tourData?.endDate : new Date()),
                                "PP"
                            )}
                        </p>
                        <p>
                            <strong>Departure Location:</strong> {tourData?.departureLocation || "Dhaka"}
                        </p>
                        <p>
                            <strong>Arrival Location:</strong> {tourData?.arrivalLocation || tourData?.location}
                        </p>
                        <p>
                            <strong>Division:</strong> {divisionData?.[0]?.name}
                        </p>
                        <p>
                            <strong>Tour Type:</strong> {tourTypeData?.data[0]?.name}
                        </p>
                        <p>
                            <strong>Min Age:</strong> {tourData?.minAge} years
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <p className="text-muted-foreground">{tourData?.description}</p>
                </div>
            </div>

            {/* Amenities & Inclusions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                    <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                    <ul className="space-y-1">
                        {tourData?.amenities?.map((amenity, index) => (
                            <li key={index} className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                {amenity}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Included</h3>
                    <ul className="space-y-1">
                        {tourData?.included?.map((item, index) => (
                            <li key={index} className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Excluded</h3>
                    <ul className="space-y-1">
                        {tourData?.excluded?.map((item, index) => (
                            <li key={index} className="flex items-center">
                                <span className="text-red-500 mr-2">✗</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Tour Plan */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Tour Plan</h3>
                <ol className="space-y-2">
                    {tourData?.tourPlan?.map((plan, index) => (
                        <li key={index} className="flex">
                            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                                {index + 1}
                            </span>
                            {plan}
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
