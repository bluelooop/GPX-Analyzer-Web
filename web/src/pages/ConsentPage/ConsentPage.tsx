import React, { useEffect, useState } from 'react';
import { useQueryParams } from '../../hooks.ts';
import { setCookie } from '../../utils.ts';

const ConsentPage: React.FC = () => {
  const searchParams = useQueryParams();
  const [consentError, setConsentError] = useState<string>('');

  useEffect(() => {
    const authenticated = searchParams['auth'];
    if (authenticated && authenticated === 'true') {
      const code = searchParams['code'];
      const expires = searchParams['expires'];
      const expiresNumber = parseInt(expires, 10);
      console.log(code, expiresNumber);
      if (code && expiresNumber) {
        setCookie('_rpa', '1', expiresNumber);
        setCookie('_rpat', code, expiresNumber, true, location.protocol === 'https:');
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
