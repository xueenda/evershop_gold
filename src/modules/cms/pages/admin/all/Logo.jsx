import PropTypes from "prop-types";
import React from "react";
import "./Logo.scss";

export default function Logo({ dashboardUrl }) {
  return (
    <div className="logo items-center">
      <a href="/" className="logo-icon">
        <span className="bmo-logo-font">BMO </span>
        <img
          src="/images/bmo_logo.jpg"
          alt="BMO Capital Markets"
          width="40"
          height="40"
          style={{display: "inline-block"}}
        />
        <span className="bmo-logo-font"> Precious Metals</span>
      </a>

      {/* <a href={dashboardUrl} className="flex items-end">
        <span className="font-bold">BMO Precious Metals</span>
      </a> */}
    </div>
  );
}

Logo.propTypes = {
  dashboardUrl: PropTypes.string.isRequired,
};

export const layout = {
  areaId: "header",
  sortOrder: 10,
};

export const query = `
  query Query {
    dashboardUrl: url(routeId:"dashboard")
  }
`;
