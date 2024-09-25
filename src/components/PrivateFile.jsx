import React,{useState, useEffect} from 'react'
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const PrivateFile = ({file}) => {
  
  let privilegeView;
  if( file && file.private == true){
      privilegeView = (
                  <div className="priviledge">
                    <LockIcon color="primary"/>
                    <div className="menuitem">On Private</div>
                  </div>  
      );
  }
  else{
    privilegeView = (
      <div className="priviledge">
        <LockOpenIcon color="primary"/>
        <div className="menuitem">On Public</div>
      </div>  
);
  }

  return (
    <div className='private'>
      <PrivateFile/>
    </div>
  )
}

export default PrivateFile