// Copyright 2020 UseTech authors & contributors

import React from 'react';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message/Message';
import './MessageWrapper.scss';

export interface MessageInterface {
  negative?: boolean;
  success?: boolean;
  warning?: boolean;
  info?: boolean;
  messageText: string;
  messageDescription?: string;
}

interface Props {
  messages: Array<MessageInterface>;
}

function MessageWrapper({ messages }: Props): React.ReactElement<Props> {
  return (
    <div className='messages-wrapper'>
      { (messages && messages.length > 0) && messages.map((message: MessageInterface) => (
        <Message key={message.messageText} success={message.success} negative={message.negative} warning={message.warning} info={message.info}>
          {message.messageText &&
          <Message.Header>{message.messageText}</Message.Header>
          }
          { message.messageDescription &&
          <p>{message.messageDescription}</p>
          }
        </Message>
      ))}
    </div>
  )
}

export default React.memo(MessageWrapper);
