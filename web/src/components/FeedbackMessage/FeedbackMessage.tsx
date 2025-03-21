import { Message, MessageHeader } from 'semantic-ui-react';
import React from 'react';

interface FeedbackMessageProps {
  visible?: boolean;
  error: boolean;
  title: string;
  message: string;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ visible, error, title, message }) => {
  return (
    <Message visible={visible} error={error}>
      <MessageHeader>{title}</MessageHeader>
      <p>{message}</p>
    </Message>
  );
};

export default FeedbackMessage;
