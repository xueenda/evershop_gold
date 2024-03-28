import React from 'react';
import { _ } from '@evershop/evershop/src/lib/locale/translate';
import './MainBanner.scss';


export default function MainBanner() {
  // const text = _('Discount ${discount} For All Orders Over ${price}', {
  //   discount: '20%',
  //   price: '$2000'
  // });
  const text = 'Buy with Confidence: Your Trusted Source for Precious Metals'
  // return (<></>);
  return (
    <div className="main-banner-home flex items-center">
      <div className="container slogan-container">
        {/* <div /> */}
        <div className="text-center md:text-center px-2 py-1 slogan">
          <h2 className="h2 ">Buy with Confidence</h2>
          <p>
          Your Trusted Source for Precious Metals
          </p>
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1
};
