import { useTheme } from "@/providers/Theme.Provider";

export default function Logo() {
    return (
        <div>
            <img
                className="h-8"
                src={
                    useTheme().theme === "dark"
                        ? "https://res.cloudinary.com/dpfdsilzj/image/upload/v1756037749/logoipsum-custom-logo_1_lo7sup.svg"
                        : "https://res.cloudinary.com/dpfdsilzj/image/upload/v1755986050/logoipsum-custom-logo_rncabj.svg"
                }
                alt="Logo"
            />
        </div>
    )
}


/** Logo colors
 * - Logogram green: #4BAC3E
 * - Logogram dark green: #33A343
 * - Logotype black: #111111
 * #4bac3e
 * #33a343
 */