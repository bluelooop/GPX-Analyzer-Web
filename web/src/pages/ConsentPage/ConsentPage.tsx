import React, { useEffect, useState } from 'react';
import { useQueryParams } from '../../hooks.ts';

const ConsentPage: React.FC = () => {
  const searchParams = useQueryParams();
  const [consentError, setConsentError] = useState<string>('');

  useEffect(() => {
    debugger;
    const authenticated = searchParams['auth'];
    if (authenticated && authenticated === 'true') {
      window.close();
    }

    setConsentError(
      'Something went wrong or you cancel the consent request. Please try again later.',
    );

    setTimeout(() => {
      window.close();
    }, 3000);
  }, [searchParams]);

  return <div>{consentError && consentError}</div>;
};

export default ConsentPage;
