import React, { useEffect, useState } from 'react';
import { useQueryParams } from '../../hooks.ts';
import { setCookie } from '../../utils.ts';

const ConsentPage: React.FC = () => {
  const searchParams = useQueryParams();
  const [consentError, setConsentError] = useState<string>('');

  useEffect(() => {
    debugger;
    const authenticated = searchParams['auth'];
    if (authenticated && Boolean(authenticated)) {
      const expires = searchParams['expires'];
      const expiresNumber = parseInt(expires, 10);
      if (expiresNumber) {
        setCookie('_rpa', '1', expiresNumber);
        window.close();
      }
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
