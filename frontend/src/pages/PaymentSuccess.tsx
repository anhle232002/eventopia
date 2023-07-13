import { usePaymentSession } from "@/hooks/usePaymentSession";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const { data } = usePaymentSession(sessionId!);

  if (!sessionId || sessionId === "") {
    navigate("/");

    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p className="text-lg mb-6">Your ticket purchase was successful.</p>
        <p className="text-lg mb-6">
          We send email contains your E-Ticket to your email at{" "}
          <strong>{data.metadata.customerEmail}</strong>
        </p>
        <p className="text-lg mb-6">
          Please check your email for the ticket details and confirmation.
        </p>
        <p className="text-lg mb-6">
          If you have any questions or need further assistance, please feel free to contact us at
          <strong className="ml-2">eventopia@gmail.com</strong>
        </p>
        <Link to="/">
          <button className="btn btn-primary">Return to home page</button>
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;
