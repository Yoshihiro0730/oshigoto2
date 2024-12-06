import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface LoadProps {
  title: string
}

const Loading: React.FC<LoadProps> = ({title}) => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className="my-4">
          {title}
      </div>
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </div>
  );
}

export default Loading