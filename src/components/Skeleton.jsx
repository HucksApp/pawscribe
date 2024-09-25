import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
const SkeletonLoading = () => {
  return (
    <div className="listcontainer">
      <Stack
        sx={{
          height: '40vh',
          width: 1000,
          boxSizing: 'border-box',
          padding: '30px',
        }}
        spacing={1}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex' }}>
            <Skeleton variant="circular" width={30} height={30} />
            <Skeleton variant="text" width={70} sx={{ fontSize: '1rem' }} />
          </div>

          <div
            style={{ display: 'flex', paddingLeft: '5%', paddingRight: '5%' }}
          >
            <Skeleton variant="circular" width={30} height={30} />
            <Skeleton variant="text" width={70} sx={{ fontSize: '1rem' }} />
          </div>
          <Skeleton variant="text" width={'40%'} sx={{ fontSize: '1rem' }} />
        </div>

        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex' }}>
            <Skeleton variant="circular" width={30} height={30} />
            <Skeleton variant="text" width={70} sx={{ fontSize: '1rem' }} />
          </div>

          <div
            style={{ display: 'flex', paddingLeft: '5%', paddingRight: '5%' }}
          >
            <Skeleton variant="circular" width={30} height={30} />
            <Skeleton variant="text" width={70} sx={{ fontSize: '1rem' }} />
          </div>
          <Skeleton variant="text" width={'40%'} sx={{ fontSize: '1rem' }} />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Skeleton variant="circular" width={50} height={50} />
          <Skeleton
            variant="rounded"
            width={'50%'}
            height={'16vh'}
            sx={{ marginLeft: '10px', marginTop: '10px' }}
          />
        </div>
      </Stack>
    </div>
  );
};

export default SkeletonLoading;
