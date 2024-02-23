/**
 * Inspectooor v1.0.0
 * Tested so far on Chrome, Firefox, and Safari
 * Kenneth Gabriel <gabriel@ally.wtf>
 */

function baseStyles() {
  let style = document.createElement("style");
  style.innerHTML = `
    body * { cursor: pointer !important; }
    selector > div { transition: all 300ms ease; }
  `;
  return style;
}

function generateSelectorHTML() {
  let selector = document.createElement("div");
  selector.id = "selector";
  selector.innerHTML = `
    <div id="selector-top" class="fixed bg-[#ff69ff] h-[2px]"></div>
    <div id="selector-left" class="fixed bg-[#ff69ff] w-[2px]"></div>
    <div id="selector-right" class="fixed bg-[#ff69ff] w-[2px]"></div>
    <div id="selector-bottom" class="fixed bg-[#ff69ff] h-[2px]"></div>
    `;
  return selector;
}

function generateMainMenuHTML() {
  let container = document.createElement("div");
  container.id = "mainmenu";
  container.classList.add(
    "absolute",
    "z-[1000000000000000]",
    "hidden",
    "rounded",
    "border",
    "bg-white/30",
    "backdrop-blur-xl",
    "shadow-lg",
    "p-4",
    "grid",
    "gap-6",
    "grid-cols-1",
    "w-[500px]",
  );

  let htmlTree = document.createElement("div");
  let htClass =
    "bg-gray-50/30 max-h-[300px] overflow-x-auto rounded border p-2 !font-mono !text-xs backdrop-blur-xl";

  htmlTree.id = "htmlTree";
  htmlTree.classList.add(...htClass.split(" "));

  let htmlProps = document.createElement("div");
  let hpClass = "max-h-[300px] !font-mono overflow-y-auto";

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

    container.classList.add("mb-2", "grid", "grid-cols-8", "gap-2");
    propName.classList.add("text-blue-700", "text-xs", "col-span-2");
    propValue.classList.add(
      "autoresize",
      "col-span-6",
      "resize-none",
      "rounded",
      "border",
      "bg-gray-200/30",
      "p-2",
      "text-xs",
      "outline-none",
      "backdrop-blur-md",
      "text-green-700",
    );
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
    attributes += `<span class="text-blue-700">${target[0].attributes[i].name + "="}</span><span class="text-green-700">"${target[0].attributes[i].value}"</span> `;
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
  let attributes = getAttributes(target);

  let children = target.children();
  let childrenHTML = document.createElement("ul");
  childrenHTML.style.paddingLeft = `10px`;
  childrenHTML.style.margin = `0`;
  childrenHTML.style.listStyleType = `none`;

  let details = document.createElement("details");
  let summary = document.createElement("summary");
  let textContent = getElementTextContent(target[0]);

  summary.classList.add(
    "hover:bg-gray-200/30",
    "hover:backdrop-blur-md",
    "hover:border-gray-500",
    "p-1",
    "cursor-pointer",
    "rounded-md",
    "border-transparent",
  );

  summary.innerHTML = `&lt;<span class="text-red-700">${targetTagName}</span> ${attributes.trim()}&gt;<br/>${textContent}`;

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
  endTag.innerHTML = `&lt;/<span class="text-red-700">${targetTagName}</span>&gt;`;

  childrenHTML.appendChild(endTag);
  details.appendChild(childrenHTML);
  return details;
}

function main() {
  const html = $("html");
  const body = $("body");

  // Add the mainmenu and selector to the body
  html.append(baseStyles());
  body.prepend(generateMainMenuHTML());
  body.prepend(generateSelectorHTML());

  const mainmenu = $("#mainmenu");
  const htmlProps = $("#htmlProps");
  const htmlTree = $("#htmlTree");

  // Disable autocomplete for all input fields
  const inputs = $("input");
  inputs.attr("autocomplete", "off");

  mainmenu.contains = function (target) {
    return this[0].contains(target);
  };

  html.addClass("relative");
  html.on("click", function (e) {
    if (
      !mainmenu.contains(e.target) &&
      e.target.tagName !== "HTML" &&
      mainmenu.hasClass("hidden")
    ) {
      let position = generateMenuPosition(e, mainmenu);
      let generatedId = generateId();
      let oldGeneratedId = e.target.getAttribute("data-cid");

      mainmenu.css("top", `${position.y + 30}px`);
      mainmenu.css("left", `${position.x}px`);
      mainmenu.removeClass("hidden");

      loadProperties($(e.target));
      if (oldGeneratedId) {
        htmlProps.attr("data-target", oldGeneratedId);
      } else {
        htmlProps.attr("data-target", generatedId);
        $(e.target).attr("data-cid", generatedId);
      }

      htmlTree.empty();
      htmlTree.append(createTree($(e.target), 20));
    } else if (!mainmenu.contains(e.target) && !mainmenu.hasClass("hidden")) {
      mainmenu.addClass("hidden");
    }
  });
}

$(document).ready(main);
