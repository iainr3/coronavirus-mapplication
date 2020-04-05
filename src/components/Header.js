import React from "react";
// import { Link } from "gatsby";
import { FaGithub } from "react-icons/fa";

import Container from "components/Container";

const Header = () => {
  return (
    <header>
      <Container type="content">
        <p>COVID-19 Mapplication</p>
        <ul>
          <li>
            <a href="https://github.com/iainr3">
              <FaGithub /> GitHub
            </a>
          </li>
          {/* <li>
            <Link to="/page-2/">Page 2</Link>
          </li> */}
        </ul>
      </Container>
    </header>
  );
};

export default Header;
