import { Alert, AlertIcon, AlertTitle, Box, CloseButton, VStack } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

import { NotificationType } from '@/types';
import { removeNotificationByIndex } from '@/utils';

interface NotificationAlertProps {
  notifications: NotificationType[];
  setNotifications: Dispatch<SetStateAction<NotificationType[]>>;
}
export const NotificationAlert = ({ notifications, setNotifications }: NotificationAlertProps) => {
  const removeNotification = (index: number) => {
    setNotifications(removeNotificationByIndex(notifications, index));
  };

  return (
    notifications.length > 0 && (
      <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
        {notifications.map((notification, index) => (
          <Alert key={index} status="info" variant="solid" width="auto">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
            </Box>
            <CloseButton onClick={() => removeNotification(index)} />
          </Alert>
        ))}
      </VStack>
    )
  );
};
