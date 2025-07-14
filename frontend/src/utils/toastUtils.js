import { toast } from "react-toastify";

export function showToast(message, type = "info") {
  switch (type) {
    case "success":
      toast.success(message, { autoClose: 3000 });
      break;
    case "error":
      toast.error(message, { autoClose: 5000 });
      break;
    case "info":
    default:
      toast.info(message, { autoClose: 3000 });
      break;
  }
}
