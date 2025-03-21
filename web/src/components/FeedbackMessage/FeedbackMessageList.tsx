import { Message } from 'semantic-ui-react';
import React from 'react';

interface FeedbackMessageListProps {
  visible?: boolean;
  error: boolean;
  title: string;
  messages: string[];
}

const FeedbackMessageList: React.FC<FeedbackMessageListProps> = ({
  visible,
  error,
  title,
  messages,
}) => {
  return <Message visible={visible} error={error} header={title} list={messages} />;
};

export default FeedbackMessageList;
