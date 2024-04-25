import PropTypes from 'prop-types';
import React from 'react';
import { toast } from 'react-toastify';
import Area from '@components/common/Area';


export default function Layout({ logoutUrl }) {
  const logout = async (e) => {
    e.preventDefault();
    const respone = await fetch(logoutUrl, {
      method: 'GET'
    });
    const data = await respone.json();
    if (data.error) {
      toast.error(data.error.message);
    } else {
      window.location.href = '/';
    }
  };
  return (
    <div>
      <div className="page-width mt-3 grid grid-cols-1 gap-3">
        <div className="col-span-1">
          <Area id="accountPageContent" noOuter />
        </div>
      </div>
    </div>
  );
}

Layout.propTypes = {
  logoutUrl: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

export const query = `
  query Query {
    logoutUrl: url(routeId: "customerLogoutJson")
  }
`;
