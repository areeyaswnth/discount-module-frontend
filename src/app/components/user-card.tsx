import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Box,
} from '@mui/material';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  points?: number;
}

interface UserCardProps {
  user: User;
  onSelect: (user: User) => void;
  isSelected?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onSelect, isSelected }) => {
  return (
    <Card
      sx={{
        maxWidth: 150,
        boxShadow: isSelected ? 6 : 3,
        borderRadius: 3,
        transition: '0.3s',
        border: isSelected ? '2px solid white' : 'none',
        '&:hover': {
          boxShadow: 6,
        },
        padding: 1,
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={1}
      >
        <Avatar sx={{ width: 40, height: 40 }} /> {/* ลดขนาดของ Avatar */}
      </Box>
      <CardContent sx={{ padding: 1 }}>
        <Typography
          variant="body2"
          component="div"
          align="center"
          gutterBottom
          sx={{ fontSize: '0.85rem' }}
        >
          {user.firstName} {user.lastName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ fontSize: '0.75rem' }}
          gutterBottom
        >
          {user.email}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ fontSize: '0.75rem' }}
        >
          Points: {user.points ?? 0}
        </Typography>
        <Button
          variant={isSelected ? 'outlined' : 'contained'}
          color="primary"
          fullWidth
          sx={{ mt: 1, fontSize: '0.75rem' }} 
          onClick={() => onSelect(user)}
        >
          {isSelected ? 'Selected' : 'Select User'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserCard;
