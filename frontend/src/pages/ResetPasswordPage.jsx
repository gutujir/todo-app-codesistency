import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/enter-reset-code");
  }, [navigate]);
  return null;
};
export default ResetPasswordPage;
