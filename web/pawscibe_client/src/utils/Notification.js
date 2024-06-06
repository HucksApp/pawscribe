import {toast,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Notify = ({message,type}) => {
   console.log(message,"hereee")
  const config = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    }
    switch(type) {
      case "success":
        toast.success(message,config);
        break;
      case "error":
        toast.error(message,config);
        break;
        case "warn":
          toast.warn(message,config);
          break;
          case "info":
            toast.info(message,config);
            break;
      default:
        toast(message,config);
    }
}
  
