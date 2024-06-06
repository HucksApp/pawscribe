import React from 'react'
import Alert  from '@mui/material/Alert';


const Alertcomp = ({alertType, message}) => {
  const alertTypes={success:"success",info:"info", warning:"warning",error:"error"}
  return (
    <div>
        <Alert severity={alertTypes[alertType]}>{message}</Alert>
    </div>
  )
}

export default Alertcomp 