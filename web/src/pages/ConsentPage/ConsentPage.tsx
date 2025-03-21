import React, { useEffect, useState } from 'react';
import { useQueryParams } from '../../hooks.ts';
import { setCookie } from '../../utils.ts';

const ConsentPage: React.FC = () => {
  const searchParams = useQueryParams();
  const [consentError, setConsentError] = useState<string>('');

  useEffect(() => {
    const authenticatedUntil = searchParams['auth'];
    if (authenticatedUntil) {
      const authenticatedUntilNumber = parseInt(authenticatedUntil, 10);
      if (authenticatedUntilNumber) {
        setCookie('_rpa', '1', authenticatedUntilNumber);
        window.close();
      }
      setConsentError(
        'Something went wrong or you cancel the consent request. Please try again later.',
      );

      setTimeout(() => {
        window.close();
      }, 3000);
    }
  }, [searchParams]);

  return <div>{consentError && consentError}</div>;
};

export default ConsentPage;
