import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router"

export default function Verify() {

  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state)

  useEffect(() => {
    if (!email) {
      navigate("/")
    }
  }, [email])
  return (
    <div>
      <h1>Email Verification</h1>
      <p>Please check your email for a verification link.</p>
    </div>
  )
}
