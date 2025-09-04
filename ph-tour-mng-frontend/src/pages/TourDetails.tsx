import { Button } from "@/components/ui/button";
import { useGetDivisionsQuery } from "@/redux/features/division.api";
import { useGetAllToursQuery } from "@/redux/features/tour.api";
import { format } from "date-fns";
import { Link, useParams } from "react-router";

export default function TourDetails() {
    const { slug } = useParams();
    const { data, isLoading } = useGetAllToursQuery({ slug: slug });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    const tourData = data?.data?.filter((item: any) => item.slug === slug);
    const { data: divisionData } = useGetDivisionsQuery(
        {
            _id: tourData[0]?.division,
            fields: "name",
        },
        {
            skip: !tourData,
        }
    );

    // console.log(tourData);

    // const tourData = data?.[0];



    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center  mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{tourData[0]?.title}</h1>
                    <div className="flex gap-4 text-gray-600 mb-4">
                        <span>📍 {tourData[0]?.location}</span>
                        <span>💰 From ${tourData[0]?.costFrom}</span>
                        <span>👥 Max {tourData[0]?.maxGuest} guests</span>
                    </div>
                </div>
                <div>
                    <Button asChild>
                        <Link to={`/booking/${tourData[0]?._id}`}>Book Now</Link>
                    </Button>
                </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {tourData[0]?.images?.map((image: string, index: number) => (
                    <img
                        key={index}
                        src={image}
                        alt={`${tourData[0]?.title} ${index + 1}`}
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
                                    tourData[0]?.startDate ? tourData[0]?.startDate : new Date()
                                ),
                                "PP"
                            )}{" "}
                            -{" "}
                            {format(
                                new Date(tourData[0]?.endDate ? tourData[0]?.endDate : new Date()),
                                "PP"
                            )}
                        </p>
                        <p>
                            <strong>Departure Location:</strong> {tourData[0]?.departureLocation}
                        </p>
                        <p>
                            <strong>Arrival Location:</strong> {tourData[0]?.arrivalLocation}
                        </p>
                        <p>
                            <strong>Division:</strong> {divisionData?.[0]?.name}
                        </p>
                        <p>
                            <strong>Tour Type:</strong> {tourData[0]?.tourType}
                        </p>
                        <p>
                            <strong>Min Age:</strong> {tourData[0]?.minAge} years
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <p className="text-muted-foreground">{tourData[0]?.description}</p>
                </div>
            </div>

            {/* Amenities & Inclusions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                    <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                    <ul className="space-y-1">
                        {tourData[0]?.amenities?.map((amenity: string, index: number) => (
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
                        {tourData[0]?.included?.map((item: string, index: number) => (
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
                        {tourData[0]?.excluded?.map((item: string, index: number) => (
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
                    {tourData[0]?.tourPlan?.map((plan: string, index: number) => (
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

//  const tourData: ITourPackage = {
//    _id: "1",
//    title: "Magical Santorini Island Adventure",
//    description:
//      "Experience the breathtaking beauty of Santorini with its iconic white-washed buildings, stunning sunsets, and crystal-clear waters. This 5-day adventure includes visits to traditional villages, wine tasting, and relaxation on unique volcanic beaches.",
//    location: "Santorini, Greece",
//    images: [
//      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&h=300&fit=crop",
//      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=500&h=300&fit=crop",
//      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
//    ],
//    costFrom: 1299,
//    maxGuest: 12,
//    startDate: "2024-06-15",
//    endDate: "2024-06-20",
//    departureLocation: "Athens International Airport",
//    arrivalLocation: "Santorini Airport",
//    division: "Cyclades",
//    tourType: "Cultural & Leisure",
//    minAge: 18,
//    amenities: [
//      "Free WiFi",
//      "Air Conditioning",
//      "Swimming Pool Access",
//      "24/7 Concierge",
//      "Spa Services",
//    ],
//    included: [
//      "Round-trip flights",
//      "4-star hotel accommodation",
//      "Daily breakfast",
//      "Guided tours",
//      "Wine tasting experience",
//      "Sunset cruise",
//    ],
//    excluded: [
//      "Travel insurance",
//      "Lunch and dinner",
//      "Personal expenses",
//      "Optional activities",
//      "Tips and gratuities",
//    ],
//    tourPlan: [
//      "Arrival in Santorini and check-in to hotel",
//      "Explore Fira town and enjoy welcome dinner",
//      "Visit Oia village and watch famous sunset",
//      "Wine tasting tour in traditional vineyards",
//      "Relax at Red Beach and visit Akrotiri ruins",
//      "Sunset sailing cruise and departure",
//    ],
//    slug: "magical-santorini-island-adventure",
//    createdAt: "2024-01-15T10:30:00.000Z",
//    updatedAt: "2024-02-10T14:45:00.000Z",
//  };