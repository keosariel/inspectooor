/**
 * Inspectooor v0.0.1
 * Tested so far on Chrome, Firefox, and Safari
 * Kenneth Gabriel <gabriel@ally.wtf>
 */

function generateToolbarHTML() {
  let toolbar = document.createElement("div");
  toolbar.id = "toolbar";
  toolbar.innerHTML = `
    <button id="inspect">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#fff"
            viewBox="0 0 16 16"
        >
            <path
                d="M8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v5.34l-1.2.24a1.5 1.5 0 0 0-1.196 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5 5 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.6 2.6 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046z"
            />
        </svg>
    </button>
    `;
  return toolbar;
}

function generateSelectorHTML() {
  let selector = document.createElement("div");
  selector.id = "selector";
  selector.innerHTML = `
    <div id="selector-top"></div>
    <div id="selector-left"></div>
    <div id="selector-right"></div>
    <div id="selector-bottom"></div>
    `;
  return selector;
}

function generateMainMenuHTML() {
  let container = document.createElement("div");
  container.id = "mainmenu";
  container.classList.add("in_main_container");

  let htmlTree = document.createElement("div");
  let htClass = "in_html_tree";

  htmlTree.id = "htmlTree";
  htmlTree.classList.add(...htClass.split(" "));

  let htmlProps = document.createElement("div");
  let hpClass = "in_html_properties";

  htmlProps.id = "htmlProps";
  htmlProps.classList.add(...hpClass.split(" "));
  container.appendChild(htmlTree);
  container.appendChild(htmlProps);
  return container;
}

// Utilities

/**
 * @note This function is used to create a tree of the HTML elements
 * @param {HTMLElement} target
 */
function resizeTextarea(target) {
  target.style.height = "30px";
  target.style.height = target.scrollHeight + "px";
}

/**
 * @note This function is used to generate the position of the context menu
 * @param {Event} event
 * @param {HTMLElement} contextMenu
 * @returns {Object} menuPostion
 */
function generateMenuPosition(event, contextMenu) {
  var mousePosition = {};
  var menuPostion = {};
  var menuDimension = {};

  menuDimension.x = contextMenu.outerWidth();
  menuDimension.y = contextMenu.outerHeight();
  mousePosition.x = event.pageX;
  mousePosition.y = event.pageY;

  if (
    mousePosition.x + menuDimension.x >
    $(window).width() + $(window).scrollLeft()
  ) {
    menuPostion.x = mousePosition.x - menuDimension.x;
  } else {
    menuPostion.x = mousePosition.x;
  }

  if (
    mousePosition.y + menuDimension.y >
    $(window).height() + $(window).scrollTop()
  ) {
    menuPostion.y = mousePosition.y - menuDimension.y;
  } else {
    menuPostion.y = mousePosition.y;
  }

  return menuPostion;
}

/**
 * @note This function is update the selected element properties in the context menu
 * @param {HTMLElement} target
 * @returns {String} id
 */
function loadProperties(target) {
  let htmlProps = $("#htmlProps");
  htmlProps.empty();

  for (let i = 0; i < target[0].attributes.length; i++) {
    if (target[0].attributes[i].name === "data-cid") {
      continue;
    }

    let container = document.createElement("div");
    let propName = document.createElement("div");
    let propValue = document.createElement("textarea");

    container.classList.add("in_properties_container");
    propName.classList.add("in_element_prop_name");
    propValue.classList.add("in_element_prop_value");
    propValue.style.height = "30px";
    propValue.style.resize = "none";
    propValue.style.overflow = "hidden";

    $(propValue).on("input", (e) => resizeTextarea(e.target));
    $(propValue).on("focus", (e) => resizeTextarea(e.target));
    $(propValue).on("blur", (e) => {
      e.target.style.height = "30px";
    });

    propName.textContent = target[0].attributes[i].name + ":";
    propValue.value = target[0].attributes[i].value;
    $(propValue).on("input", function () {
      target.attr(target[0].attributes[i].name, $(this).val());
      outlineElement(target);
    });

    container.appendChild(propName);
    container.appendChild(propValue);

    if (
      target[0].attributes[i].name === "id" ||
      target[0].attributes[i].name === "class"
    ) {
      htmlProps.prepend(container);
    } else {
      htmlProps.append(container);
    }
  }
}

/**
 * @note Outline the selected element
 * @param {HTMLElement} target
 */
function outlineElement(target) {
  try {
    var targetOffset = target[0].getBoundingClientRect();
    (targetHeight = targetOffset.height), (targetWidth = targetOffset.width);
  } catch (e) {
    return;
  }

  if ($("#selector")[0].contains(target[0])) {
    return;
  }

  $("#selector").css("display", "block");

  var elements = {
    top: $("#selector-top"),
    left: $("#selector-left"),
    right: $("#selector-right"),
    bottom: $("#selector-bottom"),
  };

  elements.top.css({
    left: targetOffset.left - 4,
    top: targetOffset.top - 4,
    width: targetWidth + 5,
  });
  elements.bottom.css({
    top: targetOffset.top + targetHeight + 2,
    left: targetOffset.left - 3,
    width: targetWidth + 4,
  });
  elements.left.css({
    left: targetOffset.left - 5,
    top: targetOffset.top - 4,
    height: targetHeight + 8,
  });
  elements.right.css({
    left: targetOffset.left + targetWidth + 1,
    top: targetOffset.top - 4,
    height: targetHeight + 8,
  });
}

/**
 * @note Generate a random id
 * @returns {String} id
 */
function generateId() {
  return Math.random().toString(36).substring(7);
}

/**
 * @note Get the concatinated attributes of the selected element as a string
 * @param {HTMLElement} target
 * @returns {String} attributes
 */
function getAttributes(target) {
  let attributes = "";
  for (let i = 0; i < target[0].attributes.length; i++) {
    attributes += `<span class="in_element_attribute">${target[0].attributes[i].name + "="}</span><span class="in_element_attribute_value">"${target[0].attributes[i].value}"</span> `;
  }
  return attributes;
}

/**
 * @note Get the text content of the selected element (excluding the child elements text content)
 * @param {HTMLElement} element
 * @returns {String} textContent
 */
function getElementTextContent(element) {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join(" ");
}

/**
 * @note Create a tree of the selected element and its children
 * @param {HTMLElement} target
 * @param {Number} n - the depth of the tree
 */
function createTree(target, n) {
  let generatedId = generateId();
  let oldGeneratedId = target.attr("data-cid");

  let targetTagName = target[0].tagName.toLowerCase();
  let attributes = getAttributes(target).trim();
  attributes = attributes ? " " + attributes : "";

  let children = target.children();
  let childrenHTML = document.createElement("ul");
  childrenHTML.style.paddingLeft = `10px`;
  childrenHTML.style.margin = `0`;
  childrenHTML.style.listStyleType = `none`;

  let details = document.createElement("details");
  let summary = document.createElement("summary");
  let textContent = getElementTextContent(target[0]);

  summary.classList.add("in_element_summary");

  summary.innerHTML = `&lt;<span class="in_element_tag">${targetTagName}</span>${attributes}&gt;<br/>${textContent}`;

  if (oldGeneratedId) {
    summary.setAttribute("data-target", oldGeneratedId);
  } else {
    summary.setAttribute("data-target", generatedId);
    target.attr("data-cid", generatedId);
  }

  summary.addEventListener("click", function (e) {
    let clicked = e.target;
    if (clicked.tagName !== "SUMMARY") {
      clicked = e.target.parentElement;
    }
    let target = $(`[data-cid=${clicked.getAttribute("data-target")}]`);
    loadProperties(target);
  });

  summary.addEventListener("mousemove", function (e) {
    let target = $(`[data-cid=${e.target.getAttribute("data-target")}]`);
    outlineElement(target);
  });

  if (n > 0) {
    for (let i = 0; i < children.length; i++) {
      let child = $(children[i]);
      let li = document.createElement("li");
      li.appendChild(createTree(child, n - 1));
      childrenHTML.append(li);
    }
  }

  details.appendChild(summary);
  let endTag = document.createElement("li");
  endTag.classList.add("in_element_end_tag");
  endTag.innerHTML = `&lt;/<span class="in_element_tag">${targetTagName}</span>&gt;`;

  childrenHTML.appendChild(endTag);
  details.appendChild(childrenHTML);
  return details;
}

function main() {
  const html = $("html");
  const body = $("body");

  // Add the mainmenu and selector to the body
  body.prepend(generateMainMenuHTML());
  body.prepend(generateSelectorHTML());
  body.prepend(generateToolbarHTML());

  const mainmenu = $("#mainmenu");
  const htmlProps = $("#htmlProps");
  const htmlTree = $("#htmlTree");
  const allElements = $("*");

  body.on("mousemove", function (e) {
    let shouldInspect = body.attr("data-inspect") === "true";
    if (shouldInspect && mainmenu.css("display") === "none") {
      outlineElement($(e.target));
    }
  });

  window.addEventListener("scroll", function () {
    mainmenu.css("display", "none");
    $("#selector").css("display", "none");
  });

  const inspectToggle = $("#toolbar");
  inspectToggle.on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    let shouldInspect = body.attr("data-inspect") === "true";
    body.attr("data-inspect", !shouldInspect);
  });

  // Disable autocomplete for all input fields
  const inputs = $("input");
  inputs.attr("autocomplete", "off");

  mainmenu.contains = function (target) {
    return this[0].contains(target);
  };

  inspectToggle.contains = function (target) {
    return this[0].contains(target);
  };

  html.addClass("relative");
  allElements.on("click", function (e) {
    let shouldInspect = body.attr("data-inspect") === "true";

    if (
      !shouldInspect ||
      mainmenu.contains(e.target) ||
      inspectToggle.contains(e.target)
    ) {
      return;
    }

    if (e.target.tagName !== "HTML" && mainmenu.css("display") === "none") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      let position = generateMenuPosition(e, mainmenu);
      let generatedId = generateId();
      let oldGeneratedId = e.target.getAttribute("data-cid");

      mainmenu.css("top", `${position.y + 30}px`);
      mainmenu.css("left", `${position.x}px`);
      mainmenu.css("display", "grid");

      loadProperties($(e.target));
      if (oldGeneratedId) {
        htmlProps.attr("data-target", oldGeneratedId);
      } else {
        htmlProps.attr("data-target", generatedId);
        $(e.target).attr("data-cid", generatedId);
      }

      htmlTree.empty();
      htmlTree.append(createTree($(e.target), 20));
    } else if (!(mainmenu.css("display") === "none")) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      mainmenu.css("display", "none");
    }
  });
}

$(document).ready(main);
