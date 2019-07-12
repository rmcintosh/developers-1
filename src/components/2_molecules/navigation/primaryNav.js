import React from "react";
import { StaticQuery, graphql } from "gatsby";

import SubMenus from "./subMenus";
import WhyPrimaryNav from "./whyPrimaryNav";
import WhyServicesNav from "./whyServicesNav";

import ProductsFeatured from "./productsFeatured";

import Caret from "../../../images/svgs/angle-down-regular.svg";
import SearchIcon from "../../../images/svgs/search-solid.svg";

const _ = require("lodash");

class MainSiteNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subMenuOpen: false
    };
  }

  isDescendant(parent, child) {
    var node = child.parentNode;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  componentDidMount() {
    const subMenus = document.getElementById("sub-menus");
    const otherMenus = document.getElementsByClassName("sub-menu");
    const header = document.getElementById("header");

    const hideAll = () => {
      Object.keys(otherMenus).map(e => {
        const om = otherMenus[e];
        return (
          om.classList.add("visually-hidden") +
          document.body.classList.remove("oh")
        );
      });
    };

    header.addEventListener("click", e => {
      !e.target.classList.contains("primary-nav__link") &&
        !this.isDescendant(subMenus, e.target) &&
        hideAll();
    });
  }

  openSubMenu = e => {
    const otherMenus = document.getElementsByClassName("sub-menu");
    const target = e.target.getAttribute("data-submenu");
    const subMenuContainer = document.getElementById(target);

    const hideAll = () => {
      Object.keys(otherMenus).map(e => {
        const om = otherMenus[e];
        return (
          om !== subMenuContainer &&
          om.classList.add("visually-hidden") +
            document.body.classList.remove("oh")
        );
      });
    };

    hideAll();

    if (subMenuContainer !== null) {
      if (!subMenuContainer.classList.contains("visually-hidden")) {
        subMenuContainer.classList.add("visually-hidden");
        document.body.classList.remove("oh");
      } else {
        subMenuContainer.classList.remove("visually-hidden");
        document.body.classList.add("oh");
      }
    }
  };

  render() {
    const data = this.props.data;
    const { subMenuOpen } = this.state;
    return (
      <>
        <nav
          id="main-menu"
          role="menu"
          className="primary-nav"
          aria-expanded="false"
        >
          {data.allHeaderPrimary.edges.map((link, i) => {
            const node = link.node;
            return (
              <React.Fragment key={i}>
                <a
                  key={node.id}
                  href={node.url ? node.url : null}
                  className={`header__link primary-nav__link ${
                    node.toggle ? "dropdown" : ""
                  } ${_.kebabCase(node.title)}`}
                  role="menuitem"
                  data-submenu={
                    node.toggle ? _.kebabCase(node.toggle) : undefined
                  }
                  onClick={this.openSubMenu}
                >
                  {node.title !== "Search" ? (
                    node.title
                  ) : (
                    <span className="search-icon">
                      <span className="visually-hidden">{node.title}</span>
                      <SearchIcon />
                    </span>
                  )}
                </a>
                {node.toggle && (
                  <span className="primary-nav__caret">
                    <Caret />
                  </span>
                )}
              </React.Fragment>
            );
          })}
          <div id="sub-menus">
            <SubMenus
              id="js-tab-why-linode"
              columns={[<WhyPrimaryNav />, <WhyServicesNav />]}
              subMenuOpen={subMenuOpen}
            />
            <SubMenus
              id="js-tab-products"
              columns={[<ProductsFeatured />]}
              subMenuOpen={subMenuOpen}
            />
          </div>
        </nav>
      </>
    );
  }
}

export default props => (
  <StaticQuery
    query={graphql`
      query mainSiteNav {
        allHeaderPrimary {
          edges {
            node {
              id
              title
              url
              toggle
            }
          }
        }
      }
    `}
    render={data => <MainSiteNav data={data} {...props} />}
  />
);